import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employeeService } from '@/lib/services/employeeService';
import { PlusCircle, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { CreateEmployeeDialog } from '@/components/employee/CreateEmployeeDialog';
import { EmployeeForm } from '@/components/employee/EmployeeForm';
import { debounce } from '@/lib/utils';
import { toast } from 'sonner';

function EmployeeManagement() {
  const router = useRouter();
  const [employees, setEmployees] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = React.useState({
    role: '',
    department: '',
    isActive: true,
  });

  // Fetch employees
  const fetchEmployees = React.useCallback(async () => {
    try {
        console.log("iam here");
      setIsLoading(true);
      const result = await employeeService.getAllEmployees(
        pagination.currentPage,
        10,
        { ...filters, search: searchQuery }
      );
      console.log(result)
      
      setEmployees(result.data);
      setPagination({
        currentPage: result.pagination?.current || 1,
        totalPages: Math.ceil(result.total / 10),
        totalItems: result.total,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, filters, searchQuery]);

  // Initial fetch
  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle employee creation
  const handleAddEmployee = async (data) => {
    try {
      await employeeService.createEmployee(data);
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
      setIsAddDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle employee update
  const handleUpdateEmployee = async (data) => {
    try {
      await employeeService.updateEmployee(selectedEmployee._id, data);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    try {
      await employeeService.deleteEmployee(selectedEmployee._id);
      toast({
        title: "Success",
        description: "Employee deactivated successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle search
  const handleSearch = React.useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, 500),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="w-8xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee account. Fill in all required information.
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm onSubmit={handleAddEmployee} isLoading={isLoading} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>
                    {employee.department?.name || "Not Assigned"}
                  </TableCell>
                  <TableCell className="capitalize">{employee.role}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information. Only fill in the fields you want to change.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              onSubmit={handleUpdateEmployee}
              isLoading={isLoading}
              initialData={selectedEmployee}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the employee account. They will no longer be able to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * 10) + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalItems)} of{" "}
            {pagination.totalItems} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;