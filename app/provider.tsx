"use client";
import { Search } from "@/components/search";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ReactNode, useMemo } from "react";

export function Provider({
  children,
  _searchKey,
}: {
  children: ReactNode;
  _searchKey: string;
}) {
  return (
    <RootProvider
      search={useMemo(
        () => ({
          SearchDialog(props) {
            return <Search {...props} _searchKey={_searchKey} />;
          },
        }),
        [_searchKey],
      )}
    >
      {children}
    </RootProvider>
  );
}
