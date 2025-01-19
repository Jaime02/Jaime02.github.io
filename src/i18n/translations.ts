export const languages = {
  en: "English",
  es: "Español",
};

export const defaultLang = "en";

export const ui = {
  en: {
    "navbar.home": "Home",
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
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui): (key: keyof (typeof ui)[typeof defaultLang]) => string {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    const possibleT = ui[lang][key];
    if (possibleT === "") return "";
    return possibleT || ui[defaultLang][key]
  };
}

export function getTranslationsFromUrl(url: URL): (key: keyof (typeof ui)[typeof defaultLang]) => string {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}
