import Document, { Html, Head, Main, NextScript } from "next/document";

/**
 * Next.js will automatically inline font CSS at build time
 * @see https://nextjs.org/docs/basic-features/font-optimization
 *
 * The getInitialProps stuff is for styled-components. "seal" styles at build time. prevent FOUC.
 */
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Roboto+Mono&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
