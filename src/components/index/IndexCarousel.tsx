import AutoCarousel from "@/components/ui/AutoCarousel";

export default function IndexCarousel() {
  return (
    <AutoCarousel extraClasses="shadow-base w-full mx-auto object-contain lg:max-w-screen-xl">
      <img src={"/img/Facade.webp"} alt="Facade" />
      <img src={"/img/BrassTurning.webp"} alt="Brass turning" />
      <img src={"/img/SteelTurning.webp"} alt="Steel turning" />
    </AutoCarousel>
  );
}
