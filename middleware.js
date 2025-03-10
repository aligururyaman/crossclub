import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";

acceptLanguage.languages(["tr", "en"]);

export const config = {
  matcher: "/:path*",
};

export function middleware(request) {
  // Cookie'den dil tercihini al
  let lang = request.cookies.get("i18next")?.value || "tr";

  // Yeni response oluştur
  const response = NextResponse.next();

  // Cookie'yi response'a ekle
  if (!request.cookies.has("i18next")) {
    response.cookies.set("i18next", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });
  }

  return response;
}
