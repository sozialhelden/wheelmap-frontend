import type { IncomingMessage } from "node:http";
import { type ParsedQuery, parseUrl } from "query-string";

export function getRequestUrl(request?: IncomingMessage): string {
  return request?.url ?? window.location.href;
}

export function getRequestUserAgent(request?: IncomingMessage): string {
  return request?.headers["user-agent"] ?? navigator.userAgent;
}

export function getRequestHostname(request?: IncomingMessage): string {
  const withPort = request?.headers.host ?? window.location.hostname;
  return withPort.split(":")[0];
}

export function getRequestQuery(
  request?: IncomingMessage,
): ParsedQuery<string> {
  return parseUrl(getRequestUrl(request)).query;
}
