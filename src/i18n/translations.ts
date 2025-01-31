export const languages = {
  en: "English",
  es: "Español",
};

export const defaultLang = "en";

export const translations = {
  en: {
    navbar: {
      home: "Home",
      openMenu: "Open menu",
      location: "Location",
      contact: "Contact",
    },
    index: {
      title1: "We are ",
      title2: "CNC bar turning",
      title3: " experts",
      definition:
        "Screw machining refers to the manufacturing of parts of revolution (screws, shafts, bolts...) by machining bar or roll material by chip removal using a cutting tool for series production.",
      question: "Do you want to see it?",
      viewDemo: "View the demo",
      ourProducts: "Our products",
    },
    loadingScreen: {
      title: "Loading...",
    },
    demo: {
      title: "CNC lathe simulation",
      start: "Start",
    },
    fullscreenButton: {
      enterFullscreen: "Full screen",
      exitFullscreen: "Exit full screen",
    },
    location: {
      title: "Location",
      address: 'Address: Polígono industrial El Escopar, "B" Street, 28',
      zipcode: "Postal code",
      city: "Peralta, Navarra",
      description:
        "We are located in Peralta, locality that is located in the south of the Community of Navarra. Limited to the north with Falces, to the east with Marcilla, to the south with Funes and to the west with Azagra, San Adrián and Andosilla.",
    },
    contact: {
      title: "Contact",
    },
  },
  es: {
    navbar: {
      home: "Inicio",
      openMenu: "Abrir menú",
      location: "Ubicación",
      contact: "Contacto",
    },
    index: {
      title1: "Somos especialistas en ",
      title2: "Decoletaje y Mecanizado CNC",
      title3: "",
      definition:
        "El decoletaje designa la fabricación de piezas de revolución (tornillos, ejes, bulones...) mecanizando material en barra o en rollo por arranque de viruta mediante una herramienta de corte y para una fabricación en serie.",
      question: "¿Quieres verlo?",
      viewDemo: "Demo",
      ourProducts: "Nuestros productos",
    },
    loadingScreen: {
      title: "Cargando...",
    },
    demo: {
      title: "Simulación de un torno CNC",
      start: "Comenzar",
    },
    fullscreenButton: {
      enterFullscreen: "Pantalla completa",
      exitFullscreen: "Salir del modo pantalla completa",
    },
    location: {
      title: "Ubicación",
      address: 'Dirección: Polígono industrial El Escopar, Calle "B", 28',
      zipcode: "Código postal",
      city: "Peralta, Navarra",
      description:
        "Estamos situados en Peralta, localidad situada en la zona sur de la Comunidad Foral de Navarra. Limita al norte con Falces, al este con Marcilla, al sur con Funes y al oeste con Azagra, San Adrián y Andosilla.",
    },
    contact: {
      title: "Contacto",
    },
  },
} as const;

type Lang = keyof typeof translations;
type TranslationsType = (typeof translations)[Lang];
type PageKeys = keyof TranslationsType;
type KeyOfPage<T extends PageKeys> = keyof TranslationsType[T];

export function useTranslations(lang: Lang) {
  return function t<T extends PageKeys>(pageKey: T, key: KeyOfPage<T>): string {
    const translation = translations[lang][pageKey][key];
    if (translation === "") return "";
    return translation || translations[defaultLang][pageKey][key];
  };
}
type UseTranslationsType = ReturnType<typeof useTranslations>;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in translations) return lang as keyof typeof translations;
  return defaultLang;
}

export function useTranslationsFromUrl(url: URL): UseTranslationsType {
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
