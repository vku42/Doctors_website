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
  X,
  Download,
  Trash2,
  Edit,
  Printer,
  IndianRupee
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
  isFirstVisit?: boolean;
  status: "confirmed" | "completed" | "cancelled";
  paymentStatus?: "pending" | "paid";
  createdAt: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchAppointments();
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === "Vehon00" && loginPassword === "vku123") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Dashboard");
      fetchAppointments();
    } else {
      toast.error("Invalid Admin ID or Password");
    }
  };

  const handleUpdateStatus = async (id: string, status: "completed" | "cancelled") => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Status updated to ${status}!`);
        setAppointments(prev => prev.map(appt => appt._id === id ? { ...appt, status } : appt));
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment(prev => prev ? { ...prev, status } : null);
        }
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleTogglePayment = async (id: string, currentStatus: "pending" | "paid" | undefined) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Payment marked as ${newStatus.toUpperCase()}`);
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, paymentStatus: newStatus } : a));
        if (selectedAppointment?._id === id) {
          setSelectedAppointment(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
        }
      } else {
        toast.error("Failed to update payment");
      }
    } catch (error) {
      toast.error("Error updating payment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this appointment?")) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Appointment deleted successfully");
        setAppointments(prev => prev.filter(a => a._id !== id));
        if (selectedAppointment?._id === id) setSelectedAppointment(null);
      } else {
        toast.error(data.error || "Failed to delete appointment");
      }
    } catch (error) {
      toast.error("Error deleting appointment");
    }
  };

  const saveEdit = async () => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editForm._id, ...editForm }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Appointment updated!");
        setAppointments(prev => prev.map(a => a._id === editForm._id ? { ...a, ...editForm } as Appointment : a));
        setSelectedAppointment({ ...selectedAppointment, ...editForm } as Appointment);
        setIsEditing(false);
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      toast.error("Error updating appointment");
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.mobile.includes(searchTerm);
    const matchesTab = activeFilter === "all" || appt.status === activeFilter;
    return matchesSearch && matchesTab;
  });

  const exportCSV = () => {
    const headers = ["ID", "Patient Name", "Type", "Price", "Date", "Time", "Mobile", "Email", "Status", "Payment"];
    const rows = filteredAppointments.map(a => [
      a.bookingId, `"${a.patientName}"`, a.appointmentType, a.price, 
      new Date(a.date).toLocaleDateString("en-IN"), a.timeSlot, a.mobile, a.email || "", a.status, a.paymentStatus || "pending"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Downloaded!");
  };

  // Stats calculation
  const totalRevenue = appointments.filter(a => a.status !== "cancelled").reduce((sum, a) => sum + a.price, 0);
  const collectedRevenue = appointments.filter(a => a.status !== "cancelled" && a.paymentStatus === "paid").reduce((sum, a) => sum + a.price, 0);
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const pendingCount = appointments.filter(a => a.status === "confirmed").length;
  const todayAppointments = appointments.filter(a => new Date().toDateString() === new Date(a.date).toDateString());

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-accent/10 text-accent border-accent/20";
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

  if (isCheckingAuth) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black font-heading text-primary">Admin Access</h2>
            <p className="text-sm text-text-grey mt-2">Enter your credentials to access the console</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-text-grey uppercase tracking-wider mb-2">Admin ID</label>
              <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="Enter Admin ID" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-grey uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="Enter Password" required />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-4 py-3.5 transition-colors shadow-sm">Secure Login</button>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-text-grey hover:text-primary transition-colors">&larr; Back to Home</Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 relative overflow-hidden print:hidden">
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
              <button onClick={exportCSV} className="inline-flex items-center gap-2 bg-white border border-slate-100 hover:border-accent/30 transition-colors text-text-dark text-sm font-bold rounded-full px-5 py-3 shadow-sm hover:shadow">
                <Download className="w-4 h-4 text-accent" />
                Export CSV
              </button>
              <button onClick={() => fetchAppointments(true)} disabled={isRefreshing} className="inline-flex items-center gap-2 bg-white border border-slate-100 hover:border-accent/30 transition-colors text-text-dark text-sm font-bold rounded-full px-5 py-3 shadow-sm hover:shadow">
                <RefreshCw className={`w-4 h-4 text-accent ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Link href="/" className="bg-gradient-to-r from-accent to-[#0ea5e9] text-white text-sm font-bold rounded-full px-6 py-3 hover:shadow-lg transition-all hover:translate-y-[-1px] shadow-md shadow-accent/20">
                Exit Console
              </Link>
            </div>
          </div>

          {/* Dynamic Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-primary/20 transition-colors">
              <div>
                <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Today&apos;s Visits</p>
                <h3 className="text-3xl font-black text-primary font-heading">{todayAppointments.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Calendar className="w-6 h-6" /></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-accent/20 transition-colors">
              <div>
                <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Pending Checkups</p>
                <h3 className="text-3xl font-black text-accent font-heading">{pendingCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0"><Users className="w-6 h-6" /></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-success/20 transition-colors">
              <div>
                <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Completed Visits</p>
                <h3 className="text-3xl font-black text-success font-heading">{completedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0"><CheckCircle className="w-6 h-6" /></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between hover:border-gold/20 transition-colors">
              <div>
                <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-1.5">Collected Revenue</p>
                <h3 className="text-3xl font-black text-gold font-heading">₹{collectedRevenue} <span className="text-xs text-text-grey font-medium">/ ₹{totalRevenue}</span></h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0"><TrendingUp className="w-6 h-6" /></div>
            </motion.div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT: Filters & Table (70%) */}
            <div className="w-full lg:w-[70%] space-y-6">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {(["all", "confirmed", "completed", "cancelled"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all uppercase tracking-wider ${
                        activeFilter === tab ? "bg-primary text-white border-primary shadow-sm" : "bg-slate-50 hover:bg-slate-100 text-text-dark border-gray-200"
                      }`}
                    >
                      {tab} ({tab === "all" ? appointments.length : appointments.filter(a => a.status === tab).length})
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-grey" />
                  <input type="text" placeholder="Search name, phone, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                </div>
              </div>

              {isLoading ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
                  {[1, 2, 3].map((n) => <div key={n} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl"></div>)}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-text-grey"><Search className="w-8 h-8" /></div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-1">No Appointments Found</h3>
                  <p className="text-text-grey text-sm max-w-sm mx-auto">Try adjusting your filter or search tags.</p>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <AnimatePresence mode="popLayout">
                          {filteredAppointments.map((appt) => (
                            <motion.tr 
                              key={appt._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedAppointment?._id === appt._id ? "bg-accent/5" : ""}`}
                              onClick={() => { setSelectedAppointment(appt); setIsEditing(false); }}
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-primary text-sm">{appt.patientName}</div>
                                  {appt.isFirstVisit ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                                  ) : (
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Returning</span>
                                  )}
                                </div>
                                <div className="text-xs text-text-grey font-mono mt-0.5">{appt.bookingId}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm font-medium text-text-dark">{formatAppointmentType(appt.appointmentType)}</div>
                                <div className="flex items-center mt-0.5">
                                  <div className="text-xs text-accent font-bold">₹{appt.price}</div>
                                  {appt.paymentStatus === "paid" ? (
                                    <span className="bg-success/10 text-success border border-success/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-2">Paid</span>
                                  ) : (
                                    <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-2">Unpaid</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm font-medium text-text-dark">{new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                                <div className="text-xs text-text-grey flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" />{appt.timeSlot}</div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(appt.status)}`}>{appt.status}</span>
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
              <h3 className="font-heading text-lg font-bold text-primary border-b border-gray-100 pb-3 flex justify-between items-center">
                {isEditing ? "Edit Appointment" : "Appointment Details"}
              </h3>
  
              {selectedAppointment ? (
                isEditing ? (
                  // EDIT MODE
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-text-grey uppercase mb-1">Patient Name</label>
                      <input type="text" value={editForm.patientName || ""} onChange={e => setEditForm({...editForm, patientName: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-text-grey uppercase mb-1">Date</label>
                        <input type="date" value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ""} onChange={e => setEditForm({...editForm, date: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-grey uppercase mb-1">Time</label>
                        <input type="text" value={editForm.timeSlot || ""} onChange={e => setEditForm({...editForm, timeSlot: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-grey uppercase mb-1">Price / Fee (₹)</label>
                      <input type="number" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-grey uppercase mb-1">Admin Notes</label>
                      <textarea value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 h-24" placeholder="Private internal notes..."></textarea>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} className="flex-1 bg-primary text-white hover:bg-primary/90 text-sm font-semibold rounded-lg py-2.5 transition-colors">Save</button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-text-dark hover:bg-slate-200 text-sm font-semibold rounded-lg py-2.5 transition-colors">Cancel</button>
                    </div>
                  </motion.div>
                ) : (
                  // VIEW MODE
                  <motion.div key={selectedAppointment._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-primary text-lg">{selectedAppointment.patientName}</h4>
                          {selectedAppointment.isFirstVisit ? (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">New</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Returning</span>
                          )}
                        </div>
                        <p className="text-xs text-text-grey font-mono mt-0.5">{selectedAppointment.bookingId}</p>
                      </div>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(selectedAppointment.status)}`}>{selectedAppointment.status}</span>
                    </div>
  
                    <div className="grid grid-cols-2 gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-sm">
                      <div className="col-span-2 flex justify-between items-center pb-3 border-b border-slate-200 mb-1">
                        <div>
                          <span className="text-text-grey text-xs font-semibold block mb-0.5">Consultation</span>
                          <span className="font-bold text-text-dark block">{formatAppointmentType(selectedAppointment.appointmentType)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-text-grey text-xs font-semibold block mb-0.5">Fee</span>
                          <span className="font-bold text-accent block text-lg">₹{selectedAppointment.price}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-text-dark">Payment Status</span>
                        {selectedAppointment.paymentStatus === 'paid' ? (
                          <button onClick={() => handleTogglePayment(selectedAppointment._id, selectedAppointment.paymentStatus)} className="inline-flex items-center gap-1.5 bg-success/10 text-success hover:bg-success/20 transition-colors text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                            <CheckCircle className="w-3.5 h-3.5" /> PAID
                          </button>
                        ) : (
                          <button onClick={() => handleTogglePayment(selectedAppointment._id, selectedAppointment.paymentStatus)} className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                            <IndianRupee className="w-3.5 h-3.5" /> Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-grey text-xs font-semibold block mb-0.5">Age / Gender</span>
                        <span className="font-semibold text-text-dark block">{selectedAppointment.age} Yrs / {selectedAppointment.gender}</span>
                      </div>
                      <div>
                        <span className="text-text-grey text-xs font-semibold block mb-0.5">Schedule</span>
                        <span className="font-semibold text-text-dark block">{new Date(selectedAppointment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {selectedAppointment.timeSlot}</span>
                      </div>
                    </div>
  
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-text-dark">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-grey shrink-0"><Phone className="w-4 h-4" /></div>
                        <div>
                          <span className="text-text-grey text-xs font-medium block">Phone Number</span>
                          <span className="font-semibold block">{selectedAppointment.mobile}</span>
                        </div>
                      </div>
                      {selectedAppointment.email && (
                        <div className="flex items-center gap-3 text-sm text-text-dark">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-grey shrink-0"><Mail className="w-4 h-4" /></div>
                          <div className="overflow-hidden">
                            <span className="text-text-grey text-xs font-medium block">Email Address</span>
                            <span className="font-semibold block truncate">{selectedAppointment.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
  
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase text-text-grey tracking-wider mb-1">Reason for Visit</h5>
                        <p className="text-sm bg-slate-50 border border-gray-100 rounded-xl p-3 text-text-dark font-medium leading-relaxed">{selectedAppointment.reason}</p>
                      </div>
                      {selectedAppointment.notes && (
                        <div>
                          <h5 className="text-xs font-bold uppercase text-text-grey tracking-wider mb-1">Admin Notes</h5>
                          <p className="text-sm bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-text-dark leading-relaxed">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
  
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        <a href={`https://wa.me/${selectedAppointment.mobile.replace(/\+/g, "").replace(/\s/g, "")}?text=Hi%20${encodeURIComponent(selectedAppointment.patientName)},%20this%20is%20Dr.%20Sharma's%20Clinic.%20Your%20appointment%20${selectedAppointment.bookingId}%20is%20scheduled%20for%20${encodeURIComponent(new Date(selectedAppointment.date).toLocaleDateString())}%20at%20${encodeURIComponent(selectedAppointment.timeSlot)}.%20Please%20let%20us%20know%20if%20you%20have%20any%20queries!`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-success text-white hover:bg-success/90 transition-colors text-xs font-semibold rounded-full py-2 shadow-sm">
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Reminder
                        </a>
                        <button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-text-dark text-white hover:bg-text-dark/90 transition-colors text-xs font-semibold rounded-full py-2 shadow-sm">
                          <Printer className="w-3.5 h-3.5" /> Print Receipt
                        </button>
                      </div>
  
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setEditForm(selectedAppointment); setIsEditing(true); }} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-text-dark transition-colors text-xs font-semibold rounded-full py-2">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(selectedAppointment._id)} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-xs font-semibold rounded-full py-2">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
  
                      {selectedAppointment.status === "confirmed" && (
                        <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-100 pt-2">
                          <button onClick={() => handleUpdateStatus(selectedAppointment._id, "completed")} className="inline-flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary/95 transition-colors text-xs font-semibold rounded-full py-2">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </button>
                          <button onClick={() => handleUpdateStatus(selectedAppointment._id, "cancelled")} className="inline-flex items-center justify-center gap-1.5 bg-slate-100 text-text-dark hover:bg-slate-200 transition-colors text-xs font-semibold rounded-full py-2">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
  
                    {/* Account History */}
                    {(() => {
                      const history = appointments
                        .filter(a => a.mobile === selectedAppointment.mobile && a._id !== selectedAppointment._id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                      
                      if (history.length === 0) return null;
  
                      return (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <h5 className="text-xs font-bold uppercase text-text-grey tracking-wider">Account History ({history.length})</h5>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {history.map(hist => (
                              <div key={hist._id} onClick={() => setSelectedAppointment(hist)} className="bg-slate-50 border border-gray-100 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-sm text-primary">{hist.patientName}</span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${getStatusBadgeClass(hist.status)}`}>{hist.status}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-text-grey">
                                  <span>{new Date(hist.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                  <span className="truncate ml-2">{formatAppointmentType(hist.appointmentType)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )
              ) : (
                <div className="text-center py-12 text-text-grey text-sm">
                  <Eye className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                  Select an appointment to inspect patient details, edit, or print receipt.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRINT RECEIPT TEMPLATE (Hidden from screen, shown on print) */}
      <div className="hidden print:block fixed inset-0 bg-white z-[99999] p-8 text-black" style={{ minHeight: "100vh" }}>
        {selectedAppointment && (
          <div className="max-w-2xl mx-auto border-2 border-gray-200 p-8 rounded-lg mt-8">
            <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-black uppercase tracking-wider text-black">Dr. Sharma's Clinic</h1>
              <p className="text-gray-600 mt-2">TF-08, Anaya Business Center, VIP Road, Surat — 395009</p>
              <p className="text-gray-600">Phone: +91 98765 43210</p>
              <h2 className="text-2xl font-bold mt-6 uppercase text-gray-800">Payment Receipt</h2>
            </div>
            
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold">Patient Details</p>
                <p className="font-bold text-lg mt-1">{selectedAppointment.patientName}</p>
                <p>{selectedAppointment.age} Yrs / {selectedAppointment.gender}</p>
                <p>{selectedAppointment.mobile}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase font-bold">Receipt Details</p>
                <p className="font-bold text-lg mt-1">{selectedAppointment.bookingId}</p>
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>Payment Status: {selectedAppointment.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PENDING'}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200 uppercase text-sm text-gray-600">
                  <th className="py-3">Description</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 font-medium">{formatAppointmentType(selectedAppointment.appointmentType)}</td>
                  <td className="py-4 text-right">₹{selectedAppointment.price}</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-lg text-right">TOTAL</td>
                  <td className="py-4 font-bold text-lg text-right">₹{selectedAppointment.price}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-16 pt-8 flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500">Thank you for visiting.</p>
                <p className="text-sm text-gray-500">Wishing you a speedy recovery!</p>
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-black mb-2"></div>
                <p className="font-bold">Authorized Signature</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
