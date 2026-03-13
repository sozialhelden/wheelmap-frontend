/**
 * Liveness probe endpoint.
 * Returns 200 OK if the process is running.
 * Used by Kubernetes to determine if the container should be restarted.
 */
export async function GET(_request: Request) {
  return Response.json({ status: "ok" });
}
