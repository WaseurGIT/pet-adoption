import { Link } from "react-router-dom";
import { FiHeart, FiArrowRight } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Banner = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("#left", {
      opacity: 0,
      x: -100,
      duration: 1,
      ease: "power2.out",
    })
      .from(
        "#right",
        {
          opacity: 0,
          x: 100,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      )
      .from(
        "#floating_card",
        {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      );
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Decorative Background Blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div id="left" className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-orange-600 uppercase bg-orange-100 rounded-full">
              🐾 1,200+ Pets Found Homes
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15]">
              Find Your New <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Best Friend
              </span>
            </h1>

            <p className="mt-8 text-slate-600 text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Skip the breeder, save a life. Browse thousands of adoptable pets
              waiting for a family to call their own. Your journey starts with a
              wag.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/pets"
                className="group flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-300"
              >
                Find a Pet{" "}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/donation"
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold hover:border-orange-200 hover:text-orange-500 transition-all duration-300"
              >
                <FiHeart className="text-orange-500" /> Support Us
              </Link>
            </div>
          </div>

          {/* Right Image with Floating Stats */}
          <div id="right" className="flex-1 relative group">
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
                alt="Happy Golden Retriever"
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Floating Card */}
            <div
              id="floating_card"
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 hidden md:flex items-center gap-4 animate-bounce-slow"
            >
              <div className="bg-orange-100 p-3 rounded-xl text-2xl">🐶</div>
              <div>
                <p className="text-sm font-bold text-slate-800 tracking-tight">
                  Meet "Buddy"
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Ready for adoption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
