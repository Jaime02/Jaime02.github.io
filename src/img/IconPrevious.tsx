import type { SVGProps } from "react";
export default function IconPrevious({
  extraClasses,
  ...props
}: SVGProps<SVGSVGElement> & {
  extraClasses?: string;
}) {
  return (
    <svg className={extraClasses} viewBox="0 -880 471 800" fill="currentColor" {...props}>
      <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
    </svg>
  );
}
