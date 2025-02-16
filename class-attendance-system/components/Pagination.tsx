"use client"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
}

export function Pagination({ currentPage, totalPages, nextPage, prevPage, goToPage }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
    </div>
  )
}
