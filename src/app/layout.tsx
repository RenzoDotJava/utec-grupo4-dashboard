import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Containers Dashboard",
  description: "Dashboard para visualizar la información de los contenedores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  );
}
