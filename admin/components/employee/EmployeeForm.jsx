'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from "lucide-react"

const employeeSchema = z.object({
    firstName: z.string()
        .min(1, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters'),
    lastName: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters'),
    email: z.string()
        .email('Invalid email address'),
    phone: z.string()
        .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['staff', 'department_head', 'admin', 'municipal_admin'], {
        required_error: 'Please select a role',
    }),
    employeeId: z.string()
        .min(1, 'Employee ID is required'),
    department: z.string()
        .min(1, 'Department is required')
        .optional(),
    address: z.object({
        street: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        pincode: z.string()
            .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
        coordinates: z.object({
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        }).optional(),
    }),
    notificationPreferences: z.object({
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(true),
        reportUpdates: z.boolean().default(true),
        departmentAnnouncements: z.boolean().default(true),
    }),
})

export function EmployeeForm({ onSubmit, isLoading, initialData }) {
    const [selectedRole, setSelectedRole] = useState(initialData?.role || 'staff')

    const form = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            role: 'staff',
            department: '',
            employeeId: '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                coordinates: {
                    latitude: undefined,
                    longitude: undefined,
                },
            },
            notificationPreferences: {
                email: true,
                sms: false,
                push: true,
                reportUpdates: true,
                departmentAnnouncements: true,
            },
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Personal Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="9876543210"
                                                    maxLength={10}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!initialData && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password*</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Minimum 6 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Work Information</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employee ID*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="EMP001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role*</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    setSelectedRole(value)
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="staff">Staff</SelectItem>
                                                    <SelectItem value="department_head">Department Head</SelectItem>
                                                    <SelectItem value="municipal_admin">Municipal Admin</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {selectedRole === "staff" && "Limited access - can only update own profile"}
                                                {selectedRole === "department_head" && "Access to employees in their department"}
                                                {selectedRole === "municipal_admin" && "Access to employees in assigned pincode areas"}
                                                {selectedRole === "admin" && "Full system access"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {(selectedRole === "staff" || selectedRole === "department_head") && (
                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department*</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PWD">Public Works</SelectItem>
                                                        <SelectItem value="HEALTH">Health</SelectItem>
                                                        <SelectItem value="EDUCATION">Education</SelectItem>
                                                        <SelectItem value="SANITATION">Sanitation</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Address</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="address.street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main Street" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mumbai" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Maharashtra" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address.pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pincode*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="400001"
                                                    maxLength={6}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.coordinates.latitude"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="19.0760"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.coordinates.longitude"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="72.8777"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Preferences */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="notificationPreferences.email"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Email Notifications</FormLabel>
                                                <FormDescription>
                                                    Receive updates via email
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notificationPreferences.sms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>SMS Notifications</FormLabel>
                                                <FormDescription>
                                                    Receive updates via SMS
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notificationPreferences.push"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Push Notifications</FormLabel>
                                                <FormDescription>
                                                    Receive push notifications
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notificationPreferences.reportUpdates"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Report Updates</FormLabel>
                                                <FormDescription>
                                                    Receive updates about reports
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notificationPreferences.departmentAnnouncements"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Department Announcements</FormLabel>
                                                <FormDescription>
                                                    Receive department announcements
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Employee" : "Create Employee"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}