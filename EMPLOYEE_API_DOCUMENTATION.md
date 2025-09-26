# Employee Management API Documentation

## Overview
This documentation covers the Employee Management API endpoints for the Civic Issue Reporting System. These endpoints handle CRUD operations for employee management including staff, department heads, municipal admins, and system administrators.

## Base URL
```
/api/employees
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## User Roles
- **admin**: Full system access
- **municipal_admin**: Access to employees in assigned pincode areas
- **department_head**: Access to employees in their department
- **staff**: Limited access (can only update own profile)
- **citizen**: No access to employee endpoints

---

## Endpoints

### 1. Create Employee
Creates a new employee (staff, department_head, admin, or municipal_admin).

**Endpoint:** `POST /api/employees`

**Authorization:** Department Head, Admin, Municipal Admin

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "password": "securePassword123",
  "role": "staff",
  "department": "objectId", // Required for staff and department_head roles
  "employeeId": "EMP001",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "notificationPreferences": {
    "email": true,
    "sms": false,
    "push": true,
    "reportUpdates": true,
    "departmentAnnouncements": true
  }
}
```

**Required Fields:**
- `firstName` (string, max 50 chars)
- `lastName` (string, max 50 chars)
- `email` (string, valid email format)
- `phone` (string, 10 digits)
- `password` (string, min 6 chars)
- `role` (enum: 'staff', 'department_head', 'admin', 'municipal_admin')
- `employeeId` (string, unique)
- `address.city` (string)
- `address.state` (string)
- `address.pincode` (string)

**Success Response:**
```json
{
  "success": true,
  "message": "Employee created successfully. Verification email sent.",
  "data": {
    "_id": "objectId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "role": "staff",
    "employeeId": "EMP001",
    "department": {
      "_id": "objectId",
      "name": "Public Works",
      "code": "PWD"
    },
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "coordinates": {
        "latitude": 19.0760,
        "longitude": 72.8777
      }
    },
    "notificationPreferences": {
      "email": true,
      "sms": false,
      "push": true,
      "reportUpdates": true,
      "departmentAnnouncements": true
    },
    "isVerified": false,
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing Fields:*
```json
{
  "success": false,
  "error": {
    "message": "Please provide all required fields",
    "code": "MISSING_FIELDS",
    "details": "First name, last name, email, phone, password, role, and employee ID are required"
  }
}
```

*400 Bad Request - Invalid Role:*
```json
{
  "success": false,
  "error": {
    "message": "Invalid employee role",
    "code": "INVALID_ROLE",
    "details": "Role must be one of: staff, department_head, admin, municipal_admin"
  }
}
```

*400 Bad Request - Email Exists:*
```json
{
  "success": false,
  "error": {
    "message": "Employee with this email already exists",
    "code": "EMAIL_EXISTS",
    "details": "An employee is already registered with this email"
  }
}
```

---

### 2. Get All Employees
Retrieves a paginated list of employees with filtering and search capabilities.

**Endpoint:** `GET /api/employees`

**Authorization:** Admin, Municipal Admin

**Query Parameters:**
```
?page=1                    // Page number (default: 1)
&limit=25                  // Items per page (default: 25)
&role=staff                // Filter by role
&department=objectId       // Filter by department
&isActive=true            // Filter by active status
&isVerified=true          // Filter by verification status
&search=john              // Search in name, email, employeeId
```

**Success Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 25
    },
    "prev": {
      "page": 1,
      "limit": 25
    }
  },
  "data": [
    {
      "_id": "objectId",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "staff",
      "employeeId": "EMP001",
      "department": {
        "_id": "objectId",
        "name": "Public Works",
        "code": "PWD"
      },
      "address": {
        "street": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      },
      "isVerified": true,
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
    // ... more employees
  ]
}
```

**Access Control:**
- **Admin**: Can see all employees
- **Municipal Admin**: Can only see employees in their assigned pincode areas
- **Department Head**: Can only see employees in their department

---

### 3. Get Employee by ID
Retrieves a specific employee by their ID.

**Endpoint:** `GET /api/employees/{id}`

**Authorization:** Admin, Municipal Admin

**Path Parameters:**
- `id` (string): Employee's ObjectId

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "objectId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "role": "staff",
    "employeeId": "EMP001",
    "department": {
      "_id": "objectId",
      "name": "Public Works",
      "code": "PWD",
      "description": "Department responsible for public infrastructure"
    },
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "coordinates": {
        "latitude": 19.0760,
        "longitude": 72.8777
      }
    },
    "notificationPreferences": {
      "email": true,
      "sms": false,
      "push": true,
      "reportUpdates": true,
      "departmentAnnouncements": true
    },
    "isVerified": true,
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:45:00.000Z"
  }
}
```

**Error Responses:**

*404 Not Found:*
```json
{
  "success": false,
  "error": {
    "message": "Employee not found",
    "code": "EMPLOYEE_NOT_FOUND",
    "details": "Employee with this ID does not exist"
  }
}
```

*400 Bad Request - Invalid ID:*
```json
{
  "success": false,
  "error": {
    "message": "Employee not found",
    "code": "INVALID_ID",
    "details": "Invalid employee ID format"
  }
}
```

---

### 4. Update Employee
Updates an existing employee's information.

**Endpoint:** `PUT /api/employees/{id}`

**Authorization:** Admin, Municipal Admin, Department Head, Staff (own profile only)

**Path Parameters:**
- `id` (string): Employee's ObjectId

**Request Body (all fields optional):**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "9876543211",
  "address": {
    "street": "456 Oak Avenue",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "notificationPreferences": {
    "email": true,
    "sms": true,
    "push": true,
    "reportUpdates": false,
    "departmentAnnouncements": true
  },
  "isActive": true,
  "isVerified": true
}
```

**Allowed Update Fields:**
- `firstName`
- `lastName`
- `email`
- `phone`
- `address`
- `notificationPreferences`
- `isActive` (admin/municipal_admin only)
- `isVerified` (admin/municipal_admin only)

**Success Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "_id": "objectId",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "9876543211",
    "role": "staff",
    "employeeId": "EMP001",
    "department": {
      "_id": "objectId",
      "name": "Public Works",
      "code": "PWD"
    },
    "address": {
      "street": "456 Oak Avenue",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001"
    },
    "notificationPreferences": {
      "email": true,
      "sms": true,
      "push": true,
      "reportUpdates": false,
      "departmentAnnouncements": true
    },
    "isVerified": true,
    "isActive": true,
    "updatedAt": "2025-01-15T12:30:00.000Z"
  }
}
```

**Access Control:**
- **Admin/Municipal Admin**: Can update any employee (municipal admin restricted to their pincode areas)
- **Department Head**: Can only update employees in their department
- **Staff**: Can only update their own profile

**Error Responses:**

*403 Forbidden:*
```json
{
  "success": false,
  "error": {
    "message": "Access denied",
    "code": "ACCESS_DENIED",
    "details": "You can only update employees in your department"
  }
}
```

---

### 5. Deactivate Employee
Soft deletes (deactivates) an employee account.

**Endpoint:** `DELETE /api/employees/{id}`

**Authorization:** Admin, Municipal Admin, Department Head

**Path Parameters:**
- `id` (string): Employee's ObjectId

**Success Response:**
```json
{
  "success": true,
  "message": "Employee deactivated successfully",
  "data": {
    "_id": "objectId",
    "isActive": false
  }
}
```

**Access Control:**
- **Admin**: Can deactivate any employee
- **Municipal Admin**: Can only deactivate employees in their assigned pincode areas
- **Department Head**: Can only deactivate employees in their department

**Error Responses:**

*404 Not Found:*
```json
{
  "success": false,
  "error": {
    "message": "Employee not found",
    "code": "EMPLOYEE_NOT_FOUND",
    "details": "Employee with this ID does not exist"
  }
}
```

*403 Forbidden:*
```json
{
  "success": false,
  "error": {
    "message": "Access denied",
    "code": "ACCESS_DENIED",
    "details": "You can only deactivate employees in your department"
  }
}
```

---

## Common Error Responses

### Authentication Errors

*401 Unauthorized - No Token:*
```json
{
  "success": false,
  "error": {
    "message": "Not authorized to access this route",
    "code": "NO_TOKEN",
    "details": "Authentication token is required"
  }
}
```

*401 Unauthorized - Invalid Token:*
```json
{
  "success": false,
  "error": {
    "message": "Not authorized to access this route",
    "code": "INVALID_TOKEN",
    "details": "Authentication token is invalid or expired"
  }
}
```

*401 Unauthorized - Account Deactivated:*
```json
{
  "success": false,
  "error": {
    "message": "Account is deactivated",
    "code": "ACCOUNT_DEACTIVATED",
    "details": "This account has been deactivated"
  }
}
```

### Authorization Errors

*403 Forbidden:*
```json
{
  "success": false,
  "error": {
    "message": "User role staff is not authorized to access this route",
    "code": "INSUFFICIENT_PERMISSIONS",
    "details": "You do not have permission to access this resource"
  }
}
```

### Validation Errors

*400 Bad Request - Validation Error:*
```json
{
  "success": false,
  "error": {
    "message": "Validation Error",
    "code": "VALIDATION_ERROR",
    "details": [
      "First name is required",
      "Email must be a valid email address"
    ]
  }
}
```

*400 Bad Request - Duplicate Entry:*
```json
{
  "success": false,
  "error": {
    "message": "Employee with email 'john.doe@example.com' already exists",
    "code": "DUPLICATE_ENTRY",
    "details": "email must be unique"
  }
}
```

---

## Frontend Integration Examples

### React/JavaScript Examples

#### 1. Create Employee
```javascript
const createEmployee = async (employeeData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(employeeData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Usage
const newEmployee = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  password: "securePassword123",
  role: "staff",
  department: "department_id_here",
  employeeId: "EMP001",
  address: {
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  }
};

createEmployee(newEmployee)
  .then(employee => console.log('Employee created:', employee))
  .catch(error => console.error('Failed to create employee:', error));
```

#### 2. Get All Employees with Pagination
```javascript
const getEmployees = async (page = 1, limit = 25, filters = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await fetch(`/api/employees?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Usage with filters and search
getEmployees(1, 10, { 
  role: 'staff', 
  isActive: 'true', 
  search: 'john' 
})
  .then(response => {
    console.log('Employees:', response.data);
    console.log('Total:', response.total);
    console.log('Pagination:', response.pagination);
  })
  .catch(error => console.error('Failed to fetch employees:', error));
```

#### 3. Update Employee
```javascript
const updateEmployee = async (employeeId, updateData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Usage
updateEmployee('employee_id_here', {
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '9876543211'
})
  .then(employee => console.log('Employee updated:', employee))
  .catch(error => console.error('Failed to update employee:', error));
```

#### 4. Deactivate Employee
```javascript
const deactivateEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error deactivating employee:', error);
    throw error;
  }
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchEmployees = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEmployees(page, 25, filters);
      setEmployees(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await createEmployee(employeeData);
      setEmployees(prev => [newEmployee, ...prev]);
      return newEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateEmployee = async (id, updateData) => {
    try {
      const updatedEmployee = await updateEmployee(id, updateData);
      setEmployees(prev => prev.map(emp => 
        emp._id === id ? updatedEmployee : emp
      ));
      return updatedEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deactivateEmployee = async (id) => {
    try {
      await deactivateEmployee(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    pagination,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deactivateEmployee
  };
};

export default useEmployees;
```

---

## Data Models

### Employee Object Structure
```typescript
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'staff' | 'department_head' | 'admin' | 'municipal_admin';
  employeeId: string;
  department?: {
    _id: string;
    name: string;
    code: string;
    description?: string;
  };
  address: {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reportUpdates: boolean;
    departmentAnnouncements: boolean;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### API Response Structure
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  error?: {
    message: string;
    code: string;
    details: string | string[];
  };
}
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Role-based access control is strictly enforced
3. **Input Validation**: All inputs are validated and sanitized
4. **Password Security**: Passwords are hashed with bcrypt (salt rounds: 12)
5. **Email Verification**: New employees must verify their email addresses
6. **Rate Limiting**: Consider implementing rate limiting for employee creation
7. **Audit Logging**: All employee operations are logged for security audit trails

---

## Best Practices for Frontend Integration

1. **Error Handling**: Always handle both success and error responses
2. **Loading States**: Implement proper loading indicators for better UX
3. **Token Management**: Store JWT tokens securely and handle token expiration
4. **Form Validation**: Implement client-side validation matching server requirements
5. **Pagination**: Implement proper pagination UI for employee lists
6. **Search/Filter**: Provide intuitive search and filtering capabilities
7. **Confirmation Dialogs**: Always confirm destructive actions like deactivation
8. **Real-time Updates**: Consider implementing WebSocket connections for real-time updates