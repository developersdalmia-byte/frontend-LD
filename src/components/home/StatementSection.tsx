type StatementSectionProps = {
  text?: string;
};

export default function StatementSection({
  text = "Elegance is not just worn, it is experienced.",
}: StatementSectionProps) {
  return (
    <section className="bg-[#f4f2ee] py-20 md:py-28 px-4">
      
      <div className="max-w-4xl mx-auto text-center">

        {/* Decorative Line Top */}
        <div className="w-12 h-[1px] bg-gray-300 mx-auto mb-8" />

        {/* Statement */}
        <h2 className="font-playfair text-xl sm:text-2xl md:text-4xl text-gray-800 leading-relaxed tracking-wide">
          {text}
        </h2>

        {/* Decorative Line Bottom */}
        <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-8" />

      </div>
    </section>
  );
}