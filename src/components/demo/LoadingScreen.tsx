import { getTranslationsFromUrl } from "@/i18n/translations";

export default function LoadingScreen() {
  const t = getTranslationsFromUrl(new URL(window.location.href));

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-center font-bold text-3xl">{t("loadingScreen.title")}</h1>
    </div>
  );
}