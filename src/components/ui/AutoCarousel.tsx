import cn from "@/scripts/cn";
import React, { useEffect, useState } from "react";

export default function AutoCarousel({ children, period = 4000, extraClasses }: { children: React.ReactNode[]; period?: number; extraClasses: string }) {
  const images = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isHovered) {
        return;
      };
      setCurrentIndex((index) => (index + 1) % images.length);
    }, period);
    return () => clearInterval(intervalId);
  }, [isHovered, period, images.length]);

  return (
    <div className={cn("grid place-items-center overflow-hidden rounded-lg", extraClasses)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {images.map((child: React.ReactNode, index: number) => (
        <div key={index} className={`col-[1] row-[1] w-full h-full transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}>
          {child}
        </div>
      ))}
    </div>
  );
}
