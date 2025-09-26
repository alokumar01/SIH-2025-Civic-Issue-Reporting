'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmployeeForm } from './EmployeeForm'
import { employeeService } from '@/lib/services/employeeService'
import { toast } from 'sonner'

export function CreateEmployeeDialog({ open, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const result = await employeeService.createEmployee(data)
      
      toast({
        title: "Success",
        description: "Employee created successfully",
        variant: "success",
      })
      
      onSuccess?.(result)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create employee:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to your organization. Fill in all required information below.
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}