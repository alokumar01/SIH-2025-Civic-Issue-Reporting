import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["staff", "department_head", "admin", "municipal_admin"], {
    required_error: "Role is required",
  }),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
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
  }).default({
    email: true,
    sms: false,
    push: true,
    reportUpdates: true,
    departmentAnnouncements: true,
  }),
});