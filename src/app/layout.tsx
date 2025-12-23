import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Taskbar from "@/components/taskbar/Taskbar";
import MotionProvider from "@/components/providers/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Wallpaper from "@/components/Wallpaper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tingOS",
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
        <MotionProvider>
          <ThemeProvider>
            <Wallpaper />
            {children}
            <Taskbar />
            <Analytics />
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
