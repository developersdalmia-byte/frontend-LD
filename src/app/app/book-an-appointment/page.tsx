"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { 
  getPublicStores, 
  initiateAppointment, 
  Store, 
  AppointmentResponse 
} from "@/services/appointment.service";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function AppointmentPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<AppointmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (successData) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [successData, router]);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    date: "",
    time: "",
    storeId: "",
    message: "",
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getPublicStores();
        setStores(data);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, storeId: data[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch stores", err);
        // Fallback stores if API fails
        const fallbackStores = [
          { _id: "pitampura", name: "Pitampura Store" },
          { _id: "lado-sarai", name: "Lado Sarai Flagship" },
          { _id: "chandni-chowk", name: "Chandni Chowk Store" }
        ] as Store[];
        setStores(fallbackStores);
        setFormData(prev => ({ ...prev, storeId: fallbackStores[0]._id }));
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await initiateAppointment({
        customerName: formData.customerName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        date: formData.date,
        time: formData.time,
        storeId: formData.storeId,
        source: "ONLINE"
      });
      setSuccessData(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    const appointment = successData.appointment;
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-1000 pt-20">
        <div className="max-w-2xl w-full space-y-12">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-[3px] border-[#22c55e] flex items-center justify-center animate-in zoom-in duration-700">
              <CheckCircle size={48} className="text-[#22c55e]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className={`${playfair.className} text-5xl md:text-7xl font-normal text-black tracking-tight`}>
              Appointment Confirmed
            </h1>
            <p className="text-[#6b6560] text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
              Thank you, {appointment.customerName}. Your appointment at <span className="font-bold text-black">{appointment.storeId.name}</span> has been scheduled successfully.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-8">
            <Link 
              href="/" 
              className="bg-black text-white px-20 py-5 text-[12px] tracking-[0.5em] uppercase font-bold hover:bg-[#1a1a1a] transition-all duration-300 w-full md:w-auto"
            >
              Back to Home
            </Link>
            <p className="text-[10px] text-[#9c9690] tracking-[0.3em] uppercase">
              Auto-redirecting in <span className="text-black font-bold">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffff] pt-[180px] pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className={`${playfair.className} text-3xl md:text-5xl text-center tracking-wide mb-6`}>
          Schedule an Appointment
        </h1>

        <p className="text-center text-sm text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
          To schedule a virtual or an in-store appointment at one of our flagship stores,
          please fill out your information and our consultant will contact you within 24 hours.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Store */}
          <div>
            <label className="text-sm block mb-2">Store Location *</label>
            <select 
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-400 bg-transparent py-3 outline-none"
            >
              {loading ? (
                <option>Loading stores...</option>
              ) : (
                stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Full Name */}
          <input
            required
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Full Name *"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Email */}
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email *"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Phone Number */}
          <input
            required
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number *"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Time + Date */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Preferred Time *</label>
              <input
                required
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="border-b border-gray-400 py-3 bg-transparent outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Preferred Date *</label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="border-b border-gray-400 py-3 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message to Our Consultants"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none resize-none h-32"
          />

          {/* Checkboxes */}
          <div className="space-y-4 text-sm mt-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1" defaultChecked />
              <span>
                Sign up for newsletters and stay updated.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="mt-1" defaultChecked />
              <span>
                I agree to Privacy Policy and Terms & Conditions.
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-12 py-3 uppercase tracking-[0.2em] hover:opacity-80 transition disabled:opacity-50 flex items-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}