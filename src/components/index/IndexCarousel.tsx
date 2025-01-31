import AutoCarousel from "@/components/ui/AutoCarousel";

export default function IndexCarousel() {
  return (
    <AutoCarousel extraClasses="shadow-base w-full mx-auto object-contain lg:max-w-screen-xl">
      <img src={"/img/Facade.webp"} className="min-w-0" alt="Facade" />
      <img src={"/img/BrassTurning.webp"} className="min-w-0" alt="Brass turning" />
      <img src={"/img/SteelTurning.webp"} className="min-w-0" alt="Steel turning" />
    </AutoCarousel>
  );
}
