import { useCallback, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function FullScreenButton({
  refDemo,
}: {
  refDemo: React.RefObject<HTMLDivElement | null>;
}) {
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

  const fullscreenButtonSource = isFullscreen
    ? "/WebTaller/img/CloseFullscreen.svg"
    : "/WebTaller/img/OpenFullscreen.svg";

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
          <Button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 bg-white rounded-md"
          >
            <img
              className="size-8"
              src={fullscreenButtonSource}
              alt="Toggle fullscreen"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle fullscreen</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
