import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLC Data Reader",
  description: "Application for reading data from Siemens S7-1200 PLC",
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
