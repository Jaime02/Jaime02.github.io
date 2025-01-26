import { useCallback, useEffect, useState } from "react";
import IconCloseFullscreen from "@/img/IconCloseFullscreen";
import IconOpenFullscreen from "@/img/IconOpenFullscreen";
import { useTranslationsFromUrl } from "@/i18n/translations";
// import { Tooltip } from "flowbite-react";

export default function FullscreenButton({ refDemo }: { refDemo: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslationsFromUrl(new URL(window.location.href));

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      refDemo.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [refDemo]);

  const tooltipContent = isFullscreen ? t("fullscreenButton", "exitFullscreen") : t("fullscreenButton", "enterFullscreen");

  return (
    <Tooltip content={tooltipContent} placement="bottom" onClick={toggleFullscreen} className="absolute bg-[rgba(0,0,0,0.5)] text-white top-2 right-2 rounded-md">
      {isFullscreen ? <IconCloseFullscreen extraClasses="size-8" /> : <IconOpenFullscreen extraClasses="size-8" />}
    </Tooltip>
  );
}
