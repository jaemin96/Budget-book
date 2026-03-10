import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import styles from "./styles/layout.module.scss";
import { Providers } from "@/app/providers";
import classNames from "classnames";
import { isDemoModeEnabled } from "@/lib/demo/demoMode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Book",
  description: "Manage my transaction and assets",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDemoMode = isDemoModeEnabled();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {isDemoMode ? (
          <div
            style={{
              padding: "8px 12px",
              fontSize: 12,
              textAlign: "center",
              backgroundColor: "#111827",
              color: "#f9fafb",
            }}
          >
            Demo mode: 모든 변경사항은 세션이 유지되는 동안에만 유지됩니다.
          </div>
        ) : null}
        <main className={classNames(styles.layout)}>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
