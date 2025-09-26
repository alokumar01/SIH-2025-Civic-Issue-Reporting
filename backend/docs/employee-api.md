# Employee API Documentation

## Base URL
```
/v1/employees
```

## Authentication
All endpoints require authentication using JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Employee
Create a new employee (staff/department head/admin/municipal admin)

**Endpoint:** `POST /v1/employees`  
**Access:** Admin, Department Head  

**Request Body:**
```javascript
{
    "firstName": "string",         // Required
    "lastName": "string",         // Required
    "email": "string",           // Required, must be unique
    "phone": "string",           // Required, 10 digits
    "password": "string",        // Required, min 6 characters
    "role": "string",           // Required: "staff", "department_head", "admin", "municipal_admin"
    "department": "string",     // Required for staff and department_head (MongoDB ObjectId)
    "employeeId": "string",    // Required, must be unique
    "serviceArea": ["string"], // Optional, array of 6-digit pincodes (for staff only)
    "address": {
        "street": "string",    // Optional
        "city": "string",     // Required
        "state": "string",    // Required
        "pincode": "string",  // Required, 6 digits
        "coordinates": {      // Optional
            "type": "Point",
            "coordinates": [number, number] // [longitude, latitude]
        }
    },
    "notificationPreferences": {  // Optional
        "email": boolean,         // Default: true
        "sms": boolean,          // Default: false
        "push": boolean,         // Default: true
        "reportUpdates": boolean, // Default: true
        "departmentAnnouncements": boolean // Default: true
    }
}
```

**Success Response (201):**
```javascript
{
    "success": true,
    "message": "Employee created successfully. Verification email sent.",
    "data": {
        "_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "role": "string",
        "employeeId": "string",
        "department": {
            "_id": "string",
            "name": "string",
            "code": "string"
        },
        "serviceArea": ["string"],
        "address": {...},
        "notificationPreferences": {...},
        "isActive": true,
        "isVerified": false,
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

### 2. Get All Employees
Retrieve a paginated list of employees with filters

**Endpoint:** `GET /v1/employees`  
**Access:** Admin, Municipal Admin  

**Query Parameters:**
```javascript
{
    page: number,          // Optional, default: 1
    limit: number,         // Optional, default: 25
    role: string,          // Optional: filter by role
    department: string,    // Optional: filter by department ID
    isActive: boolean,     // Optional: filter by active status
    isVerified: boolean,  // Optional: filter by verification status
    search: string        // Optional: search in name, email, employeeId
}
```

**Success Response (200):**
```javascript
{
    "success": true,
    "count": number,      // Number of employees in current page
    "total": number,      // Total number of employees matching filters
    "pagination": {
        "next": {
            "page": number,
            "limit": number
        },
        "prev": {
            "page": number,
            "limit": number
        }
    },
    "data": [{
        "_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "role": "string",
        "employeeId": "string",
        "department": {
            "_id": "string",
            "name": "string",
            "code": "string"
        },
        "serviceArea": ["string"],
        "address": {...},
        "isActive": boolean,
        "isVerified": boolean,
        "createdAt": "date",
        "updatedAt": "date"
    }]
}
```

### 3. Get Employee by ID
Get detailed information about a specific employee

**Endpoint:** `GET /employees/:id`  
**Access:** Admin, Municipal Admin  

**Success Response (200):**
```javascript
{
    "success": true,
    "data": {
        "_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "role": "string",
        "employeeId": "string",
        "department": {
            "_id": "string",
            "name": "string",
            "code": "string",
            "description": "string"
        },
        "serviceArea": ["string"],
        "address": {...},
        "notificationPreferences": {...},
        "isActive": boolean,
        "isVerified": boolean,
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

### 4. Update Employee
Update an employee's information

**Endpoint:** `PUT /employees/:id`  
**Access:** Admin, Department Head, Employee (self)  

**Request Body:**
```javascript
{
    "firstName": "string",      // Optional
    "lastName": "string",       // Optional
    "email": "string",         // Optional
    "phone": "string",         // Optional
    "serviceArea": ["string"], // Optional, array of 6-digit pincodes (for staff only)
    "address": {              // Optional
        "street": "string",
        "city": "string",
        "state": "string",
        "pincode": "string",
        "coordinates": {
            "type": "Point",
            "coordinates": [number, number]
        }
    },
    "notificationPreferences": {  // Optional
        "email": boolean,
        "sms": boolean,
        "push": boolean,
        "reportUpdates": boolean,
        "departmentAnnouncements": boolean
    }
}
```

**Success Response (200):**
```javascript
{
    "success": true,
    "message": "Employee updated successfully",
    "data": {
        // Updated employee object (same structure as GET response)
    }
}
```

### 5. Deactivate Employee
Soft delete an employee (sets isActive to false)

**Endpoint:** `DELETE /employees/:id`  
**Access:** Admin, Department Head  

**Success Response (200):**
```javascript
{
    "success": true,
    "message": "Employee deactivated successfully",
    "data": {
        "_id": "string",
        "isActive": false
    }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```javascript
{
    "success": false,
    "error": {
        "statusCode": 400,
        "message": "string",
        "code": "string",
        "details": "string" || ["string"]
    }
}
```

### 401 Unauthorized
```javascript
{
    "success": false,
    "error": {
        "statusCode": 401,
        "message": "Not authorized to access this route",
        "code": "UNAUTHORIZED",
        "details": "Please login to access this resource"
    }
}
```

### 403 Forbidden
```javascript
{
    "success": false,
    "error": {
        "statusCode": 403,
        "message": "Access denied",
        "code": "ACCESS_DENIED",
        "details": "You do not have permission to perform this action"
    }
}
```

### 404 Not Found
```javascript
{
    "success": false,
    "error": {
        "statusCode": 404,
        "message": "Employee not found",
        "code": "EMPLOYEE_NOT_FOUND",
        "details": "Employee with this ID does not exist"
    }
}
```

## Role-Based Access Control

1. **Admin**
   - Can perform all operations
   - Can access and modify all employees

2. **Municipal Admin**
   - Can view and update employees in their assigned pincodes
   - Cannot create or delete employees

3. **Department Head**
   - Can create and update employees in their department
   - Can deactivate employees in their department
   - Cannot modify employees from other departments

4. **Staff**
   - Can only view and update their own profile
   - Cannot access other employees' information

## Common Error Codes

- `MISSING_FIELDS`: Required fields are missing
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE_ENTRY`: Unique field already exists
- `INVALID_ROLE`: Invalid employee role provided
- `MISSING_DEPARTMENT`: Department not provided for staff/department head
- `DEPARTMENT_NOT_FOUND`: Department does not exist
- `DEPARTMENT_HEAD_EXISTS`: Department already has a head
- `NO_DEPARTMENT`: Department head has no department assigned
- `NO_ADMIN_AREA`: Municipal admin has no admin area assigned
- `INVALID_SERVICE_AREA`: Invalid service area format
- `INVALID_PINCODES`: Invalid pincode format in service area

## Notes for Frontend Integration

1. **File Upload**: Avatar upload is not handled in these endpoints. Use the separate file upload API.

2. **Form Validation**:
   - Email must be valid format
   - Phone must be 10 digits
   - Password minimum 6 characters
   - Pincode must be 6 digits
   - ServiceArea must be array of 6-digit pincodes

3. **Pagination**:
   - Use the pagination object in responses to implement "Next" and "Previous" buttons
   - Keep track of current page and limit in your state management

4. **Search and Filters**:
   - Implement debouncing for search functionality
   - Consider using URL query parameters to maintain filter state
   - All filters can be combined

5. **Error Handling**:
   - Check for specific error codes to show appropriate messages
   - Implement global error handler for common status codes
   - Show validation errors next to respective form fields
