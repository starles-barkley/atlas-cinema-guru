import "@/app/global.css";
import { Metadata } from "next";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Cinema Guru",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#00003c] text-white">
        <SessionProviderWrapper>
          {/* Fixed header at the top */}
          <Header />
          {/* Container below the header, with top padding so content is never behind the header */}
          <div className="pt-16 relative">
            {/* Collapsible sidebar pinned to the left, top offset to avoid covering header */}
            <Sidebar />
            {/* Main content with left margin so it's not behind the sidebar */}
            <main className="ml-16 p-4">
              {children}
            </main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
