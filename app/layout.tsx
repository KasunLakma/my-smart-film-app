import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Film Production Management",
  description: "The all-in-one platform for modern film production.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col text-zinc-100 antialiased selection:bg-purple-500/30">
        <div 
          className="relative min-h-screen flex flex-col z-0"
          style={{ background: 'radial-gradient(at top, rgba(147, 51, 234, 0.08), transparent 50%), #0a0a0c' }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
