type PhilosophySectionProps = {
  quote?: string;
  author?: string;
};

export default function PhilosophySection({
  quote = "True luxury lies not in excess, but in the quiet confidence of craftsmanship and timeless design.",
  author = "Lalit Dalmia",
}: PhilosophySectionProps) {
  return (
    <section className="bg-white py-20 md:py-28 px-4">
      
      <div className="max-w-5xl mx-auto text-center">

        {/* Decorative Line Top */}
        <div className="w-12 h-[1px] bg-gray-300 mx-auto mb-8" />

        {/* Quote */}
        <p className="font-playfair text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed tracking-wide italic">
          “{quote}”
        </p>

        {/* Decorative Line Bottom */}
        <div className="w-12 h-[1px] bg-gray-300 mx-auto my-8" />

        {/* Author */}
        <p className="text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">
          {author}
        </p>

      </div>
    </section>
  );
}