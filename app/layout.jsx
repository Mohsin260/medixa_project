export const metadata = {
  title: "Uniform || Home One",
  description: "Uniform - Fashion Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content" />
        <link rel="shortcut icon" type="image/png" href="/img/favicon.ico" />
      </head>
      <body data-spy="scroll" data-target="#scroll-menu" data-offset="100">
        {children}
      </body>
    </html>
  );
}
