export type Locale = "en" | "sk";

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = ["en", "sk"];
export const PARAM_KEY = "lang";

const ABSOLUTE_OR_SPECIAL_URL = /^(?:[a-z]+:|\/\/)/i;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "sk";
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [, maybeLocale] = pathname.split("/");
  return isLocale(maybeLocale) ? maybeLocale : null;
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";

  const stripped = pathname.slice(locale.length + 1);
  return stripped.startsWith("/") ? stripped : stripped ? `/${stripped}` : "/";
}

export function buildLocalizedPathname(pathname: string, locale: Locale): string {
  const cleanPath = stripLocalePrefix(pathname || "/");
  if (locale === DEFAULT_LOCALE) {
    return cleanPath || "/";
  }
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function buildLocalizedHref(href: string, locale: Locale): string {
  if (!href || href.startsWith("#") || ABSOLUTE_OR_SPECIAL_URL.test(href)) {
    return href;
  }

  const url = new URL(href, "https://audit.rehabit.ai");
  url.pathname = buildLocalizedPathname(url.pathname, locale);
  url.searchParams.delete(PARAM_KEY);

  return `${url.pathname}${url.search}${url.hash}`;
}
