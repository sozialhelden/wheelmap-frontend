/**
 * Readiness probe endpoint.
 * Returns 200 OK if the application is ready to serve traffic.
 * Used by Kubernetes to determine if the container should receive traffic.
 */
export async function GET(_request: Request) {
  // For a Next.js frontend, being able to respond means we're ready.
  // Add additional checks here if needed (e.g., database connections, external services).
  return Response.json({ status: "ready" });
}
