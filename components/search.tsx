"use client";
import { useSearch } from "basehub/react-search";
import type { ReactSortedResult } from "fumadocs-core/search";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useMemo } from "react";

export function Search({
  _searchKey,
  ...props
}: SharedProps & { _searchKey: string }) {
  const search = useSearch({
    _searchKey,
    queryBy: ["_title", "richText", "category", "slug"],
  });

  const results = useMemo(() => {
    if (!search.result || search.result.empty) return null;

    return search.result.hits.flatMap((hit) => {
      const items: ReactSortedResult[] = [];
      const url = hit.document.slug ? `/docs/${hit.document.slug}` : "/docs";

      items.push({
        id: hit._key,
        content: (
          <span className="font-medium">
            {hit.highlight?._title ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: hit.highlight._title.snippet as string,
                }}
              />
            ) : (
              hit.document._title
            )}
          </span>
        ),
        type: "page",
        url,
      });

      for (const h of hit.highlights) {
        if (!h.snippet || h.fieldPath === "title") continue;

        items.push({
          id: `${hit._key}-${h.fieldPath}`,
          type: "text",
          content: (
            <span
              dangerouslySetInnerHTML={{
                __html: h.snippet as string,
              }}
            />
          ),
          url,
        });
      }

      return items;
    });
  }, [search.result]);

  return (
    <SearchDialog
      search={search.query}
      onSearchChange={search.onQueryChange}
      isLoading={search.result == null}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={results} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
