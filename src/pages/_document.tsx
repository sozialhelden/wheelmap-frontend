import type { LanguageTag } from "@sozialhelden/core";
import { fallbackLanguageTag } from "@sozialhelden/core";
import type { DocumentContext, DocumentInitialProps } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";

interface DocumentProps {
  languageTag: LanguageTag;
}

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    // Get the language tag from the request headers (set by middleware)
    const languageTag =
      (ctx.req?.headers["x-preferred-language-tag"] as LanguageTag) ||
      fallbackLanguageTag;

    return {
      ...initialProps,
      languageTag,
    };
  }

  render() {
    const { languageTag } = this.props;

    return (
      <Html lang={languageTag}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
