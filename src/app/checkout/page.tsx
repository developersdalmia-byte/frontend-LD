"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, CreateOrderPayload } from "@/services/order.service";
import { Playfair_Display } from "next/font/google";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload: CreateOrderPayload = {
      orderType: "ONLINE",
      source: "WEBSITE",
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        line1: formData.address,
        city: formData.city,
        state: formData.city, // Simple mapping for now
        postalCode: "000000",
        country: "India",
      },
      discount: 0,
      tax: 0,
    };

    try {
      await createOrder(payload);

      setIsOrdered(true);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className={`${playfair.className} text-4xl font-normal text-black`}>
              Thank You for Your Order
            </h1>
            <p className="text-[#6b6560] text-sm leading-relaxed">
              Your request has been received. Our concierge will contact you
              shortly to confirm the details and production timeline.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/"
              className={`${playfair.className} inline-block bg-black text-white px-12 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-[#333] transition-all duration-300`}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <ShoppingBag size={48} className="mx-auto text-[#c8c2b8]" strokeWidth={1} />
          <h1 className={`${playfair.className} text-3xl font-normal text-black`}>
            Your Selection is Empty
          </h1>
          <Link
            href="/"
            className={`${playfair.className} inline-block border border-black px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-300`}
          >
            Discover Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── LEFT: Checkout Form ── */}
          <div className="flex-1 space-y-12">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#9c9690] hover:text-black transition-colors mb-8"
              >
                <ArrowLeft size={14} />
                Back to Shopping
              </Link>
              <h1 className={`${playfair.className} text-4xl font-normal text-black mb-2`}>
                Complete Your Order
              </h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9c9690]">
                Shipping & Billing Details
              </p>
            </div>

            {!isLoggedIn && (
              <div className="border border-[#e8e4de] bg-[#fdfcfb] p-4 text-[12px] text-[#6b6560]">
                <span className="font-medium text-black">Not signed in.</span>{" "}
                You can still place an order, but signing in lets you track it
                later.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                  />
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                  />
                </div>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                />
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Shipping Address *"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#e8e4de] py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
                  />
                  <div className="flex items-center border-b border-[#e8e4de] py-4 text-sm text-[#9c9690]">
                    India (Domestic Shipping)
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
                  {submitError}
                </div>
              )}

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${playfair.className} w-full bg-black text-white py-5 text-[12px] tracking-[0.4em] uppercase hover:bg-[#333] transition-all duration-300 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    `Confirm Order — ₹${totalPrice.toLocaleString("en-IN")}.00`
                  )}
                </button>
                <p className="text-[10px] text-center text-[#9c9690] mt-4 tracking-wide">
                  By clicking confirm, you agree to our Terms of Service & Refund Policy.
                </p>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-[#fdfcfb] border border-[#e8e4de] p-8 space-y-8 sticky top-32">
              <h2 className={`${playfair.className} text-xl font-normal text-black border-b border-[#e8e4de] pb-4`}>
                Order Summary
              </h2>

              <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-[#f0ede8] flex-shrink-0">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`${playfair.className} text-[13px] font-normal text-black truncate`}>
                        {item.name}
                      </h4>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-[#9c9690] mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-[13px] text-black mt-2 font-medium">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-[#e8e4de]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9c9690]">Subtotal ({totalItems} items)</span>
                  <span className="text-black font-medium">
                    ₹{totalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9c9690]">Shipping</span>
                  <span className="text-[#2a5c2a] uppercase text-[10px] tracking-widest font-bold">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-black/10">
                  <span className={`${playfair.className} text-lg font-normal`}>Total</span>
                  <span className={`${playfair.className} text-xl font-semibold`}>
                    ₹{totalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <Truck size={16} className="text-[#9c9690] mt-0.5" />
                  <div>
                    <h5 className="text-[10px] tracking-[0.2em] uppercase text-black font-bold mb-1">
                      Standard Delivery
                    </h5>
                    <p className="text-[11px] text-[#6b6560] leading-relaxed">
                      8–10 weeks for artisanal production and delivery.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard size={16} className="text-[#9c9690] mt-0.5" />
                  <div>
                    <h5 className="text-[10px] tracking-[0.2em] uppercase text-black font-bold mb-1">
                      Payment Method
                    </h5>
                    <p className="text-[11px] text-[#6b6560] leading-relaxed">
                      Bank Transfer / Razorpay link will be sent post-confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}