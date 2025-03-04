import type { SVGProps } from "react";
export default function IconNext({
  extraClasses,
  ...props
}: SVGProps<SVGSVGElement> & {
  extraClasses?: string;
}) {
  return (
    <svg className={extraClasses} viewBox="250 -880 471 800" fill="currentColor" {...props}>
      <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
    </svg>
  );
}
