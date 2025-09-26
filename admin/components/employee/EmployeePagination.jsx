'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

export function EmployeePagination({ 
  page, 
  onPageChange, 
  totalPages = 1, 
  isLoading = false 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={page === 1 || isLoading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages || isLoading}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}