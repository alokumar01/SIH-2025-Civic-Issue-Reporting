'use client'

import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export function EmployeeHeader({ onCreateClick }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
        <p className="text-muted-foreground">
          Manage your organization's employees, roles, and permissions
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
    </div>
  )
}