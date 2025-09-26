'use client'

import { useState } from 'react'
import { EmployeeList } from '@/components/employee/EmployeeList'
import { EmployeeHeader } from '@/components/employee/EmployeeHeader'
import { CreateEmployeeDialog } from '@/components/employee/CreateEmployeeDialog'

export default function EmployeesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <EmployeeHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
      <EmployeeList />
      <CreateEmployeeDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}