import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Healthy Mentor",
  description:
    "Seu mentor pessoal de dieta, treino e evolução física integrado ao Telegram.",
  applicationName: "My Healthy Mentor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "My Healthy Mentor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#101419",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-surface text-on-surface antialiased min-h-dvh selection:bg-primary-container selection:text-on-primary-container`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
