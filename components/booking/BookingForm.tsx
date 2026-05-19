"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Zod Schema for validation
const bookingSchema = z.object({
  appointmentType: z.string().min(1, "Please select an appointment type"),
  date: z.date({
    message: "Please select a date",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Please select a gender" }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  reason: z.string().min(1, "Please select a reason for visit"),
  notes: z.string().optional(),
  isFirstVisit: z.boolean(),
  whatsappReminder: z.boolean(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const appointmentTypes = [
  { id: "general", title: "General Consultation", price: 300, icon: User },
  { id: "followup", title: "Follow-up Visit", price: 150, icon: Clock },
  { id: "checkup", title: "Health Checkup Package", price: 500, icon: CheckCircle2 },
  { id: "urgent", title: "Urgent/Same-day", price: 400, icon: Phone },
];

const timeSlots = {
  morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
  evening: ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM"],
};

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      isFirstVisit: false,
      whatsappReminder: true,
    },
  });

  const { watch, setValue, trigger, formState: { errors } } = form;
  const selectedDate = watch("date");
  const selectedTime = watch("timeSlot");
  const selectedType = watch("appointmentType");

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["appointmentType", "date", "timeSlot"]);
    } else if (step === 2) {
      isValid = await trigger(["patientName", "age", "gender", "mobile", "email", "reason"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Find price based on type
      const price = appointmentTypes.find(t => t.id === data.appointmentType)?.price || 300;
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, price }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setBookingSuccess(result.appointment);
      } else {
        alert(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit booking. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center"
      >
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold font-heading text-primary mb-2">Appointment Confirmed!</h2>
        <p className="text-text-grey mb-8">We have sent a confirmation to your mobile number.</p>
        
        <div className="bg-off-white rounded-2xl p-6 text-left mb-8 max-w-md mx-auto border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-text-grey font-medium">Reference ID</span>
            <span className="font-bold font-mono text-primary">{bookingSuccess.bookingId}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-grey">Patient Name</span>
              <span className="font-medium text-text-dark">{bookingSuccess.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-grey">Date & Time</span>
              <span className="font-medium text-text-dark">{format(new Date(bookingSuccess.date), 'dd MMM yyyy')} at {bookingSuccess.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-grey">Consultation Fee</span>
              <span className="font-medium text-text-dark">₹{bookingSuccess.price}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="rounded-full bg-accent hover:bg-accent/90" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
          <Button variant="outline" className="rounded-full border-accent text-accent hover:bg-accent/5" onClick={() => window.location.reload()}>
            Book Another
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="flex items-center justify-between px-8 pt-8 pb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-400'
            }`}>
              {s}
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-primary' : 'text-gray-400'}`}>
              {s === 1 ? 'Schedule' : s === 2 ? 'Details' : 'Confirm'}
            </span>
          </div>
        ))}
        {/* Connecting Lines */}
        <div className="absolute left-16 right-16 top-13 h-1 bg-gray-100 z-0 hidden sm:block -mt-6">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-in-out" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SCHEDULE */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Select Appointment Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appointmentTypes.map((type) => {
                      const isSelected = selectedType === type.id;
                      const Icon = type.icon;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => {
                            setValue("appointmentType", type.id, { shouldValidate: true });
                          }}
                          className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${
                            isSelected ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-accent/30'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-text-dark">{type.title}</p>
                            <p className="text-sm font-medium text-accent">₹{type.price}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {errors.appointmentType && <p className="text-red-500 text-sm mt-2">{errors.appointmentType.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Select Date</h3>
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm flex items-center hover:bg-gray-50 transition-colors",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-accent" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setValue("date", date as Date, { shouldValidate: true })}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || date.getDay() === 0}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date.message as string}</p>}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Select Time</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-text-grey mb-2">Morning Slots</p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.morning.map(time => (
                            <div 
                              key={time}
                              onClick={() => setValue("timeSlot", time, { shouldValidate: true })}
                              className={`text-center text-sm py-2 rounded-lg cursor-pointer transition-colors border ${
                                selectedTime === time 
                                  ? 'bg-accent text-white border-accent' 
                                  : 'bg-white border-gray-200 text-text-dark hover:border-accent/50'
                              }`}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-grey mb-2">Evening Slots</p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.evening.map(time => (
                            <div 
                              key={time}
                              onClick={() => setValue("timeSlot", time, { shouldValidate: true })}
                              className={`text-center text-sm py-2 rounded-lg cursor-pointer transition-colors border ${
                                selectedTime === time 
                                  ? 'bg-accent text-white border-accent' 
                                  : 'bg-white border-gray-200 text-text-dark hover:border-accent/50'
                              }`}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors.timeSlot && <p className="text-red-500 text-sm mt-2">{errors.timeSlot.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button type="button" onClick={handleNextStep} className="rounded-full bg-primary hover:bg-primary/90 px-8">
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-primary mb-4">Patient Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name *</Label>
                    <Input id="patientName" placeholder="e.g. Rahul Patel" {...form.register("patientName")} />
                    {errors.patientName && <p className="text-red-500 text-sm">{errors.patientName.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input id="mobile" placeholder="10-digit number" {...form.register("mobile")} />
                    {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" placeholder="Years" {...form.register("age")} />
                    {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select onValueChange={(val) => setValue("gender", val as any, { shouldValidate: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input id="email" type="email" placeholder="For email confirmation" {...form.register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Reason for Visit *</Label>
                    <Select onValueChange={(val) => setValue("reason", val as string, { shouldValidate: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fever/Cold">Fever / Cold / Cough</SelectItem>
                        <SelectItem value="Stomach Issues">Stomach / Digestion Issues</SelectItem>
                        <SelectItem value="Diabetes/BP Follow-up">Diabetes / BP Follow-up</SelectItem>
                        <SelectItem value="General Checkup">General Health Checkup</SelectItem>
                        <SelectItem value="Skin Issues">Skin Issues / Allergy</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea id="notes" placeholder="Any specific symptoms or questions?" {...form.register("notes")} />
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <Label className="text-base font-medium">Is this your first visit?</Label>
                  <RadioGroup defaultValue="no" onValueChange={(val) => setValue("isFirstVisit", val === "yes")} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={handleNextStep} className="rounded-full bg-primary hover:bg-primary/90 px-8">
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-primary mb-4">Confirm Appointment</h3>
                
                <div className="bg-accent-light/30 rounded-2xl p-6 border border-accent/20 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/20 p-3 rounded-full text-accent">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-dark text-lg">
                        {appointmentTypes.find(t => t.id === selectedType)?.title}
                      </p>
                      <p className="text-text-grey font-medium">
                        {selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")} at {selectedTime}
                      </p>
                      <p className="text-accent font-bold mt-1">
                        Fee: ₹{appointmentTypes.find(t => t.id === selectedType)?.price}
                      </p>
                    </div>
                  </div>

                  <hr className="border-accent/10" />

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-text-grey">Patient:</span>
                    <span className="font-medium">{watch("patientName")} ({watch("age")} / {watch("gender")})</span>
                    
                    <span className="text-text-grey">Mobile:</span>
                    <span className="font-medium">+91 {watch("mobile")}</span>
                    
                    <span className="text-text-grey">Reason:</span>
                    <span className="font-medium">{watch("reason")}</span>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="whatsapp" className="mt-1" defaultChecked onChange={(e) => setValue("whatsappReminder", e.target.checked)} />
                    <label htmlFor="whatsapp" className="text-sm text-text-dark cursor-pointer">
                      Send WhatsApp reminder 2 hours before the appointment
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="policy" className="mt-1" required />
                    <label htmlFor="policy" className="text-sm text-text-dark cursor-pointer">
                      I agree to the clinic&apos;s cancellation policy (Free cancellation up to 4 hours before slot).
                    </label>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-full" disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Edit Details
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-accent hover:bg-accent/90 text-white px-8 h-12 shadow-lg shadow-accent/20">
                    {isSubmitting ? "Processing..." : "✓ Confirm Appointment"}
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
