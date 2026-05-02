"use client";

// src/components/layout/navbar/LoginModal.tsx

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { requestOtp, verifyOtp, googleLogin } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import OptimizedImage from "@/components/shared/OptimizedImage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = "phone" | "otp" | "success";

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setStep("phone");
    setPhone("");
    setName("");
    setOtp("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Step 1: Request OTP ───────────────────────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestOtp(phone, name);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await verifyOtp(phone, otp, name);
      if (!data.data) throw new Error("Invalid response from server");
      login(data.data.accessToken, data.data.refreshToken, { phone, name });
      setStep("success");
      setTimeout(() => handleClose(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = () => {
    setLoading(true);
    setError(null);
    try {
      googleLogin();
      // Browser will redirect, so keep loading state
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign in failed.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 font-playfair"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-white w-full max-w-4xl mx-4 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-slideDown">
        
        {/* Left Side: Premium Image (Hidden on Mobile) */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80" 
            alt="Luxury Fashion Login" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-10">
            <h3 className="text-white text-3xl font-playfair tracking-wide mb-2">Welcome to Lalit Dalmia</h3>
            <p className="text-white/80 text-sm tracking-widest uppercase">Experience Luxury.</p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-1/2 relative flex flex-col justify-center px-8 py-12 md:px-12 bg-white">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-2">
                Welcome back
              </p>
              <h2 className="text-3xl font-playfair tracking-wide text-black">Sign In</h2>
            </div>

            {/* ── Success ── */}
            {step === "success" && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-playfair mb-1 text-black">Login Successful</h3>
                <p className="text-xs text-gray-500 tracking-wider">Redirecting you...</p>
              </div>
            )}

            {/* ── Step 1: Phone + Name ── */}
            {step === "phone" && (
              <div className="flex flex-col gap-6">
                
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  <FcGoogle size={20} />
                  <span className="text-sm tracking-wider font-playfair text-gray-800">Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-white px-4 text-[10px] uppercase tracking-widest text-gray-400">
                    Or sign in with OTP
                  </div>
                </div>

                <form onSubmit={handleRequestOtp} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError(null);
                      }}
                      required
                      placeholder="Enter your name"
                      className="border-b border-gray-300 focus:border-black outline-none py-2 text-base font-playfair tracking-wide transition-colors placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <span className="border-b border-gray-300 py-2 text-base font-playfair text-gray-500">+91</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setError(null);
                        }}
                        required
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-base font-playfair tracking-widest transition-colors placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-playfair text-red-500 italic">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-black text-white text-xs tracking-[0.2em] uppercase py-4 hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending OTP...
                      </>
                    ) : (
                      "Request OTP"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="text-center mb-4">
                  <p className="text-sm font-playfair text-gray-600">
                    We've sent a code to
                  </p>
                  <p className="text-base font-playfair tracking-widest text-black mt-1">
                    +91 {phone}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] tracking-[0.2em] uppercase text-gray-600 text-center">
                    Enter Secure Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError(null);
                    }}
                    required
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="border-b border-gray-300 focus:border-black outline-none py-3 text-2xl text-center tracking-[0.5em] font-playfair transition-colors placeholder:text-gray-200"
                  />
                </div>

                {error && (
                  <p className="text-xs font-playfair text-red-500 italic text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-black text-white text-xs tracking-[0.2em] uppercase py-4 hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError(null);
                  }}
                  className="text-xs font-playfair tracking-wider text-gray-400 hover:text-black transition-colors text-center underline underline-offset-4"
                >
                  Use a different number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}