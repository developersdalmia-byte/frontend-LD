type QuoteSectionProps = {
  quote?: string;
  author?: string;
};

export default function QuoteSection({
  quote = `There's a restraint to it - a confidence in not overdoing, in letting the craft breathe. I'm proud of how light the garments feel, how beautifully they move, and how intricately they're made, while still holding that emotional resonance`,
  author = "Lalit Dalmia",
}: QuoteSectionProps) {
  return (
    <section className="bg-[#f4f2ee] py-16 md:py-24 px-4">
      
      <div className="max-w-4xl mx-auto text-center">

        {/* Quote */}
        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed tracking-wide mb-8">
          “{quote}”
        </p>

        {/* Author */}
        <p className="text-gray-600 text-sm md:text-base tracking-[0.2em] uppercase">
          — {author}
        </p>

      </div>
    </section>
  );
}