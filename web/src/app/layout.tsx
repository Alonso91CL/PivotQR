import type { Metadata } from "next";
import { Open_Sans, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PivotQR · Enlaces cortos y códigos QR con métricas",
  description:
    "Pega tu URL, obtén un enlace corto y un código QR dinámico que mide cada escaneo. Ve el impacto de tu campaña en una sola pantalla.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`dark ${outfit.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
          {children}
          <Analytics />
        </body>
    </html>
  );
}