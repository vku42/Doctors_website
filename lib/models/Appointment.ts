import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  bookingId: string;
  appointmentType: string;
  price: number;
  date: Date;
  timeSlot: string;
  patientName: string;
  age: number;
  gender: string;
  mobile: string;
  email?: string;
  reason: string;
  notes?: string;
  isFirstVisit: boolean;
  whatsappReminder: boolean;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  bookingId: { type: String, unique: true, required: true },
  appointmentType: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  reason: { type: String, required: true },
  notes: { type: String },
  isFirstVisit: { type: Boolean, default: false },
  whatsappReminder: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError in Next.js HMR
export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
