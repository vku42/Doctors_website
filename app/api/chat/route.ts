import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, isLoopFinished, tool } from 'ai';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { Appointment } from '@/lib/models/Appointment';
import fs from 'fs';
import path from 'path';

export const maxDuration = 30;

const getSystemPrompt = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  return `
You are Dr. AI, a friendly medical assistant for Dr. Sharma's Clinic in Surat, Gujarat, India.

CLINIC INFORMATION:
- Doctor: Dr. Rajesh Sharma, MBBS MD, General Physician
- Address: TF-08, Anaya Business Center, VIP Road, Surat — 395009
- Phone: +91 98765 43210
- Timings: Mon-Sat 9am-1pm and 5pm-9pm, Sunday emergency only 10am-12pm
- Services: General consultation (₹300), Follow-up (₹150), Health checkup (₹500), Urgent/Same-day (₹400)

YOUR PERSONALITY:
- Warm, caring, professional
- Speak in simple Hindi/English mix when appropriate
- Always reassuring, never alarming
- Use "ji" suffix when appropriate for Indian cultural warmth

YOUR RULES:
1. NEVER diagnose medical conditions.
2. NEVER recommend specific medications or dosages.
3. For serious symptoms (chest pain, difficulty breathing, high fever) — always say "please visit the clinic immediately or call emergency services at 108".
4. Always encourage booking an appointment for proper medical advice.
5. You CAN answer general health FAQs, clinic information, booking help.
6. Keep responses concise — under 100 words usually.
7. End responses with a polite question or action.

INTERACTIVE BOOKING PROCESS:
When a patient expresses interest in booking an appointment, you must guide them through the booking process by asking for information **ONE-BY-ONE**.
- NEVER ask multiple questions at once. Ask only ONE question in each response.
- If the user provides multiple details in a single message, acknowledge them and ask for the next missing detail.
- Collect the details in this exact order:
  1. Full Name of the patient (e.g. "Could you please tell me your full name?")
  2. Mobile Number (verify it is a 10-digit number)
  3. Age of the patient
  4. Gender of the patient (Male/Female/Other)
  5. Preferred Date of the appointment (Ask them for a date and parse it. Today's date is ${todayStr}.)
  6. Preferred Time Slot (remind them of timings: Mon-Sat 9am-1pm & 5pm-9pm, Sun 10am-12pm)
  7. Reason for consultation (e.g. fever, head pain, routine checkup)
  8. Email Address (Tell them they can say "skip" to skip providing email)
- Once you have successfully collected ALL of the above 8 fields, call the 'bookAppointment' tool immediately.
- After calling the tool, confirm the appointment reference ID and summarize the appointment details.
`;
};

interface BookAppointmentInput {
  patientName: string;
  mobile: string;
  age: number;
  gender: string;
  date: string;
  timeSlot: string;
  reason: string;
  email?: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Preprocess messages to ensure parts array is present for convertToModelMessages
    const processedMessages = (messages || []).map((msg: any) => {
      if (!msg.parts || !Array.isArray(msg.parts)) {
        return {
          ...msg,
          parts: [{ type: 'text', text: msg.content || '' }]
        };
      }
      return msg;
    });

    const modelMessages = await convertToModelMessages(processedMessages);

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: getSystemPrompt(),
      messages: modelMessages,
      stopWhen: isLoopFinished(),
      tools: {
        bookAppointment: tool({
          description: "Book an appointment at Dr. Sharma's Clinic. Call this ONLY after collecting all required patient information.",
          inputSchema: z.object({
            patientName: z.string().describe('The full name of the patient'),
            mobile: z.string().describe('10-digit mobile number'),
            age: z.number().describe('Age of the patient'),
            gender: z.string().describe('Gender of the patient (Male, Female, Other)'),
            date: z.string().describe('Preferred date for the appointment in YYYY-MM-DD format'),
            timeSlot: z.string().describe('Preferred time slot (e.g. 10:00 AM, 6:30 PM, etc.)'),
            reason: z.string().describe('Brief reason for booking the consultation'),
            email: z.string().optional().describe('Email address of the patient (optional)'),
          }),
          execute: async ({ patientName, mobile, age, gender, date, timeSlot, reason, email }: BookAppointmentInput) => {
            let dbConnected = false;
            try {
              await connectToDatabase();
              dbConnected = true;
            } catch (e: any) {
              console.warn("MongoDB connection failed in Chat API, falling back to local file storage:", e.message);
            }

            let isFirstVisit = true;
            let newAppointment;

            if (dbConnected) {
              // Check if mobile exists for Returning Customer logic
              const existingCount = await Appointment.countDocuments({ mobile });
              isFirstVisit = existingCount === 0;

              const count = await Appointment.countDocuments();
              const currentYear = new Date().getFullYear();
              const bookingId = `APPT-${currentYear}-${String(count + 1).padStart(4, '0')}`;

              newAppointment = await Appointment.create({
                appointmentType: "General Consultation",
                price: 300,
                date: new Date(date),
                timeSlot,
                patientName,
                age: Number(age),
                gender,
                mobile,
                email: email || "",
                reason,
                notes: "Booked via Chatbot Assistant",
                isFirstVisit,
                whatsappReminder: true,
                bookingId,
                status: 'confirmed',
                paymentStatus: 'pending',
              });
            } else {
              const filePath = path.join(process.cwd(), 'appointments.json');
              let appointments = [];
              if (fs.existsSync(filePath)) {
                try {
                  appointments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (err) {
                  appointments = [];
                }
              }

              // Check if mobile exists for Returning Customer logic
              const existingCount = appointments.filter((a: any) => a.mobile === mobile).length;
              isFirstVisit = existingCount === 0;

              const count = appointments.length;
              const currentYear = new Date().getFullYear();
              const bookingId = `APPT-${currentYear}-${String(count + 1).padStart(4, '0')}`;
              
              newAppointment = {
                _id: `mock-${Date.now()}`,
                appointmentType: "General Consultation",
                price: 300,
                date: new Date(date),
                timeSlot,
                patientName,
                age: Number(age),
                gender,
                mobile,
                email: email || "",
                reason,
                notes: "Booked via Chatbot Assistant",
                isFirstVisit,
                whatsappReminder: true,
                bookingId,
                status: 'confirmed',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
              };
              
              appointments.push(newAppointment);
              fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
              console.log("Appointment saved to local JSON file via AI Chat booking successfully:", bookingId);
            }

            return { success: true, bookingId: newAppointment.bookingId, appointment: newAppointment };
          }
        })
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500 });
  }
}
