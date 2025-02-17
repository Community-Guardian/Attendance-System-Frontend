import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  className?: string
}

const Pagination = ({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
  className,
}: PaginationProps) => {
  const MAX_VISIBLE_PAGES = 5 // Maximum pages displayed before using ellipsis
  const pages = []

  // Generate pagination numbers
  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }
  }

  return (
    <nav role="navigation" aria-label="pagination" className={cn("flex justify-center mt-4", className)}>
      <ul className="flex items-center gap-1">
        {/* Previous Button */}
        <li>
          <PaginationPrevious onClick={prevPage} disabled={currentPage === 1} />
        </li>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {typeof page === "number" ? (
              <PaginationLink onClick={() => goToPage(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <PaginationNext onClick={nextPage} disabled={currentPage === totalPages} />
        </li>
      </ul>
    </nav>
  )
}

Pagination.displayName = "Pagination"

const PaginationLink = ({
  isActive,
  children,
  onClick,
}: {
  isActive?: boolean
  children: React.ReactNode
  onClick: () => void
}) => (
  <button
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "ghost",
        size: "icon",
      }),
      "w-10 h-10"
    )}
    onClick={onClick}
    disabled={isActive}
  >
    {children}
  </button>
)

const PaginationPrevious = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: disabled ? "ghost" : "outline",
        size: "default",
      }),
      "flex items-center gap-1 px-3"
    )}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </button>
)

const PaginationNext = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: disabled ? "ghost" : "outline",
        size: "default",
      }),
      "flex items-center gap-1 px-3"
    )}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </button>
)

const PaginationEllipsis = () => (
  <span className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export { Pagination }
