export default function EnglishFlag({ extraClasses }: { extraClasses: string }) {
  return (
    <svg viewBox="0 0 60 40" className={extraClasses}>
      <defs>
        <clipPath id="t">
          <path d="M30,15H60V30zM30,15V30H0zM30,15H0V0zM30,15V0H60z" />
        </clipPath>
      </defs>
      <rect width="60" height="40" fill="#00247d" />
      <g style={{stroke: "#ffffff", strokeWidth: 6.93225527, fill: "none"}}>
        <path d="M0,0L60,40M60,0L0,40" />
        <path d="M0,0L60,30M60,0L0,30" style={{stroke: "#cf142b", strokeWidth: 4}} clip-path="url(#t)" transform="scale(1,1.3333333)" />
        <path d="M30,0V40M0,20H60" style={{strokeWidth: 11.55375878}} />
        <path d="M30,0V40M0,20H60" style={{stroke: "#cf142b"}} />
      </g>
    </svg>
  );
}
