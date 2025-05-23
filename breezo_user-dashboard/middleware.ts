import { NextResponse, type NextRequest } from "next/server";
// import { decryptJwtPayload } from "./lib/utils";

export default function middleware(request: NextRequest) {
  if (!request.cookies.get("token")) {
    return NextResponse.redirect(
      new URL(`/login?from=${request.nextUrl.pathname}`, request.url)
    );
  }
}
export const config = {
  matcher: ["/dashboard", "/referral", "/rewards"],
};
