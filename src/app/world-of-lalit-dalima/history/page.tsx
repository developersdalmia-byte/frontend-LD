"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavbarScroll } from "@/components/layout/navbar/useNavbarScroll";

const HISTORY_DATA = [
  {
    year: "2014",
    title: "The Rise of Lalit Dalmia",
    subtitle: "Bangalore Fashion Week",
    image: "#",
    content:
      "In 2014, Lalit Dalmia made his grand debut at Bangalore Fashion Week. It was the first time the world was witnessing his collection, where pastel greens and blues made a strong comeback. The evening found its defining moment with Aditi Rao Hydari as the showstopper. This first major runway laid the foundation of Lalit's legacy, rooted in his grand vision.",
    quote: "The first step onto the runway — a vision unveiled to the world.",
  },
  {
    year: "2015",
    title: "A New Shoreline",
    subtitle: "Indian Beach Fashion Week",
    image: "/2015 IBFW 1_result.avif",
    content: "Lalit found himself surrounded by the vast sea, cool breeze, and unmistakable Goan vibes at Indian Beach Fashion Week. The first half of the show was spiced with bold bikinis and swimwear, before he turned the runway upside down with his striking <i>zombie brides </i>. Blending the unexpected with tradition, Lalit delivered a clear message to the world—he is unapologetically experimental.",
    quote: "Unapologetically experimental. Fearlessly original.",
  },
  {
    year: "2016",
    title: "Lalit Dalmia Fashion Museum",
    subtitle: "A Living Archive",
    image: "#",
    content:
      "Lalit Dalmia found a home for his timeless designs as he opened his grand 16,000-square-foot Lalit Dalmia Fashion Museum in Pitampura. Delhi witnessed something extraordinary—a living historical archive capturing his evolving design language. Alongside this, he presented his collection at Lakmé Fashion Week 2016. Lalit emerged not just as a designer, but as a curator of legacy.",
    quote: "Not just a designer — a curator of living legacy.",
  },
  {
    year: "2017",
    title: "The Year of Dominance",
    subtitle: "Chennai Open · Tech Fashion Tour · Delhi Times Fashion Week",
    image: "/2017 TFT 3 Edited_result.avif",
    content:
      "From dressing tennis superstars Daniil Medvedev and Leander Paes at Chennai Open Fashion Week to amplifying the spectacle of Tech Fashion Tour with Esha Gupta as the showstopper, 2017 marked a year of complete dominance for Lalit. From his presence at Delhi Times Fashion Week to showcasing his collection La Moda at Indian Beach Fashion Week, Lalit remained the talk of the town throughout the year.",
    quote: "A year of complete dominance across every runway.",
  },
  {
    year: "2018",
    title: "The Shahi Kothi",
    subtitle: "Delhi 6",
    image: "/2018 tech fashion tour-_result.avif",
    content:
      "Carrying forward the legacy of Old Delhi, Lalit found a new home for his evolving design philosophy—Shahi Kothi, in the heart of Delhi 6. Here, his couture found its roots in the centuries-old craftsmanship and traditions of Old Delhi. Alongside this, the evening at Tech Fashion Tour 4.0 was elevated with Akshay Kumar as the showstopper.",
    quote: "Rooted in centuries-old craft. Evolved for the present.",
  },
  {
    year: "2019",
    title: "The Designer of B-Town",
    subtitle: "Bollywood's Favourite",
    image: "#",
    content:
      "At the peak of his career in 2019, Lalit became a favorite designer among top Bollywood celebrities, known for his distinctive aesthetic. He designed luxurious couture pieces for the industry's leading names, blending heritage craftsmanship with contemporary elegance, and establishing a strong presence in the world of fashion and cinema.",
    quote: "Heritage craftsmanship meets the silver screen.",
  },
  {
    year: "2021",
    title: "The ISCOW Foundation",
    subtitle: "Vrindavan",
    image: "#",
    content:
      "In 2021, Lalit found grounding in his spiritual journey alongside his father. He established ISCOW in Vrindavan, a cow welfare foundation rooted in seva and sadbhavna. ISCOW provides care, treatment, and dignity to injured and abandoned cows, even ensuring their last rites. Untouched by the pursuit of profit, it stands as an act of pure devotion, reflecting Lalit's philosophy—who is God, if not these innocent beings?",
    quote: "Who is God, if not these innocent beings?",
  },
  {
    year: "2022",
    title: "God's Own Destiny",
    subtitle: "HR Fashion Week · Thrissur",
    image: "#",
    content:
      "Lalit's love for the culture of Kerala took him to HR Fashion Week in Thrissur. Set against Kerala's rich cultural backdrop, his collection, carrying his signature style, created a powerful dialogue between tradition and contemporary design. With Parvathy Omanakuttan as the showstopper, Lalit elevated the runway experience.",
    quote: "Tradition and contemporary design — in powerful dialogue.",
  },
  {
    year: "2023",
    title: "Global Stage, Bold Expression",
    subtitle: "Global Indian Couture Week",
    image: "/2023 gicw 2_result.avif",
    content:
      "The spotlight shifted to the global stage with GICW 4.0, where Lalit's collection embraced avant-garde couture and experimental luxury. The runway culminated with Georgia Andriani as the showstopper, adding an international allure to the moment.",
    quote: "Avant-garde couture. International allure. Bold expression.",
  },
  {
    year: "2024",
    title: "The Grand Finale",
    subtitle: "GICW 2024",
    image: "/2024 gicw 3_result.avif",
    content:
      "Lalit commanded the grand finale at Global Indian Couture Week 2024, marking a moment of scale and authority. The collection moved between bridal couture and statement pieces, with each look balancing tradition and a sharp modern voice. It marked the arrival of a vision fully realized.",
    quote: "A vision — fully realized.",
  },
  {
    year: "2025",
    title: "The Couture Haveli",
    subtitle: "Qutub Minar",
    image: "#",
    content:
      "Lalit Dalmia's dream of a monumental tribute to Indian craftsmanship came to life in 2025 with the unveiling of his largest fashion museum, the Couture Haveli, at Qutub Minar. Collecting rare handcrafted artifacts and paintings from across India, it is more than a museum—it is an immersive world where fashion and art converge. Every corner breathes artistry and legacy.",
    quote: "An immersive world where fashion and art converge.",
  },
];

export default function HistoryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeItem = HISTORY_DATA[activeIndex];
  const { showNav } = useNavbarScroll();

  const goTo = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const goPrev = () => goTo(Math.max(0, activeIndex - 1));
  const goNext = () => goTo(Math.min(HISTORY_DATA.length - 1, activeIndex + 1));

  // Scroll active year tab into view
  useEffect(() => {
    if (timelineRef.current) {
      const activeBtn = timelineRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      ) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-white font-playfair">
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[500px] flex items-end pb-16 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://api.lalitdalmia.com/uploads/websiteImages/Banner/history-hero.jpg')",
            filter: "brightness(0.45)",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* Fallback dark bg if image fails */}
        <div className="absolute inset-0 bg-neutral-900 -z-10" />

        {/* Hero Text */}
        <div className="relative z-10 w-full text-center text-white px-6">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3 opacity-75"
            style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic" }}
          >
            World of Lalit Dalmia
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-[0.15em] uppercase"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            History
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={32} className="text-white opacity-60" />
        </div>
      </section>

      {/* ── Year Timeline Tabs ── */}
      <div
        className={`border-b border-gray-400 sticky z-40 bg-white transition-[top] duration-300 ease-in-out ${showNav ? "top-[70px] md:top-[130px]" : "top-0"
          }`}
      >
        <div
          ref={timelineRef}
          className="flex md:justify-center overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {HISTORY_DATA.map((item, i) => (
            <button
              key={item.year}
              data-index={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 px-6 py-5 text-sm tracking-[0.2em] uppercase transition-all duration-200 border-b-2 font-medium ${i === activeIndex
                  ? "bg-black text-white border-black"
                  : "text-gray-500 border-transparent hover:text-black hover:border-gray-300"
                }`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {item.year}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Section ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        {/* Year heading */}
        <div
          className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
        >
          {/* Title */}
          <h2
            className="text-3xl md:text-4xl font-bold tracking-wide text-center uppercase mb-12"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {activeItem.title}
          </h2>

          {/* Editorial Image Card (formerly the black section) */}
          <div className="relative aspect-video mb-12 overflow-hidden group">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage: `url('${activeItem.image}')`,
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:bg-black/50" />

            {/* Quote Overlay */}
            <div className="relative h-full flex flex-col items-center justify-center text-center p-8 md:p-12 z-10">
              <p
                className="text-white text-base md:text-2xl leading-relaxed italic max-w-2xl"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                &ldquo;{activeItem.quote}&rdquo;
              </p>
              <div className="mt-8 flex justify-center">
                <img
                  src="https://api.lalitdalmia.com/uploads/websiteImages/Logo/LD-LOGO-white.webp"
                  alt="Lalit Dalmia"
                  className="h-16 md:h-20 object-contain opacity-80"
                />
              </div>
            </div>

            {/* Fallback pattern if image is missing */}
            <div className="absolute inset-0 bg-neutral-900 -z-10" />
          </div>

          {/* Body text */}
          <p
            className="text-gray-700 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto"
            style={{ fontFamily: "Playfair Display, serif" }}
            dangerouslySetInnerHTML={{ __html: activeItem.content }}
          />
        </div>

        {/* ── Ultra-Simple Navigation ── */}
        <div className="flex items-center justify-between mt-24 pt-12 border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:opacity-60 transition-opacity disabled:opacity-0"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            Previous
          </button>

          <button
            onClick={goNext}
            disabled={activeIndex === HISTORY_DATA.length - 1}
            className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:opacity-60 transition-opacity disabled:opacity-0"
          >
            Next
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </section>
    </div>
  );
}
