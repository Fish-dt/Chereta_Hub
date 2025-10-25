import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("Middleware - Received token:", token);
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true
        }

        // Require token for protected routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          console.log("Middleware - Admin route check:", { tokenRole: token?.role, pathname: req.nextUrl.pathname })
          return token?.role === "admin" || token?.role === "moderator"
        }

        if (req.nextUrl.pathname.startsWith("/payment-manager")) {
          return token?.role === "payment_manager" || token?.role === "admin"
        }

        if (req.nextUrl.pathname.startsWith("/delivery")) {
          return token?.role === "delivery" || token?.role === "admin"
        }

        if (req.nextUrl.pathname.startsWith("/marketing")) {
          console.log("Middleware - Marketing route check:", { tokenRole: token?.role, pathname: req.nextUrl.pathname })
          return token?.role === "marketing" || token?.role === "admin"
        }

        if (req.nextUrl.pathname.startsWith("/support")) {
          return token?.role === "support" || token?.role === "admin"
        }

        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*", 
    "/sell/:path*",
    "/payment-manager/:path*",
    "/delivery/:path*",
    "/marketing/:path*",
    "/support/:path*"
  ],
}
