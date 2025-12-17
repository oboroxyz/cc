import { createClient, Errors } from "@farcaster/quick-auth";
import type { Route } from "./+types/api.auth";

const client = createClient();

export async function loader({ request }: Route.LoaderArgs) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return Response.json({ message: "Missing token" }, { status: 401 });
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: getUrlHost(request),
    });

    const userFid = payload.sub;

    return Response.json({ userFid });
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 500 });
    }

    throw e;
  }
}

function getUrlHost(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return url.host;
    } catch (error) {
      console.warn("Invalid origin header:", origin, error);
    }
  }

  const host = request.headers.get("host");
  if (host) {
    return host;
  }

  // Fallback to environment variables if available in context (not directly accessible here without context)
  // For now, we rely on host header which is standard.
  // If we need env vars, we should access them via context.cloudflare.env

  return "localhost:5173"; // Default fallback
}
