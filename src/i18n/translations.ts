export const languages = {
  en: "English",
  es: "Español",
};

export const defaultLang = "en";

export const translations = {
  en: {
    "navbar.home": "Home",
    "navbar.openMenu": "Open menu",
    "navbar.location": "Location",
    "navbar.contact": "Contact",
    "index.title.1": "We are ",
    "index.title.2": "CNC bar turning",
    "index.title.3": " experts",
    "index.definition": "Screw machining refers to the manufacturing of parts of revolution (screws, shafts, bolts...) by machining bar or roll material by chip removal using a cutting tool for series production.",
    "index.question": "Do you want to see it?",
    "index.viewDemo": "View the demo",
    "loadingScreen.title": "Loading...",
    "demo.title": "CNC lathe simulation",
    "demo.start": "Start",
    "fullscreenButton.enterFullscreen": "Full screen",
    "fullscreenButton.exitFullscreen": "Exit full screen",
  },
  es: {
    "navbar.home": "Inicio",
    "navbar.openMenu": "Abrir menú",
    "navbar.location": "Ubicación",
    "navbar.contact": "Contacto",
    "index.title.1": "Somos expertos en ",
    "index.title.2": "Decoletaje CNC y Mecanizado",
    "index.title.3": "",
    "index.definition": "El decoletaje designa la fabricación de piezas de revolución (tornillos, ejes, bulones...) mecanizando material en barra o en rollo por arranque de viruta mediante una herramienta de corte y para una fabricación en serie.",
    "index.question": "¿Quieres verlo?",
    "index.viewDemo": "Demo",
    "loadingScreen.title": "Cargando...",
    "demo.title": "Simulación de un torno CNC",
    "demo.start": "Comenzar",
    "fullscreenButton.enterFullscreen": "Pantalla completa",
    "fullscreenButton.exitFullscreen": "Salir del modo pantalla completa",
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in translations) return lang as keyof typeof translations;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof translations): (key: keyof (typeof translations)[typeof defaultLang]) => string {
  return function t(key: keyof (typeof translations)[typeof defaultLang]): string {
    const possibleT = translations[lang][key];
    if (possibleT === "") return "";
    return possibleT || translations[defaultLang][key]
  };
}

export function getTranslationsFromUrl(url: URL): (key: keyof (typeof translations)[typeof defaultLang]) => string {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}

export function getUrlWithoutLocale(url: URL): string {
  for (const locale of Object.keys(languages)) {
    if (url.pathname.startsWith(`/${locale}/`)) {
      return url.pathname.replace(`/${locale}/`, "/");
    }
  }

  return url.pathname;
}