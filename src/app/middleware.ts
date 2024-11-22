export const config = {
  matcher: ["/found-item/:path*", "/lost-item/:path*"],
};
export { auth as middleware } from "@/auth/nextAuth";
