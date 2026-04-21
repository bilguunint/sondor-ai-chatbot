import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { FirebaseProvider } from "@/contexts/FirebaseProvider";
import { ChatStoreProvider } from "@/contexts/ChatStoreProvider";
import AuthGate from "@/components/AuthGate";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sondor AI",
  description: "AI Chat Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-screen overflow-hidden">
        <ThemeProvider>
          <ToastProvider>
            <FirebaseProvider>
              <AuthGate>
                <ChatStoreProvider>{children}</ChatStoreProvider>
              </AuthGate>
            </FirebaseProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
