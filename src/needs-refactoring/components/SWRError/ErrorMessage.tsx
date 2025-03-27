import { t } from "@transifex/native";
import type { FC } from "react";
import styled from "styled-components";
import ResourceError from "~/needs-refactoring/lib/fetchers/ResourceError";
import StyledMarkdown from "../shared/StyledMarkdown";

export const ErrorCodeTitles = {
  400: t("Bad request"),
  401: t("Unauthorized"),
  402: t("Payment required"),
  403: t("Forbidden"),
  404: t("Not found"),
  405: t("Method not allowed"),
  406: t("Not acceptable"),
  407: t("Proxy authentication required"),
  408: t("Request timeout"),
  409: t("Conflict"),
  410: t("Gone"),
  411: t("Length required"),
  412: t("Precondition failed"),
  413: t("Payload too large"),
  414: t("URI too long"),
  415: t("Unsupported media type"),
  416: t("Range not satisfiable"),
  417: t("Expectation failed"),
  418: t(`I'm a teapot`),
  421: t("Misdirected request"),
  422: t("Unprocessable entity"),
  423: t("Locked"),
  424: t("Failed dependency"),
  425: t("Too early"),
  426: t("Upgrade required"),
  428: t("Precondition required"),
  429: t("Too many requests"),
  431: t("Request header fields too large"),
  451: t("Unavailable for legal reasons"),
  500: t("Internal server error"),
  501: t("Not implemented"),
  502: t("Bad gateway"),
  503: t("Service unavailable"),
  504: t("Gateway timeout"),
  505: t("HTTP version not supported"),
  506: t("Variant also negotiates"),
  507: t("Insufficient storage"),
  508: t("Loop detected"),
  510: t("Not extended"),
  511: t("Network authentication required"),
} as const;

export const ErrorCodeExplanation = {
  400: t("The server could not understand what the app was asking for."),
  401: t("The app is not authorized to access the requested resource."),
  402: t("The app needs to pay to access the requested resource."),
  403: t("The app is not allowed to access the requested resource."),
  404: t("This seems not to be there (or not there anymore)."),
  405: t(
    "The app tried to use an HTTP method that is not allowed for the requested resource.",
  ),
  406: t(
    "The app requested a response in a format that the server cannot provide.",
  ),
  407: t("There seems to be a proxy or VPN server that requires a login."),
  408: t(
    "The server waited too long for the app to send data. This can happen when the network connection is very slow. Please move somewhere with better reception.",
  ),
  409: t(
    "The app tried to change something that was changed somewhere else at the same time.",
  ),
  410: t("The requested resource is not there anymore."),
  411: t(
    "The server expected the app to send a specific header that was missing.",
  ),
  412: t(
    "The app wanted to do something, but the server expected a precondition to be met before that.",
  ),
  413: t("The app tried to send too much data at once."),
  414: t("The app tried to access a URL that was too long."),
  415: t(
    "The app tried to send data in a format that the server cannot understand.",
  ),
  416: t("The app tried to access a part of a file that does not exist."),
  417: t("The app expected something that the server could not provide."),
  418: t("The server is a teapot. Seriously, it is not a coffee machine."),
  421: t("The server received a request that was meant for another server."),
  422: t(`The server could not process the app's request.`),
  423: t(
    "The requested resource is locked and cannot be accessed at this time. Please try again later.",
  ),
  424: t(
    "The app tried to do something that depends on something else that failed.",
  ),
  425: t("The app tried to access something that is not available yet."),
  426: t("The app needs to upgrade to access the requested resource."),
  428: t(
    "The server expected the app to send a specific header that was missing.",
  ),
  429: t(
    "The app tried to access the server too often. Please try again later.",
  ),
  431: t("Request header fields too large."),
  451: t("Unavailable for legal reasons."),
  500: t("Internal server error."),
  501: t("The app requested a feature that the server does not support (yet)."),
  502: t("The server is not working properly."),
  503: t("The server is not available at the moment. Please try again later."),
  504: t("The server is not responding or overloaded. Please try again later."),
  505: t("The server does not support the HTTP version that the app is using."),
  506: t(
    "The server tried to negotiate a variant of the requested resource, but failed.",
  ),
  507: t(
    `The server does not have enough storage to fulfill the app's request.`,
  ),
  508: t("Loop detected."),
  510: t("The server does not support the HTTP version that the app is using."),
  511: t("The server requires the app to authenticate with a network."),
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
