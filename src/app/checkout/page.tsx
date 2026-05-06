"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, CreateOrderPayload } from "@/services/order.service";
import { createRazorpayOrder, verifyPayment } from "@/services/payment.service";
import { getAddresses, createAddress, Address } from "@/services/address.service";
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
  MapPin,
  Plus,
  ShieldCheck,
  AlertCircle,
  Printer,
} from "lucide-react";
import Script from "next/script";
import { useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// --- Types ---
interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  saveAddress: boolean;
}

interface ConfirmedOrderData {
  orderId: string;
  items: Array<{ id: string; name: string; price: number; image: string; size: string; quantity: number }>;
  total: number;
  address: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { isLoggedIn, user, openLoginModal } = useAuth();

  // --- UI State ---
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; phone?: boolean }>({});
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderData | null>(null);

  // --- Address State ---
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);

  // --- Form State ---
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    saveAddress: false,
  });

  // --- Effects ---
  useEffect(() => {
    if (isLoggedIn) {
      loadAddresses();
    }
  }, [isLoggedIn]);

  const loadAddresses = async () => {
    try {
      const addresses = await getAddresses();
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr._id);
        setShowNewAddressForm(false);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  };

  useEffect(() => {
    if (user) {
      const [fName = "", ...lNameParts] = (user.name || "").split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lNameParts.join(" "),
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    setShowNewAddressForm(false);
    setSubmitError(null);
  };

  const processPayment = async (internalOrderId: string, addressData: any) => {
    // 1. Create Razorpay Order
    const rzpOrderRes = await createRazorpayOrder(internalOrderId);

    // 2. Configure Razorpay Options
    const options = {
      key: rzpOrderRes.key,
      amount: rzpOrderRes.amount,
      currency: rzpOrderRes.currency,
      name: "Lalit Dalmia",
      description: `Order #${internalOrderId.slice(-6).toUpperCase()}`,
      order_id: rzpOrderRes.razorpayOrderId,
      handler: async function (response: any) {
        try {
          setIsSubmitting(true);
          // 3. Verify Payment
          await verifyPayment({
            orderId: internalOrderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          // Capture snapshot for confirmation page
          setConfirmedOrder({
            orderId: internalOrderId,
            items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, image: i.image, size: i.size || "Standard", quantity: i.quantity })),
            total: totalPrice,
            address: `${addressData.addressLine}, ${addressData.city}, ${addressData.state} – ${addressData.pincode}`,
          });
          setIsOrdered(true);
          clearCart();
        } catch (err) {
          setSubmitError("Payment verification failed. If your account was debited, please contact our concierge.");
        } finally {
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: addressData.name,
        email: formData.email,
        contact: addressData.phone,
      },
      theme: { color: "#000000" },
      modal: {
        ondismiss: function() {
          setIsSubmitting(false);
        }
      }
    };

    if (!window.Razorpay) {
      setSubmitError("Razorpay SDK failed to load. Please check your internet connection.");
      setIsSubmitting(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      setSubmitError(`Payment Failed: ${response.error.description}`);
      setIsSubmitting(false);
    });
    rzp.open();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let addressData;

      // Determine address to use
      if (!showNewAddressForm && selectedAddressId) {
        const addr = savedAddresses.find((a) => a._id === selectedAddressId);
        if (addr) {
          addressData = {
            name: addr.fullName,
            phone: addr.phone,
            pincode: addr.postalCode,
            state: addr.state,
            city: addr.city,
            addressLine: addr.line1 + (addr.line2 ? `, ${addr.line2}` : ""),
          };
        }
      } else {
        addressData = {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          pincode: formData.pincode,
          state: formData.state,
          city: formData.city,
          addressLine: formData.addressLine,
        };

        // Optionally save address if requested
        if (formData.saveAddress && isLoggedIn) {
          await createAddress({
            fullName: addressData.name,
            phone: addressData.phone,
            line1: formData.addressLine,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pincode,
            country: "India",
            label: "Saved Address",
          }).catch(err => console.error("Could not save address for future use:", err));
        }
      }

      if (!addressData) throw new Error("Please provide a shipping address.");

      const customerEmail = formData.email || user?.email;
      if (!customerEmail) {
        setFieldErrors({ email: true });
        setSubmitError("Email address is required for order confirmation.");
        // Senior UX: Auto-focus the missing field
        const emailInput = document.getElementsByName("email")[0];
        if (emailInput) {
          emailInput.focus();
          emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setIsSubmitting(false);
        return;
      }
      setFieldErrors({}); // Clear errors if valid

      // Step 1: Create Order on Backend
      const orderRes = await createOrder({
        customer: {
          name: addressData.name,
          phone: addressData.phone,
          email: customerEmail,
        },
        products: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        address: {
          ...addressData,
          email: customerEmail,
        },
      });

      // Step 2: Handle Payment Flow
      await processPayment(orderRes.orderId, addressData);

    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- Sub-components ---
  const SuccessView = ({ order }: { order: ConfirmedOrderData | null }) => {
    const orderNum = order?.orderId ? `#LD-${order.orderId.slice(-6).toUpperCase()}` : "#LD-000000";
    const orderDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    
    // Sophisticated Production Journey
    const journey = [
      { label: "Order Authenticated", sub: orderDate, done: true },
      { label: "Material Selection", sub: "Artisanal Silk & Lace", done: false },
      { label: "Hand-Embroidery", sub: "400+ Hours of Craft", done: false },
      { label: "Final Fitting", sub: "Couture Quality Check", done: false },
      { label: "Signature Delivery", sub: "Hand-Delivered Luxury", done: false },
    ];

    return (
      <div className="min-h-screen bg-[#fafaf9] selection:bg-[#c5a059]/30">
        {/* ── Immersive Success Hero ── */}
        <section className="relative overflow-hidden bg-[#0a0a0a] pt-64 pb-32 px-6 text-center">
          {/* Dynamic Light Rays */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 left-1/4 w-[50%] h-full bg-gradient-to-b from-[#c5a059]/10 to-transparent blur-[120px] -rotate-12" />
             <div className="absolute bottom-0 right-1/4 w-[50%] h-full bg-gradient-to-t from-[#c5a059]/5 to-transparent blur-[120px] rotate-12" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="relative inline-flex items-center justify-center">
               <div className="absolute inset-0 bg-[#c5a059]/20 blur-[80px] rounded-full animate-pulse" />
               <div className="relative w-32 h-32 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center">
                  <CheckCircle size={56} className="text-[#c5a059]" strokeWidth={1} />
               </div>
            </div>

            <div className="space-y-6">
              <p className="text-[#c5a059] text-[10px] tracking-[0.6em] uppercase font-bold animate-pulse">Transaction Secured</p>
              <h1 className={`${playfair.className} text-6xl md:text-9xl font-normal text-white leading-tight tracking-tighter`}>
                Creation Commenced
              </h1>
              <p className="text-white/40 text-[11px] tracking-[0.4em] uppercase max-w-xl mx-auto leading-loose italic">
                Your selection has entered our artisanal ateliers. Each stitch will now be a testament to your refined taste.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
               <div className="px-10 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-sm">
                  <span className="block text-white/30 text-[8px] tracking-[0.5em] uppercase mb-1">Couture Ref.</span>
                  <span className="text-[#c5a059] text-base font-bold tracking-[0.2em]">{orderNum}</span>
               </div>
               <div className="px-10 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-sm">
                  <span className="block text-white/30 text-[8px] tracking-[0.5em] uppercase mb-1">Auth Date</span>
                  <span className="text-white text-base font-medium tracking-widest">{orderDate}</span>
               </div>
            </div>
          </div>
        </section>

        {/* ── Journey Dashboard ── */}
        <div className="max-w-[1200px] mx-auto px-6 -mt-16 pb-40 relative z-20">
          
          <div className="bg-white border border-[#eee9e2] shadow-[0_50px_100px_rgba(0,0,0,0.06)] p-12 md:p-20 rounded-sm mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
               <div className="space-y-4">
                  <h2 className="text-[10px] tracking-[0.6em] uppercase text-[#c5a059] font-bold">The Artisanal Path</h2>
                  <p className={`${playfair.className} text-4xl text-black leading-none`}>Production Lifecycle</p>
               </div>
               <div className="flex items-center gap-4 px-6 py-2 bg-[#faf8f5] border border-[#eee9e2] text-[10px] tracking-[0.3em] uppercase text-black font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                  Status: Preparing Materials
               </div>
            </div>

            <div className="relative">
               {/* Elegant Timeline Rail */}
               <div className="absolute top-[22px] left-0 w-full h-px bg-[#f0ede8]" />
               <div className="absolute top-[22px] left-0 w-[10%] h-[2px] bg-[#c5a059]" />
               
               <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
                  {journey.map((step, i) => (
                    <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-6 group">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                         step.done ? "bg-black text-white shadow-xl" : "bg-white border border-[#eee9e2] text-[#ccc]"
                       }`}>
                          {step.done ? <CheckCircle size={20} strokeWidth={1.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                       </div>
                       <div className="space-y-2">
                          <p className={`text-[11px] font-bold tracking-[0.1em] uppercase ${step.done ? "text-black" : "text-[#9c9690]"}`}>{step.label}</p>
                          <p className="text-[10px] text-[#9c9690] leading-relaxed italic">{step.sub}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Order Manifest */}
            <div className="xl:col-span-2 space-y-12">
               <div className="bg-white border border-[#eee9e2] p-12 md:p-16 rounded-sm">
                  <div className="flex items-center justify-between mb-16 pb-8 border-b border-[#faf8f5]">
                     <h3 className={`${playfair.className} text-3xl text-black`}>Order Manifest</h3>
                     <span className="text-[10px] tracking-[0.4em] uppercase text-[#9c9690] font-bold">{order?.items.length} Exclusive Pieces</span>
                  </div>
                  
                  <div className="space-y-16">
                     {order?.items.map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-12 group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                           <div className="relative w-full md:w-32 h-44 bg-[#f8f5f0] overflow-hidden rounded-sm border border-[#f0ede8] flex-shrink-0">
                              <OptimizedImage src={item.image} alt={item.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" sizes="128px" />
                           </div>
                           <div className="flex-1 flex flex-col justify-between py-2">
                              <div>
                                 <h4 className={`${playfair.className} text-2xl text-black mb-6 group-hover:text-[#c5a059] transition-colors`}>{item.name}</h4>
                                 <div className="flex gap-12">
                                    <div className="space-y-1">
                                       <span className="text-[8px] tracking-widest uppercase text-[#9c9690] block">Size Selection</span>
                                       <span className="text-xs text-black font-bold uppercase tracking-widest">{item.size}</span>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[8px] tracking-widest uppercase text-[#9c9690] block">Quantity</span>
                                       <span className="text-xs text-black font-bold uppercase tracking-widest">{item.quantity} Unit</span>
                                    </div>
                                 </div>
                              </div>
                              <p className={`${playfair.className} text-2xl text-black font-medium mt-6 md:mt-0`}>₹{item.price.toLocaleString("en-IN")}.00</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-20 pt-12 border-t-2 border-black">
                     <div className="flex justify-between items-end">
                        <div className="space-y-2">
                           <span className="text-[10px] tracking-[0.5em] uppercase text-[#c5a059] font-bold block">Final Authorized Amount</span>
                           <p className={`${playfair.className} text-5xl text-black font-semibold tracking-tighter`}>₹{order?.total.toLocaleString("en-IN")}.00</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Logistics & Support */}
            <div className="space-y-12">
               <div className="bg-white border border-[#eee9e2] p-12 rounded-sm shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 blur-[80px] rounded-full translate-x-16 -translate-y-16" />
                  <div className="flex items-center gap-4 mb-10">
                     <MapPin size={20} className="text-[#c5a059]" />
                     <h3 className="text-[10px] tracking-[0.5em] uppercase text-black font-bold">Shipping Destination</h3>
                  </div>
                  <div className="space-y-8">
                     <p className={`${playfair.className} text-xl text-black leading-relaxed italic`}>
                        {order?.address}
                     </p>
                     <div className="p-6 bg-[#faf8f5] border border-[#eee9e2] rounded-sm group-hover:bg-[#f0ede8] transition-colors duration-700">
                        <div className="flex items-center gap-4 mb-3">
                           <Truck size={20} className="text-black" />
                           <span className="text-[9px] tracking-[0.4em] uppercase font-bold">White-Glove Express</span>
                        </div>
                        <p className="text-[11px] text-[#6b6560] leading-loose">Your piece is currently being hand-inspected for tailoring excellence. We prioritize preservation and elegance in our packaging.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-black p-12 rounded-sm text-center space-y-8 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <p className="text-[#c5a059] text-[9px] tracking-[0.6em] uppercase font-bold relative z-10">The Heritage Promise</p>
                  <p className={`${playfair.className} text-white/90 text-lg leading-relaxed italic relative z-10`}>
                     "Our creations are echoes of tradition, reborn in the modern world."
                  </p>
                  <div className="w-12 h-px bg-white/20 mx-auto relative z-10" />
                  <p className="text-white/40 text-[8px] tracking-[0.4em] uppercase relative z-10">House of Lalit Dalmia</p>
               </div>

               <div className="space-y-4">
                  <button onClick={() => window.print()} className="w-full py-6 bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-700 text-[11px] tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-4">
                     <Printer size={16} /> Print Archival Receipt
                  </button>
                  <Link href="/orders" className="w-full py-6 bg-[#faf8f5] border border-[#eee9e2] hover:border-black text-black transition-all duration-700 text-[11px] tracking-[0.4em] uppercase font-bold flex items-center justify-center">
                     Order Concierge
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyCartView = () => (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#c5a059]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="text-center space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="relative inline-flex items-center justify-center">
           <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full" />
           <ShoppingBag size={100} className="relative text-black" strokeWidth={0.5} />
        </div>
        
        <div className="space-y-6">
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-normal text-black tracking-tight`}>
             A Canvas Awaits
          </h1>
          <p className="text-[#9c9690] text-[11px] tracking-[0.4em] uppercase max-w-[400px] mx-auto leading-loose italic">
             Your selection is currently empty. Begin your journey into artisanal couture by exploring our curated collections.
          </p>
        </div>

        <div className="pt-8">
           <Link
             href="/"
             className={`${playfair.className} relative inline-block border border-black px-24 py-6 text-[12px] tracking-[0.5em] uppercase hover:bg-black hover:text-white transition-all duration-1000 group overflow-hidden`}
           >
             <span className="relative z-10">Discover Masterpieces</span>
             <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
           </Link>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c5a059]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c5a059]/5 blur-[120px] rounded-full" />
        
        <div className="text-center space-y-10 relative z-10 animate-in fade-in zoom-in duration-1000">
          <div className="relative inline-flex items-center justify-center">
             <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full" />
             <ShieldCheck size={80} className="relative text-black" strokeWidth={0.5} />
          </div>
          <div className="space-y-4">
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-normal text-black tracking-tight`}>
              Identity Verification
            </h1>
            <p className="text-[#6b6560] text-[11px] tracking-[0.2em] uppercase max-w-[350px] mx-auto leading-loose">
              To safeguard your artisanal selection and ensure a secure transaction, please authenticate your account.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => openLoginModal("/checkout")}
              className={`${playfair.className} group relative inline-block bg-black text-white px-20 py-5 text-[12px] tracking-[0.4em] uppercase hover:bg-[#c5a059] transition-all duration-700 shadow-2xl overflow-hidden`}
            >
              <span className="relative z-10">Sign In / Register</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isOrdered) return <SuccessView order={confirmedOrder} />;
  
  if (totalItems === 0) return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6">
       <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <ShoppingBag size={80} className="mx-auto text-[#e2e0db]" strokeWidth={0.5} />
          <div className="space-y-3">
             <h1 className={`${playfair.className} text-4xl font-normal text-black`}>Your Selection is Empty</h1>
             <p className="text-[#9c9690] text-[10px] tracking-[0.3em] uppercase">Begin your journey by exploring our latest collections.</p>
          </div>
          <Link
            href="/"
            className={`${playfair.className} inline-block border border-black px-16 py-5 text-[11px] tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all duration-700`}
          >
            Discover Collections
          </Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-48 pb-32">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => setSubmitError("The payment gateway is currently unavailable. Please refresh or contact support.")}
      />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="relative">
              <div className="w-24 h-24 border-t-2 border-b-2 border-black rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 border-l-2 border-r-2 border-[#c5a059] rounded-full animate-spin-slow" />
              </div>
           </div>
           <p className={`${playfair.className} mt-12 text-xl tracking-[0.2em] uppercase text-black animate-pulse`}>
              Securing Your Order...
           </p>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="flex flex-col xl:flex-row gap-24 items-start">

          {/* --- LEFT: Checkout Flow --- */}
          <div className="flex-1 w-full space-y-16">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase text-[#9c9690] hover:text-black transition-all mb-12 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform duration-500" />
                Return to Gallery
              </Link>
              <h1 className={`${playfair.className} text-5xl md:text-7xl font-normal text-black mb-6 tracking-tight`}>
                Bespoke Checkout
              </h1>
              <div className="flex items-center gap-4 text-[9px] tracking-[0.4em] uppercase text-[#c5a059] font-bold">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#c5a059]">1</span>
                <span>Security & Shipping Information</span>
              </div>
            </div>

            <div className="space-y-16">
              {/* Contact Information */}
              <div className="space-y-10 animate-in fade-in duration-1000 delay-200">
                <div className="flex items-baseline gap-4">
                  <h3 className={`${playfair.className} text-2xl text-black`}>Contact Details</h3>
                  <div className="h-px flex-1 bg-[#eee9e2]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="relative group">
                    <label className={`absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase transition-all duration-500 ${fieldErrors.email ? 'text-red-500' : 'text-[#9c9690] group-focus-within:text-black'}`}>
                      Email for Confirmation
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: false }));
                      }}
                      placeholder="e.g. concierge@client.com"
                      className={`w-full border-b py-4 text-base outline-none transition-all bg-transparent ${
                        fieldErrors.email ? "border-red-500" : "border-[#e8e4de] focus:border-black"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[9px] text-red-500 mt-2 font-bold uppercase tracking-widest animate-bounce">Verification required</p>
                    )}
                  </div>
                  <div className="relative group">
                    <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black transition-all">
                      Personal Contact
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 00000 00000"
                      className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-10 animate-in fade-in duration-1000 delay-300">
                <div className="flex items-baseline gap-4">
                  <h3 className={`${playfair.className} text-2xl text-black`}>Shipping Destination</h3>
                  <div className="h-px flex-1 bg-[#eee9e2]" />
                </div>

                {isLoggedIn && savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => handleAddressSelect(addr._id)}
                        className={`group relative p-8 border transition-all duration-700 cursor-pointer overflow-hidden ${
                          selectedAddressId === addr._id && !showNewAddressForm
                            ? "border-black bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                            : "border-[#eee9e2] hover:border-[#c5a059]/30"
                        }`}
                      >
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] tracking-[0.4em] uppercase text-[#c5a059] font-bold">
                               {addr.label || "Saved Destination"}
                            </span>
                            {addr.isDefault && (
                               <span className="text-[8px] bg-black text-white px-3 py-1 tracking-widest uppercase font-bold">Primary</span>
                            )}
                          </div>
                          <div>
                            <p className="text-lg text-black font-medium leading-none mb-2">{addr.fullName}</p>
                            <p className="text-sm text-[#6b6560] leading-relaxed italic">
                              {addr.line1}, {addr.city}, {addr.state} — {addr.postalCode}
                            </p>
                          </div>
                          <p className="text-[10px] text-black font-bold tracking-widest">{addr.phone}</p>
                        </div>
                        
                        {selectedAddressId === addr._id && !showNewAddressForm && (
                          <div className="absolute bottom-6 right-6">
                            <CheckCircle size={24} className="text-[#22c55e] animate-in zoom-in duration-500" />
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-[#c5a059]/5 transition-opacity duration-700 ${selectedAddressId === addr._id && !showNewAddressForm ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    ))}
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className={`relative p-8 border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center gap-4 group ${
                        showNewAddressForm ? "border-black bg-white shadow-xl" : "border-[#e8e4de] hover:border-black"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full border border-[#eee9e2] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                        <Plus size={24} />
                      </div>
                      <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-black">Add New Address</span>
                    </button>
                  </div>
                )}

                {showNewAddressForm && (
                  <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-top-8 fade-in duration-1000">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="relative group">
                        <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">First Name</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                      </div>
                      <div className="relative group">
                        <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">Last Name</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">Complete Address</label>
                      <input required type="text" name="addressLine" placeholder="Apartment, Street, Landmark" value={formData.addressLine} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="relative group">
                        <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">City</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                      </div>
                      <div className="relative group">
                        <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">State</label>
                        <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                      </div>
                      <div className="relative group">
                        <label className="absolute left-0 -top-6 text-[9px] tracking-[0.3em] uppercase text-[#9c9690] group-focus-within:text-black">Pincode</label>
                        <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border-b border-[#e8e4de] py-4 text-base focus:border-black outline-none transition-all bg-transparent" />
                      </div>
                    </div>

                    {isLoggedIn && (
                      <label className="flex items-center gap-4 cursor-pointer group w-fit">
                        <div className={`relative w-5 h-5 border transition-all duration-500 rounded-sm ${formData.saveAddress ? 'bg-black border-black' : 'border-[#e8e4de] group-hover:border-black'}`}>
                          <input type="checkbox" name="saveAddress" checked={formData.saveAddress} onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          {formData.saveAddress && <CheckCircle size={12} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </div>
                        <span className="text-[11px] text-[#6b6560] tracking-widest uppercase">Secure this address for future curation</span>
                      </label>
                    )}
                    
                    {submitError && (
                      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-900 text-[11px] tracking-widest uppercase animate-in slide-in-from-left-4 duration-500">
                        {submitError}
                      </div>
                    )}

                    <div className="pt-12">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${playfair.className} w-full relative bg-black text-white py-7 text-[14px] tracking-[0.6em] uppercase hover:bg-[#c5a059] transition-all duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.25)] group overflow-hidden active:scale-[0.98]`}
                      >
                         <span className="relative z-10 flex items-center justify-center gap-4">
                            {isSubmitting ? "Securing Transaction..." : `Confirm & Authorize — ₹${totalPrice.toLocaleString("en-IN")}.00`}
                         </span>
                         <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Final CTA for Saved Address */}
                {!showNewAddressForm && isLoggedIn && (
                  <div className="pt-12 space-y-10 animate-in fade-in duration-1000">
                    {submitError && (
                      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-900 text-[11px] tracking-widest uppercase">
                        {submitError}
                      </div>
                    )}
                    <button
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting || !selectedAddressId}
                      className={`${playfair.className} w-full relative bg-black text-white py-7 text-[14px] tracking-[0.6em] uppercase hover:bg-[#c5a059] transition-all duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.25)] group overflow-hidden active:scale-[0.98]`}
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Securing Transaction..." : `Confirm & Authorize — ₹${totalPrice.toLocaleString("en-IN")}.00`}
                      </span>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#eee9e2] animate-in fade-in duration-1000 delay-500">
                 <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#eee9e2] flex items-center justify-center mx-auto mb-6 group-hover:border-black transition-colors">
                       <ShieldCheck size={20} className="text-[#9c9690]" />
                    </div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-black">SSL Secured</h4>
                    <p className="text-[10px] text-[#9c9690] leading-relaxed italic">End-to-end encryption for your privacy.</p>
                 </div>
                 <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#eee9e2] flex items-center justify-center mx-auto mb-6">
                       <Truck size={20} className="text-[#9c9690]" />
                    </div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-black">Artisan Delivery</h4>
                    <p className="text-[10px] text-[#9c9690] leading-relaxed italic">Hand-crafted, hand-delivered.</p>
                 </div>
                 <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#eee9e2] flex items-center justify-center mx-auto mb-6">
                       <CreditCard size={20} className="text-[#9c9690]" />
                    </div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-black">Premium Support</h4>
                    <p className="text-[10px] text-[#9c9690] leading-relaxed italic">Our concierge is at your service.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Exclusive Summary --- */}
          <div className="w-full xl:w-[500px] xl:sticky xl:top-32 animate-in slide-in-from-right-12 duration-1000">
            <div className="bg-white border border-[#eee9e2] shadow-[0_40px_100px_rgba(0,0,0,0.03)] p-6 md:p-14 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 blur-[80px] rounded-full translate-x-16 -translate-y-16" />
              
              <div className="flex items-center justify-between mb-8 md:mb-12 pb-6 md:pb-8 border-b border-[#faf8f5]">
                <h2 className={`${playfair.className} text-2xl md:text-3xl text-black font-normal`}>The Selection</h2>
                <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-[#c5a059] font-bold border border-[#c5a059]/20 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
                  {totalItems} {totalItems === 1 ? 'Masterpiece' : 'Masterpieces'}
                </span>
              </div>

              <div className="max-h-[480px] overflow-y-auto space-y-10 md:space-y-12 pr-2 md:pr-4 custom-scrollbar mb-10 md:mb-12">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-6 md:gap-10 group" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="relative w-20 md:w-28 h-28 md:h-36 bg-[#f8f5f0] flex-shrink-0 overflow-hidden border border-[#eee9e2] rounded-sm">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-3 md:space-y-4">
                        <h4 className={`${playfair.className} text-lg md:text-xl text-black leading-tight tracking-tight group-hover:text-[#c5a059] transition-colors`}>
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-2 md:gap-y-3">
                           <div className="space-y-1">
                              <span className="text-[8px] tracking-[0.3em] uppercase text-[#9c9690] block">Size</span>
                              <span className="text-[11px] text-black font-bold uppercase tracking-widest">{item.size}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] tracking-[0.3em] uppercase text-[#9c9690] block">Quantity</span>
                              <span className="text-[11px] text-black font-bold uppercase tracking-widest">{item.quantity}</span>
                           </div>
                        </div>
                      </div>
                      <p className={`${playfair.className} text-lg md:text-xl text-black font-medium`}>
                        ₹{(item.price).toLocaleString("en-IN")}.00
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-[#f0ede8]">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#9c9690] uppercase tracking-[0.3em]">Merchandise Subtotal</span>
                  <span className="text-black font-medium tracking-tight">₹{totalPrice.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#9c9690] uppercase tracking-[0.3em]">Signature Shipping</span>
                  <span className="text-[#22c55e] text-[10px] tracking-[0.2em] font-bold uppercase px-3 py-1 bg-[#f0f9f0] rounded-full">Complimentary</span>
                </div>
                
                <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t-2 border-black">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#c5a059] font-bold">Total Investment</span>
                      <p className={`${playfair.className} text-3xl md:text-4xl text-black font-medium tracking-tighter`}>₹{totalPrice.toLocaleString("en-IN")}.00</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#9c9690] tracking-[0.2em] uppercase mt-4 italic font-medium">Inclusive of all local taxes and tailoring fees.</p>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-[#f0ede8] flex items-center justify-between opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}