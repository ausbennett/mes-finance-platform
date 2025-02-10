import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FormProvider } from "@/context/UserFormContext";

const geistSans = localFont({
   src: "./fonts/GeistVF.woff",
   variable: "--font-geist-sans",
   weight: "100 900",
});
const geistMono = localFont({
   src: "./fonts/GeistMonoVF.woff",
   variable: "--font-geist-mono",
   weight: "100 900",
});

export const metadata: Metadata = {
   title: "MES Finance Platform",
   description: "A platform to simplify payment and reimbursement requests",
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
            <FormProvider>{children}</FormProvider>
         </body>
      </html>
   );
}
