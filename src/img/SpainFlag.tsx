export default function SpainFlag({ extraClasses }: { extraClasses: string }) {
  return (
    <svg className={extraClasses} viewBox="0 0 750 500">
      <rect width="750" height="500" fill="#ad1519" />
      <rect y="125" width="750" height="250" fill="#fabd00" />
    </svg>
  );
}
