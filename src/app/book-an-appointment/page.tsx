"use client";

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-[#ffff] pt-32 pb-24 px-6">
      
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl text-center tracking-wide mb-6">
          Schedule an Appointment
        </h1>

        <p className="text-center text-sm text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
          To schedule a virtual or an in-store appointment at one of our flagship stores,
          please fill out your information and our consultant will contact you within 24 hours.
        </p>

        {/* FORM */}
        <form className="space-y-10">

          {/* Store */}
          <div>
            <label className="text-sm block mb-2">Store Location *</label>
            <select className="w-full border-b border-gray-400 bg-transparent py-3 outline-none">
              <option>Pitampura Store</option>
              <option>Lado Sarai Flagship</option>
              <option>Chandni Chowk Store</option>
            </select>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email *"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Contact */}
          <input
            type="text"
            placeholder="Contact"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Time + Date */}
          <div className="grid md:grid-cols-2 gap-10">
            <input
              type="time"
              className="border-b border-gray-400 py-3 bg-transparent outline-none"
            />
            <input
              type="date"
              className="border-b border-gray-400 py-3 bg-transparent outline-none"
            />
          </div>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name *"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Email + Phone */}
          <div className="grid md:grid-cols-3 gap-10">
            <input
              type="email"
              placeholder="Email *"
              className="border-b border-gray-400 py-3 bg-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Country Code"
              className="border-b border-gray-400 py-3 bg-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number *"
              className="border-b border-gray-400 py-3 bg-transparent outline-none"
            />
          </div>

          {/* Event Date */}
          <input
            type="date"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none"
          />

          {/* Message */}
          <textarea
            placeholder="Message to Our Consultants"
            className="w-full border-b border-gray-400 py-3 bg-transparent outline-none resize-none"
          />

          {/* Checkboxes */}
          <div className="space-y-4 text-sm mt-6">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>
                Sign up for newsletters and stay updated.
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>
                I agree to Privacy Policy and Terms & Conditions.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button className="bg-black text-white px-12 py-3 uppercase tracking-[0.2em] hover:opacity-80 transition">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}