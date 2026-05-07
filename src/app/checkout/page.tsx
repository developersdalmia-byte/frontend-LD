"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, CreateOrderPayload } from "@/services/order.service";
import { createRazorpayOrder, verifyPayment } from "@/services/payment.service";
import { getAddresses, createAddress, updateAddress, deleteAddress, Address } from "@/services/address.service";
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
  Edit2,
  Trash2,
} from "lucide-react";
import Script from "next/script";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const isCheckoutPage = pathname === "/checkout" || pathname === "/book-an-appointment";
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
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

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
    setEditingAddressId(null);
    setSubmitError(null);
  };

  const handleEditAddress = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    setEditingAddressId(address._id);
    setFormData({
      email: formData.email, // keep current email
      firstName: address.fullName.split(" ")[0] || "",
      lastName: address.fullName.split(" ").slice(1).join(" ") || "",
      addressLine: address.line1 + (address.line2 ? `, ${address.line2}` : ""),
      city: address.city,
      state: address.state,
      pincode: address.postalCode,
      phone: address.phone,
      saveAddress: true,
    });
    setShowNewAddressForm(true);
    // Scroll to form
    window.scrollTo({ top: document.querySelector('form')?.offsetTop ? document.querySelector('form')!.offsetTop - 200 : 0, behavior: 'smooth' });
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      setSavedAddresses((prev) => prev.filter((a) => a._id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
        setShowNewAddressForm(true);
      }
    } catch (err) {
      setSubmitError("Failed to delete address.");
    }
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setShowNewAddressForm(false);
    // Reset form to user defaults if available
    if (user) {
      const [fName = "", ...lNameParts] = (user.name || "").split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: fName,
        lastName: lNameParts.join(" "),
        phone: user.phone || "",
        email: user.email || "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        saveAddress: false,
      }));
    }
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

        // Optionally save or update address if requested
        if (formData.saveAddress && isLoggedIn) {
          if (editingAddressId) {
            await updateAddress(editingAddressId, {
              fullName: addressData.name,
              phone: addressData.phone,
              line1: formData.addressLine,
              city: formData.city,
              state: formData.state,
              postalCode: formData.pincode,
              label: "Saved Address",
            }).catch((err: any) => console.error("Could not update address:", err));
            setEditingAddressId(null);
            // Reload addresses to reflect changes in the selection list
            loadAddresses();
          } else {
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
            // Reload addresses to include the new one
            loadAddresses();
          }
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
        orderType: "ONLINE",
        source: "WEBSITE",
        customer: {
          name: addressData.name,
          phone: addressData.phone,
          email: customerEmail,
        },
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: addressData.name,
          phone: addressData.phone,
          line1: addressData.addressLine,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.pincode,
          country: "India",
        },
      });

      // Step 2: Handle Payment Flow
      await processPayment(orderRes._id, addressData);

    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- Sub-components ---
  const SuccessView = ({ order }: { order: ConfirmedOrderData | null }) => {
    const orderNum = order?.orderId ? `#LD-${order.orderId.slice(-6).toUpperCase()}` : "#LD-000000";
    const orderDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
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
    }, []);
    
    // Sophisticated Production Journey
    const journey = [
      { label: "Order Authenticated", sub: orderDate, done: true },
      { label: "Material Selection", sub: "Artisanal Silk & Lace", done: false },
      { label: "Hand-Embroidery", sub: "400+ Hours of Craft", done: false },
      { label: "Final Fitting", sub: "Couture Quality Check", done: false },
      { label: "Signature Delivery", sub: "Hand-Delivered Luxury", done: false },
    ];
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-1000 pt-20">
        <div className="max-w-2xl w-full space-y-12">
          {/* Large Green Checkmark */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-[3px] border-[#22c55e] flex items-center justify-center animate-in zoom-in duration-700">
              <CheckCircle size={48} className="text-[#22c55e]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className={`${playfair.className} text-5xl md:text-7xl font-normal text-black tracking-tight`}>
              Order Confirmed
            </h1>
            <p className="text-[#6b6560] text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
              Thank you, {formData.firstName || "Customer"}. Your order <span className="font-bold text-black">{orderNum}</span> has been placed successfully.
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
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] tracking-[0.4em] uppercase text-[#c5a059] font-bold">
                               {addr.label || "Saved Destination"}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <button 
                                 onClick={(e) => handleEditAddress(e, addr)}
                                 className="p-1.5 hover:bg-black hover:text-white rounded-full transition-colors"
                                 title="Edit Address"
                               >
                                 <Edit2 size={12} />
                               </button>
                               <button 
                                 onClick={(e) => handleDeleteAddress(e, addr._id)}
                                 className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                 title="Delete Address"
                               >
                                 <Trash2 size={12} />
                               </button>
                            </div>
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
                          <div className="absolute bottom-6 right-6 flex items-center gap-2">
                             {addr.isDefault && (
                                <span className="text-[8px] bg-black text-white px-3 py-1 tracking-widest uppercase font-bold">Primary</span>
                             )}
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
                  <div className="space-y-12 animate-in slide-in-from-top-8 fade-in duration-1000">
                    <div className="flex items-center justify-between">
                       <h3 className={`${playfair.className} text-2xl text-black`}>
                         {editingAddressId ? "Edit Address" : "New Shipping Destination"}
                       </h3>
                       {editingAddressId && (
                         <button 
                           onClick={handleCancelEdit}
                           className="text-[9px] tracking-[0.3em] uppercase text-[#9c9690] hover:text-black transition-colors"
                         >
                           Cancel Edit
                         </button>
                       )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-12">
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
                              {isSubmitting ? "Securing Transaction..." : editingAddressId ? `Update & Authorize — ₹${totalPrice.toLocaleString("en-IN")}.00` : `Confirm & Authorize — ₹${totalPrice.toLocaleString("en-IN")}.00`}
                           </span>
                           <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                        </button>
                      </div>
                    </form>
                  </div>
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