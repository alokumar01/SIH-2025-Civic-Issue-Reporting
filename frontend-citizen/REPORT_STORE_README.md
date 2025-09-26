# Report Store Documentation

## Overview

The `reportStore` is a Zustand-based state management solution for handling civic issue reports in the CivicConnect application. It provides a centralized store for managing form data, API requests with multipart form data, and report-related operations.

## Features

- ✅ **Multipart Form Data Support**: Handles file uploads (images, videos, voice recordings)
- ✅ **Upload Progress Tracking**: Real-time progress updates during file uploads
- ✅ **Form Validation**: Built-in validation for required fields
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **State Persistence**: Form data persists across page refreshes
- ✅ **TypeScript-ready**: Well-typed store for better development experience
- ✅ **DevTools Support**: Zustand devtools integration for debugging

## Installation

The store is already configured and ready to use. Dependencies included:
- `zustand` - State management
- `axios` - HTTP client for API requests
- `sonner` - Toast notifications

## Usage

### Basic Import

```javascript
import useReportStore from '@/store/reportStore';
```

### Store Structure

```javascript
{
  // State
  reports: [],           // Array of all reports
  currentReport: null,   // Currently selected report
  isLoading: false,      // Loading state for fetch operations
  isSubmitting: false,   // Submitting state for form submissions
  error: null,           // Error messages
  submitSuccess: false,  // Success state after submission
  uploadProgress: 0,     // Upload progress (0-100)
  
  // Form data
  formData: {
    title: "",
    description: "",
    category: "",
    department: "",
    priority: "medium",
    tags: [],
    location: { ... },
    media: { ... }
  }
}
```

## API Methods

### 1. Submit Report

```javascript
const { submitReport, isSubmitting, uploadProgress } = useReportStore();

const handleSubmit = async () => {
  const result = await submitReport();
  
  if (result.success) {
    console.log('Report submitted:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 2. Fetch Reports

```javascript
const { fetchReports, reports, isLoading } = useReportStore();

// Fetch all reports
await fetchReports();

// Fetch with filters
await fetchReports({
  status: 'pending',
  category: 'infrastructure',
  page: 1,
  limit: 10
});
```

### 3. Fetch Single Report

```javascript
const { fetchReportById, currentReport } = useReportStore();

await fetchReportById('report-id-123');
```

### 4. Update Report Status (Admin/Municipal)

```javascript
const { updateReportStatus } = useReportStore();

await updateReportStatus('report-id', 'resolved', 'Issue has been fixed');
```

### 5. Add Comments

```javascript
const { addComment } = useReportStore();

await addComment('report-id', 'This issue is being addressed');
```

## Form Management

### Update Form Fields

```javascript
const { 
  updateFormField, 
  updateLocationField, 
  updateMediaField,
  resetForm 
} = useReportStore();

// Update basic field
updateFormField('title', 'New pothole on Main Street');

// Update location
updateLocationField('address', '123 Main Street');

// Update media (add files)
updateMediaField('images', [file1, file2]);

// Reset entire form
resetForm();
```

### Form Validation

The store includes built-in validation for required fields:
- `title` - Required
- `description` - Required  
- `category` - Required

Validation errors are automatically set in the `error` state.

## Error Handling

The store provides comprehensive error handling:

```javascript
const { error, clearError } = useReportStore();

// Display errors
if (error) {
  console.log('Error:', error);
}

// Clear errors
clearError();
```

Error types handled:
- Network errors (connection issues)
- Server errors (400, 500, etc.)
- Validation errors (missing required fields)
- File upload errors

## Upload Progress

Track file upload progress in real-time:

```javascript
const { uploadProgress } = useReportStore();

// Display progress bar
if (uploadProgress > 0 && uploadProgress < 100) {
  return (
    <div>
      <div>Uploading... {uploadProgress}%</div>
      <progress value={uploadProgress} max="100" />
    </div>
  );
}
```

## Integration with Components

### Complete Form Example

```javascript
import useReportStore from '@/store/reportStore';

function ComplaintForm() {
  const {
    formData,
    setFormData,
    submitReport,
    isSubmitting,
    error,
    uploadProgress
  } = useReportStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitReport();
    
    if (result.success) {
      // Handle success (redirect, show toast, etc.)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ title: e.target.value })}
        placeholder="Report title"
        required
      />
      
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ description: e.target.value })}
        placeholder="Description"
        required
      />
      
      {error && <div className="error">{error}</div>}
      
      {uploadProgress > 0 && (
        <div>Upload Progress: {uploadProgress}%</div>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
```

## State Persistence

Form data is automatically persisted to localStorage and restored when the user returns to the form. This ensures users don't lose their progress if they navigate away or refresh the page.

## Best Practices

1. **Always handle errors**: Check the `error` state and display user-friendly messages
2. **Show loading states**: Use `isLoading` and `isSubmitting` for better UX
3. **Clear errors**: Call `clearError()` before new operations
4. **Reset forms**: Call `resetForm()` after successful submissions
5. **Validate before submit**: The store validates automatically, but you can add custom validation
6. **Handle progress**: Show upload progress for better user experience

## TypeScript Support

The store is TypeScript-ready. You can extend it with proper types:

```typescript
interface ReportFormData {
  title: string;
  description: string;
  category: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  location: LocationData;
  media: MediaData;
}
```

## Debugging

The store includes Zustand DevTools support. Install the Redux DevTools browser extension to inspect state changes and debug issues.

## API Endpoints

The store expects these API endpoints:
- `POST /v1/complaints` - Submit new complaint
- `GET /v1/complaints` - Fetch complaints (with optional query params)
- `GET /v1/complaints/:id` - Fetch single complaint
- `PATCH /v1/complaints/:id/status` - Update complaint status
- `POST /v1/complaints/:id/comments` - Add comment to complaint

## Multipart Form Data Structure

When submitting, the store creates FormData with:
- Basic fields: `title`, `description`, `category`, `department`, `priority`
- JSON strings: `location`, `tags`
- File arrays: `images[]`, `videos[]`, `voiceRecordings[]`