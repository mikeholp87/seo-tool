import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Scout - Free SEO Analyzer for New Websites",
  description: "Analyze your website for SEO issues. Get actionable insights to improve your search rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
