'use client'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import debounce from 'lodash/debounce'

export function EmployeeFilters({ filters, onFilterChange }) {
  const handleSearch = debounce((value) => {
    onFilterChange({ search: value })
  }, 300)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-2">
        <Label>Search</Label>
        <Input
          placeholder="Search by name, email, ID..."
          defaultValue={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <Label>Role</Label>
        <Select
          value={filters.role}
          onValueChange={(value) => onFilterChange({ role: value })}
        >
          <option value="">All Roles</option>
          <option value="staff">Staff</option>
          <option value="department_head">Department Head</option>
          <option value="admin">Admin</option>
          <option value="municipal_admin">Municipal Admin</option>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Department</Label>
        <Select
          value={filters.department}
          onValueChange={(value) => onFilterChange({ department: value })}
        >
          <option value="">All Departments</option>
          {/* Add departments dynamically */}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Status</Label>
        <Select
          value={filters.isActive.toString()}
          onValueChange={(value) => onFilterChange({ isActive: value === 'true' })}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      </div>
    </div>
  )
}