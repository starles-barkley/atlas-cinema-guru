import "@/app/global.css";
import { Metadata } from "next";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Header from "./Header";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Cinema Guru | Atlas School",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#00003c] text-white">
        <SessionProviderWrapper>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
