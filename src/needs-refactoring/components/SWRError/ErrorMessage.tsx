import { t } from "@transifex/native";
import type { FC } from "react";
import styled from "styled-components";
import ResourceError from "~/needs-refactoring/lib/fetchers/ResourceError";
import StyledMarkdown from "../shared/StyledMarkdown";

export const ErrorCodeTitles = {
  400: "Bad request",
  401: "Unauthorized",
  402: "Payment required",
  403: "Forbidden",
  404: "Not found",
  405: "Method not allowed",
  406: "Not acceptable",
  407: "Proxy authentication required",
  408: "Request timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length required",
  412: "Precondition failed",
  413: "Payload too large",
  414: "URI too long",
  415: "Unsupported media type",
  416: "Range not satisfiable",
  417: "Expectation failed",
  418: `I'm a teapot`,
  421: "Misdirected request",
  422: "Unprocessable entity",
  423: "Locked",
  424: "Failed dependency",
  425: "Too early",
  426: "Upgrade required",
  428: "Precondition required",
  429: "Too many requests",
  431: "Request header fields too large",
  451: "Unavailable for legal reasons",
  500: "Internal server error",
  501: "Not implemented",
  502: "Bad gateway",
  503: "Service unavailable",
  504: "Gateway timeout",
  505: "HTTP version not supported",
  506: "Variant also negotiates",
  507: "Insufficient storage",
  508: "Loop detected",
  510: "Not extended",
  511: "Network authentication required",
} as const;

export const ErrorCodeExplanation = {
  400: "The server could not understand what the app was asking for.",
  401: "The app is not authorized to access the requested resource.",
  402: "The app needs to pay to access the requested resource.",
  403: "The app is not allowed to access the requested resource.",
  404: "This seems not to be there (or not there anymore).",
  405: "The app tried to use an HTTP method that is not allowed for the requested resource.",
  406: "The app requested a response in a format that the server cannot provide.",
  407: "There seems to be a proxy or VPN server that requires a login.",
  408: "The server waited too long for the app to send data. This can happen when the network connection is very slow. Please move somewhere with better reception.",
  409: "The app tried to change something that was changed somewhere else at the same time.",
  410: "The requested resource is not there anymore.",
  411: "The server expected the app to send a specific header that was missing.",
  412: "The app wanted to do something, but the server expected a precondition to be met before that.",
  413: "The app tried to send too much data at once.",
  414: "The app tried to access a URL that was too long.",
  415: "The app tried to send data in a format that the server cannot understand.",
  416: "The app tried to access a part of a file that does not exist.",
  417: "The app expected something that the server could not provide.",
  418: "The server is a teapot. Seriously, it is not a coffee machine.",
  421: "The server received a request that was meant for another server.",
  422: `The server could not process the app's request.`,
  423: "The requested resource is locked and cannot be accessed at this time. Please try again later.",
  424: "The app tried to do something that depends on something else that failed.",
  425: "The app tried to access something that is not available yet.",
  426: "The app needs to upgrade to access the requested resource.",
  428: "The server expected the app to send a specific header that was missing.",
  429: "The app tried to access the server too often. Please try again later.",
  431: "Request header fields too large.",
  451: "Unavailable for legal reasons.",
  500: "Internal server error.",
  501: "The app requested a feature that the server does not support (yet).",
  502: "The server is not working properly.",
  503: "The server is not available at the moment. Please try again later.",
  504: "The server is not responding or overloaded. Please try again later.",
  505: "The server does not support the HTTP version that the app is using.",
  506: "The server tried to negotiate a variant of the requested resource, but failed.",
  507: `The server does not have enough storage to fulfill the app's request.`,
  508: "Loop detected.",
  510: "The server does not support the HTTP version that the app is using.",
  511: "The server requires the app to authenticate with a network.",
} as const;

export const GenericErrorTitle = t("An error occurred");
export const GenericErrorExplanation = t(
  "Please try again later or let us know if the error persists.",
);

const TitleBar = styled.h2`
  display: flex;
  flex-direction: row;


  ._image {
    font-size: 2rem;
    font-weight: 100;
  }

  ._title {
    font-size: 2rem;
    font-weight: 200;
  }
`;

export const ErrorMessage: FC<{ error: ResourceError | Error }> = ({
  error,
}) => {
  const title =
    (error instanceof ResourceError
      ? ErrorCodeTitles[error.status]
      : error.message) ?? GenericErrorTitle;
  const explanation =
    (error instanceof ResourceError
      ? ErrorCodeExplanation[error.status]
      : undefined) ?? GenericErrorExplanation;

  return (
    <>
      <TitleBar>
        <div className="_image">🫢</div>
        <div className="_title">{title}</div>
      </TitleBar>
      <StyledMarkdown>
        {error.message ?? t("An error occurred.")}
      </StyledMarkdown>
      <StyledMarkdown>{explanation}</StyledMarkdown>
    </>
  );
};
