import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Taskbar from "@/components/taskbar/Taskbar";
import MotionProvider from "@/components/providers/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Wallpaper from "@/components/Wallpaper";
import TitleBlinker from "@/components/TitleBlinker";
import BootManager from "@/components/BootManager";
import { personSchema } from "@/utils/personSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "tingOS",
    template: "tingOS:%s",
  },
  metadataBase: new URL("https://tingwu.dev"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/favicon-light.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon-dark.png",
        media: "(prefers-color-scheme: light)",
      },
    ],
  },
  description: "Ting Wu's Portfolio Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <MotionProvider>
          <ThemeProvider>
            <BootManager />
            <TitleBlinker />
            <Wallpaper />
            {children}
            <Taskbar />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
