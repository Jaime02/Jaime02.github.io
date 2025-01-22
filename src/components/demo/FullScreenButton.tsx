import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import IconCloseFullscreen from "@/img/IconCloseFullscreen";
import IconOpenFullscreen from "@/img/IconOpenFullscreen";
import { useTranslationsFromUrl } from "@/i18n/translations";

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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={toggleFullscreen} className="absolute bg-[rgba(0,0,0,0.5)] text-white top-2 right-2 rounded-md">
            {isFullscreen ? <IconCloseFullscreen extraClasses="size-8"/> : <IconOpenFullscreen extraClasses="size-8"/>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFullscreen ? t("fullscreenButton", "exitFullscreen") : t("fullscreenButton", "enterFullscreen")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
