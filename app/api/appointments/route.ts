import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Appointment } from '@/lib/models/Appointment';
import nodemailer from 'nodemailer';
import * as z from 'zod';
import fs from 'fs';
import path from 'path';

// Simple validation schema for the backend
const backendBookingSchema = z.object({
  appointmentType: z.string(),
  price: z.number(),
  date: z.string().or(z.date()),
  timeSlot: z.string(),
  patientName: z.string(),
  age: z.union([z.string(), z.number()]),
  gender: z.string(),
  mobile: z.string(),
  email: z.string().email().optional().or(z.literal("")),
  reason: z.string(),
  notes: z.string().optional(),
  isFirstVisit: z.boolean(),
  whatsappReminder: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate data
    const validatedData = backendBookingSchema.parse(body);

    let newAppointment;
    let dbConnected = false;

    // 2. Try to connect to DB
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (e: any) {
      console.warn("MongoDB connection failed, falling back to local file storage:", e.message);
    }

    if (dbConnected) {
      // 3. Generate unique booking ID (APPT-2024-XXXX) using DB
      const count = await Appointment.countDocuments();
      const currentYear = new Date().getFullYear();
      const bookingId = `APPT-${currentYear}-${String(count + 1).padStart(4, '0')}`;

      // 4. Save to DB
      newAppointment = await Appointment.create({
        ...validatedData,
        bookingId,
        status: 'confirmed',
      });
    } else {
      // Fallback: Save to a local JSON file
      const filePath = path.join(process.cwd(), 'appointments.json');
      let appointments = [];
      if (fs.existsSync(filePath)) {
        try {
          appointments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
          appointments = [];
        }
      }
      const count = appointments.length;
      const currentYear = new Date().getFullYear();
      const bookingId = `APPT-${currentYear}-${String(count + 1).padStart(4, '0')}`;
      
      newAppointment = {
        _id: `mock-${Date.now()}`,
        ...validatedData,
        bookingId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      appointments.push(newAppointment);
      fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
      console.log("Appointment saved to local JSON file successfully:", bookingId);
    }

    // 5. Send Email if email is provided (fire and forget to not block response)
    if (validatedData.email) {
      sendConfirmationEmail(validatedData.email, newAppointment).catch(err => 
        console.error("Failed to send email:", err)
      );
    }

    // 6. Return response
    return NextResponse.json(
      { success: true, appointment: newAppointment },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data provided", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    let appointments = [];
    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (e: any) {
      console.warn("MongoDB connection failed, falling back to local file storage for GET:", e.message);
    }

    if (dbConnected) {
      appointments = await Appointment.find({}).sort({ createdAt: -1 });
    } else {
      const filePath = path.join(process.cwd(), 'appointments.json');
      if (fs.existsSync(filePath)) {
        try {
          appointments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          appointments.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (err) {
          appointments = [];
        }
      }
    }

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("GET Appointments API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateFields } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing required field id" }, { status: 400 });
    }

    let updatedAppointment;
    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (e: any) {
      console.warn("MongoDB connection failed, falling back to local file storage for PATCH:", e.message);
    }

    if (dbConnected) {
      updatedAppointment = await Appointment.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    } else {
      const filePath = path.join(process.cwd(), 'appointments.json');
      if (fs.existsSync(filePath)) {
        let appointments = [];
        try {
          appointments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
          appointments = [];
        }

        const index = appointments.findIndex((appt: any) => appt._id === id);
        if (index !== -1) {
          appointments[index] = { ...appointments[index], ...updateFields };
          updatedAppointment = appointments[index];
          fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
        } else {
          return NextResponse.json({ error: "Appointment not found in local storage" }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: "No appointments file found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    console.error("PATCH Appointment API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing required field id" }, { status: 400 });
    }

    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (e: any) {
      console.warn("MongoDB connection failed, falling back to local file storage for DELETE:", e.message);
    }

    if (dbConnected) {
      await Appointment.findByIdAndDelete(id);
    } else {
      const filePath = path.join(process.cwd(), 'appointments.json');
      if (fs.existsSync(filePath)) {
        let appointments = [];
        try {
          appointments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
          appointments = [];
        }

        const initialLength = appointments.length;
        appointments = appointments.filter((appt: any) => appt._id !== id);
        
        if (appointments.length < initialLength) {
          fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
        } else {
          return NextResponse.json({ error: "Appointment not found in local storage" }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: "No appointments file found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("DELETE Appointment API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function sendConfirmationEmail(userEmail: string, appointment: any) {
  // Check if credentials are placeholders
  const emailUser = process.env.NODEMAILER_EMAIL;
  const emailPass = process.env.NODEMAILER_PASSWORD;
  
  if (!emailUser || emailUser.includes('your@email') || !emailPass || emailPass.includes('app_password')) {
    console.log("Nodemailer credentials not configured. Skipping confirmation email sending.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const formattedDate = new Date(appointment.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"Dr. Sharma's Clinic" <${emailUser}>`,
    to: userEmail,
    subject: `Appointment Confirmed: ${appointment.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1A1A2E; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #0A2540; padding: 20px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0;">Appointment Confirmed</h1>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${appointment.patientName}</strong>,</p>
          <p>Your appointment with Dr. Rajesh Sharma has been confirmed. Below are the details of your visit:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #F8FAFB; border-radius: 8px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;"><strong>Reference ID:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${appointment.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;"><strong>Date:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;"><strong>Time:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${appointment.timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Consultation Fee:</strong></td>
              <td style="padding: 10px;">₹${appointment.price}</td>
            </tr>
          </table>

          <p><strong>Clinic Address:</strong><br/>
          Shop 12, Green Park Complex, Adajan, Surat — 395009</p>
          
          <p>Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, please contact us at +91 98765 43210.</p>
          
          <p>Wishing you good health,<br/><strong>Dr. Sharma's Clinic</strong></p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
