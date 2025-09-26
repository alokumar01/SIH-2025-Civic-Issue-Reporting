'use client'

import { useState } from 'react'
import { EmployeeTable } from './EmployeeTable'
import { EmployeeFilters } from './EmployeeFilters'
import { EmployeePagination } from './EmployeePagination'

export function EmployeeList() {
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    isActive: true,
    search: '',
    page: 1,
    limit: 10
  })

  return (
    <div className="space-y-4">
      <EmployeeFilters 
        filters={filters} 
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters, page: 1 })} 
      />
      <EmployeeTable filters={filters} />
      <EmployeePagination 
        page={filters.page}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  )
}