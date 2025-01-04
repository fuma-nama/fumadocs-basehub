import "./global.css";
import { Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { basehub } from "basehub";
import { Provider } from "./provider";
import { Toolbar } from "basehub/next-toolbar";

const inter = Geist_Mono({
  subsets: ["latin"],
});

export default async function Layout({ children }: { children: ReactNode }) {
  const { documentation } = await basehub().query({
    documentation: {
      _searchKey: true,
    },
  });
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider _searchKey={documentation._searchKey}>{children}</Provider>
        <Toolbar />
      </body>
    </html>
  );
}
