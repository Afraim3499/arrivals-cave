import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /portal routes (but allow /portal/login)
    const isPortalRoute = pathname.match(/^\/(en|bn)\/portal/);
    const isLoginPage = pathname.match(/^\/(en|bn)\/portal\/login/);

    if (isPortalRoute && !isLoginPage) {
        const portalAuth = request.cookies.get('portal_auth')?.value;

        if (!process.env.PORTAL_PASSWORD || portalAuth !== process.env.PORTAL_PASSWORD) {
            const url = request.nextUrl.clone();
            const localeMatch = pathname.match(/^\/(en|bn)/);
            const locale = localeMatch ? localeMatch[1] : 'en';
            url.pathname = `/${locale}/portal/login`;
            return NextResponse.redirect(url);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
