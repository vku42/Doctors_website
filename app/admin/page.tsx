"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Search, 
  TrendingUp, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  RefreshCw,
  Eye,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Appointment {
  _id: string;
  bookingId: string;
  appointmentType: string;
  price: number;
  date: string;
  timeSlot: string;
  patientName: string;
  age: number | string;
  gender: string;
  mobile: string;
  email?: string;
  reason: string;
  notes?: string;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAppointments = async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error("Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Appointments refreshed!");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: "completed" | "cancelled") => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Appointment status updated to ${status}!`);
        // Update local state
        setAppointments(prev => 
          prev.map(appt => appt._id === id ? { ...appt, status } : appt)
        );
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment(prev => prev ? { ...prev, status } : null);
        }
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  // Stats calculation
  const totalRevenue = appointments
    .filter(appt => appt.status !== "cancelled")
    .reduce((sum, appt) => sum + appt.price, 0);

  const completedCount = appointments.filter(appt => appt.status === "completed").length;
  const pendingCount = appointments.filter(appt => appt.status === "confirmed").length;
  
  const todayAppointments = appointments.filter(appt => {
    const today = new Date().toDateString();
    const apptDate = new Date(appt.date).toDateString();
    return today === apptDate;
  });

  // Filtered Appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.mobile.includes(searchTerm);
      
    const matchesTab = activeFilter === "all" || appt.status === activeFilter;
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-accent/10 text-accent border-accent/20";
    }
  };

  const formatAppointmentType = (type: string) => {
    switch (type) {
      case "general": return "General Consultation";
      case "followup": return "Follow-up Visit";
      case "package": return "Full Health Package";
      case "urgent": return "Same-day Urgent Care";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 relative overflow-hidden">
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-3">
              Clinic Administration
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading text-primary leading-tight">Patient Console</h1>
            <p className="text-text-grey text-base mt-1.5">Manage schedule, verify bookings, and coordinate consultations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchAppointments(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 bg-white border border-slate-100 hover:border-accent/30 transition-colors text-text-dark text-sm font-bold rounded-full px-5 py-3 shadow-sm hover:shadow"
            >
              <RefreshCw className={`w-4 h-4 text-accent ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Console
            </button>
            <Link 
              href="/"
              className="bg-gradient-to-r from-accent to-[#0ea5e9] text-white text-sm font-bold rounded-full px-6 py-3 hover:shadow-lg transition-all hover:translate-y-[-1px] shadow-md shadow-accent/20"
            >
              Exit Console
            </Link>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-primary/20 transition-colors"
          >
            <div>
              <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Today&apos;s Visits</p>
              <h3 className="text-3xl font-black text-primary font-heading">{todayAppointments.length}</h3>
              <p className="text-xs text-text-grey mt-2">Appointments scheduled today</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-accent/20 transition-colors"
          >
            <div>
              <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Pending Checkups</p>
              <h3 className="text-3xl font-black text-accent font-heading">{pendingCount}</h3>
              <p className="text-xs text-text-grey mt-2">Patients awaiting consultation</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-success/20 transition-colors"
          >
            <div>
              <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Completed Visits</p>
              <h3 className="text-3xl font-black text-success font-heading">{completedCount}</h3>
              <p className="text-xs text-text-grey mt-2">Satisfied patient consults</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-gold/20 transition-colors"
          >
            <div>
              <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Estimated Revenue</p>
              <h3 className="text-3xl font-black text-gold font-heading">{todayAppointments.length > 0 ? `₹${totalRevenue}` : "₹0"}</h3>
              <p className="text-xs text-text-grey mt-2">Total gross clinic billing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Filters & Table (70%) */}
          <div className="w-full lg:w-[70%] space-y-6">
            
            {/* Search & Tabs Panel */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {(["all", "confirmed", "completed", "cancelled"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all uppercase tracking-wider ${
                      activeFilter === tab
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-text-dark border-gray-200"
                    }`}
                  >
                    {tab} ({
                      tab === "all" ? appointments.length : appointments.filter(a => a.status === tab).length
                    })
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-grey" />
                <input
                  type="text"
                  placeholder="Search name, phone, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            {/* Loading / Zero State / Appointment Table */}
            {isLoading ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-text-grey">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-lg font-bold text-primary mb-1">No Appointments Found</h3>
                <p className="text-text-grey text-sm max-w-sm mx-auto">
                  We couldn't find any appointments matching your criteria. Try adjusting your filter or search search tags.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-slate-50/50 text-text-grey text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">ID & Patient</th>
                        <th className="py-4 px-6">Type & Fee</th>
                        <th className="py-4 px-6">Schedule</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <AnimatePresence mode="popLayout">
                        {filteredAppointments.map((appt) => (
                          <motion.tr 
                            key={appt._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              selectedAppointment?._id === appt._id ? "bg-accent/5" : ""
                            }`}
                            onClick={() => setSelectedAppointment(appt)}
                          >
                            {/* ID & Patient */}
                            <td className="py-4 px-6">
                              <div className="font-bold text-primary text-sm">{appt.patientName}</div>
                              <div className="text-xs text-text-grey font-mono mt-0.5">{appt.bookingId}</div>
                            </td>

                            {/* Type & Fee */}
                            <td className="py-4 px-6">
                              <div className="text-sm font-medium text-text-dark">{formatAppointmentType(appt.appointmentType)}</div>
                              <div className="text-xs text-accent font-bold mt-0.5">₹{appt.price}</div>
                            </td>

                            {/* Schedule */}
                            <td className="py-4 px-6">
                              <div className="text-sm font-medium text-text-dark">
                                {new Date(appt.date).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric"
                                })}
                              </div>
                              <div className="text-xs text-text-grey flex items-center gap-1 mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {appt.timeSlot}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(appt.status)}`}>
                                {appt.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  title="View Details"
                                  onClick={() => setSelectedAppointment(appt)}
                                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-text-grey"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {appt.status === "confirmed" && (
                                  <>
                                    <button
                                      title="Mark Completed"
                                      onClick={() => handleUpdateStatus(appt._id, "completed")}
                                      className="p-1.5 bg-success/10 hover:bg-success/20 text-success rounded-full transition-colors"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      title="Cancel Appointment"
                                      onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                                      className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Detail Inspector Drawer (30%) */}
          <div className="w-full lg:w-[30%] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-heading text-lg font-bold text-primary border-b border-gray-100 pb-3">
              Appointment Details
            </h3>

            {selectedAppointment ? (
              <motion.div 
                key={selectedAppointment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Stats */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-primary text-lg">{selectedAppointment.patientName}</h4>
                    <p className="text-xs text-text-grey font-mono mt-0.5">{selectedAppointment.bookingId}</p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>

                {/* Main Spec List */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-sm">
                  <div>
                    <span className="text-text-grey text-xs font-semibold block mb-0.5">Consultation</span>
                    <span className="font-bold text-text-dark block">{formatAppointmentType(selectedAppointment.appointmentType)}</span>
                  </div>
                  <div>
                    <span className="text-text-grey text-xs font-semibold block mb-0.5">Fee</span>
                    <span className="font-bold text-accent block">₹{selectedAppointment.price}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-text-grey text-xs font-semibold block mb-0.5">Age / Gender</span>
                    <span className="font-semibold text-text-dark block">{selectedAppointment.age} Yrs / {selectedAppointment.gender}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-text-grey text-xs font-semibold block mb-0.5">Schedule</span>
                    <span className="font-semibold text-text-dark block">
                      {new Date(selectedAppointment.date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short"
                      })} at {selectedAppointment.timeSlot}
                    </span>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-text-dark">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-grey shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-text-grey text-xs font-medium block">Phone Number</span>
                      <span className="font-semibold block">{selectedAppointment.mobile}</span>
                    </div>
                  </div>

                  {selectedAppointment.email && (
                    <div className="flex items-center gap-3 text-sm text-text-dark">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-grey shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-text-grey text-xs font-medium block">Email Address</span>
                        <span className="font-semibold block truncate">{selectedAppointment.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes & Reason */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase text-text-grey tracking-wider mb-1">Reason for Visit</h5>
                    <p className="text-sm bg-slate-50 border border-gray-100 rounded-xl p-3 text-text-dark font-medium leading-relaxed">
                      {selectedAppointment.reason}
                    </p>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div>
                      <h5 className="text-xs font-bold uppercase text-text-grey tracking-wider mb-1">Patient Notes</h5>
                      <p className="text-sm bg-slate-50 border border-gray-100 rounded-xl p-3 text-text-dark leading-relaxed">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Actions */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <a
                    href={`https://wa.me/${selectedAppointment.mobile.replace(/\+/g, "").replace(/\s/g, "")}?text=Hi%20${encodeURIComponent(selectedAppointment.patientName)},%20this%20is%20Dr.%20Sharma's%20Clinic.%20Your%20appointment%20${selectedAppointment.bookingId}%20is%20scheduled%20for%20${encodeURIComponent(new Date(selectedAppointment.date).toLocaleDateString())}%20at%20${encodeURIComponent(selectedAppointment.timeSlot)}.%20Please%20let%20us%20know%20if%20you%20have%20any%20queries!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-success text-white hover:bg-success/90 transition-colors text-sm font-semibold rounded-full py-2.5 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Reminder
                  </a>

                  {selectedAppointment.status === "confirmed" && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedAppointment._id, "completed")}
                        className="inline-flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary/95 transition-colors text-xs font-semibold rounded-full py-2"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAppointment._id, "cancelled")}
                        className="inline-flex items-center justify-center gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-xs font-semibold rounded-full py-2"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="text-center py-12 text-text-grey text-sm">
                <Eye className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                Select an appointment to inspect patient details, history, and perform actions.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
