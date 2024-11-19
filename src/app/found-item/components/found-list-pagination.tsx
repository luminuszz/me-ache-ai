"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface FoundItemPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function FoundItemPagination({ totalPages, currentPage }: FoundItemPaginationProps) {
  const parsedPage = Number(currentPage);

  const pageNumbers = Array.from({ length: totalPages })
    .map((_, index) => index)
    .filter((index) => index > 0);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`/found-item/list?page=${currentPage - 1}`} />
        </PaginationItem>
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink isActive={page === parsedPage} href={{ pathname: "/found-item/list", query: { page: page } }}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={`/found-item/list?page=${parsedPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
