# Complaint Creation API Documentation

## Endpoint Overview

**Create New Complaint**
- **URL:** `POST /api/v1/complaints`
- **Description:** Submit a new civic issue complaint with multipart form data support
- **Authentication:** Required (Bearer Token)
- **Content-Type:** `multipart/form-data`

---

## Request Structure

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

### Required Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `title` | String | Title of the complaint | Min: 3 chars, Max: 100 chars |
| `state` | String | State where issue exists | Required, Max: 100 chars |
| `district` | String | District name | Required, Max: 100 chars |
| `locality` | String | Local area/neighborhood | Required, Max: 100 chars |
| `pinCode` | String | 6-digit postal code | Required, Format: `^\d{6}$` |
| `category` | String | Type of complaint | Enum: `["Road", "Sanitation", "Streetlight", "Water Supply", "Medical", "Food Safety", "Other"]` |
| `location` | Object/String | GPS coordinates | JSON: `{"coordinates": [longitude, latitude]}` |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `description` | String | Detailed description | "" (Max: 1000 chars) |
| `address` | String | Full address | "" (Max: 200 chars) |
| `landmark` | String | Nearby landmark | "" (Max: 100 chars) |
| `priority` | String | Issue priority | "Medium" (Options: "Low", "Medium", "High", "Critical") |
| `department` | String | Department ObjectId | null |
| `tags` | Array/String | Issue tags | [] |
| `relatedComplaints` | Array/String | Related complaint IDs | [] |

### File Upload Fields

| Field | Type | Description | Supported Formats |
|-------|------|-------------|------------------|
| `images` | File/File[] | Complaint images | JPG, JPEG, PNG, GIF, WEBP |
| `videos` | File/File[] | Complaint videos | MP4, MOV, AVI, WMV, WEBM, MKV |
| `voiceRecordings` | File/File[] | Audio recordings | MP3, WAV, M4A, OGG |
| `imagesCaptions` | Array/String | Captions for images | Optional array matching images order |
| `videosCaptions` | Array/String | Captions for videos | Optional array matching videos order |

---

## Location Data Formats

The API supports multiple formats for location coordinates:

### Format 1: JSON Object (Recommended)
```javascript
// As JSON string
location: '{"coordinates": [77.5946, 12.9716]}'

// Or as form data
location[coordinates][0]: "77.5946"  // longitude
location[coordinates][1]: "12.9716"  // latitude
```

### Format 2: Separate Fields
```javascript
longitude: "77.5946"
latitude: "12.9716"
```

**Note:** Coordinates must be in decimal degrees format: `[longitude, latitude]`
- Longitude: -180 to 180
- Latitude: -90 to 90

---

## Request Examples

### 1. JavaScript/Axios with FormData

```javascript
import axios from 'axios';

const submitComplaint = async (complaintData, files) => {
  const formData = new FormData();
  
  // Basic fields
  formData.append('title', 'Broken streetlight on Main Road');
  formData.append('description', 'The streetlight has been non-functional for 3 days');
  formData.append('category', 'Streetlight');
  formData.append('state', 'Karnataka');
  formData.append('district', 'Bangalore Urban');
  formData.append('locality', 'Koramangala');
  formData.append('pinCode', '560034');
  formData.append('priority', 'High');
  
  // Location as JSON string
  formData.append('location', JSON.stringify({
    coordinates: [77.5946, 12.9716]
  }));
  
  // Tags as JSON array
  formData.append('tags', JSON.stringify(['streetlight', 'electrical', 'safety']));
  
  // Files
  if (files.images) {
    files.images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  if (files.videos) {
    files.videos.forEach(video => {
      formData.append('videos', video);
    });
  }
  
  try {
    const response = await axios.post('/api/v1/complaints', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${progress}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. React Form with File Upload

```jsx
import { useState } from 'react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    state: '',
    district: '',
    locality: '',
    pinCode: '',
    priority: 'Medium',
    coordinates: [0, 0]
  });
  
  const [files, setFiles] = useState({
    images: [],
    videos: [],
    voiceRecordings: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'coordinates') {
        data.append('location', JSON.stringify({ coordinates: value }));
      } else {
        data.append(key, value);
      }
    });
    
    // Add files
    files.images.forEach(file => data.append('images', file));
    files.videos.forEach(file => data.append('videos', file));
    files.voiceRecordings.forEach(file => data.append('voiceRecordings', file));
    
    // Submit
    try {
      const response = await fetch('/api/v1/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });
      
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Complaint Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <select
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        required
      >
        <option value="Road">Road</option>
        <option value="Sanitation">Sanitation</option>
        <option value="Streetlight">Streetlight</option>
        <option value="Water Supply">Water Supply</option>
        <option value="Medical">Medical</option>
        <option value="Food Safety">Food Safety</option>
        <option value="Other">Other</option>
      </select>
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles({...files, images: Array.from(e.target.files)})}
      />
      
      <button type="submit">Submit Complaint</button>
    </form>
  );
};
```

### 3. cURL Example

```bash
curl -X POST "http://localhost:5050/api/v1/complaints" \
  -H "Authorization: Bearer your-jwt-token" \
  -F "title=Pothole on Highway" \
  -F "description=Large pothole causing traffic issues" \
  -F "category=Road" \
  -F "state=Karnataka" \
  -F "district=Bangalore Urban" \
  -F "locality=Electronic City" \
  -F "pinCode=560100" \
  -F "priority=High" \
  -F 'location={"coordinates":[77.6648,12.8456]}' \
  -F 'tags=["pothole","road","traffic"]' \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "imagesCaptions=[\"Front view\",\"Side view\"]"
```

---

## Response Structure

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6789012ab",
    "user": "64f8a1b2c3d4e5f6789012cd",
    "title": "Broken streetlight on Main Road",
    "description": "The streetlight has been non-functional for 3 days",
    "media": {
      "images": [
        {
          "url": "https://res.cloudinary.com/your-cloud/image/upload/v1694123456/complaints/images/abc123.jpg",
          "caption": "Streetlight during day",
          "uploadedAt": "2025-09-26T10:30:00.000Z",
          "_id": "64f8a1b2c3d4e5f6789012ef"
        }
      ],
      "voiceRecordings": [],
      "videos": []
    },
    "location": {
      "coordinates": [77.5946, 12.9716]
    },
    "state": "Karnataka",
    "district": "Bangalore Urban",
    "locality": "Koramangala",
    "pinCode": "560034",
    "address": "100ft Road, Koramangala",
    "landmark": "Near BDA Complex",
    "category": "Streetlight",
    "department": null,
    "supervisorAssigned": null,
    "priority": "High",
    "status": "Open",
    "tags": ["streetlight", "electrical", "safety"],
    "relatedComplaints": [],
    "supportingComplaint": {
      "viewCount": 0,
      "upvotes": 1,
      "reportedBy": [
        {
          "user": "64f8a1b2c3d4e5f6789012cd",
          "reportedAt": "2025-09-26T10:30:00.000Z",
          "_id": "64f8a1b2c3d4e5f6789012gh"
        }
      ]
    },
    "createdAt": "2025-09-26T10:30:00.000Z",
    "updatedAt": "2025-09-26T10:30:00.000Z",
    "__v": 0
  }
}
```

### Error Response Examples

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Missing required fields: title, state, district, locality, pinCode, category",
  "statusCode": 400
}
```

#### Invalid PIN Code (400 Bad Request)
```json
{
  "success": false,
  "error": "Pin code must be a 6-digit number",
  "statusCode": 400
}
```

#### Invalid Coordinates (400 Bad Request)
```json
{
  "success": false,
  "error": "location.coordinates is required and must be [longitude, latitude]",
  "statusCode": 400
}
```

#### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "error": "Access denied. No token provided.",
  "statusCode": 401
}
```

#### File Upload Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Invalid file format. Only JPG, PNG, GIF, WEBP images are allowed.",
  "statusCode": 400
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error",
  "statusCode": 500
}
```

---

## Data Processing

### File Upload Processing
- **Images:** Compressed to max 1280px width, quality optimized, converted to web formats
- **Videos:** Compressed with quality optimization, max 1280px width
- **Audio:** Converted to AAC codec, 64kbps bitrate
- **Storage:** Files uploaded to Cloudinary with organized folder structure

### Location Processing
- Coordinates validated for valid longitude (-180 to 180) and latitude (-90 to 90)
- Multiple input formats accepted and normalized to `[longitude, latitude]` array
- GeoJSON Point format used internally for MongoDB geospatial queries

### Array Field Processing
- **Tags & Related Complaints:** Support both JSON arrays and comma-separated strings
- Empty values, empty arrays, and null values handled gracefully
- Automatic parsing from various input formats

---

## Integration with Frontend Store

### Using with Zustand Report Store

```javascript
// In your Zustand store action
const submitReport = async () => {
  const formDataToSend = new FormData();
  
  // Basic fields
  formDataToSend.append("title", formData.title);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("category", formData.category);
  formDataToSend.append("state", formData.state);
  formDataToSend.append("district", formData.district);
  formDataToSend.append("locality", formData.locality);
  formDataToSend.append("pinCode", formData.pinCode);
  formDataToSend.append("priority", formData.priority);
  
  // Location as JSON
  formDataToSend.append("location", JSON.stringify({
    coordinates: formData.location.coordinates
  }));
  
  // Optional fields
  if (formData.address) formDataToSend.append("address", formData.address);
  if (formData.landmark) formDataToSend.append("landmark", formData.landmark);
  if (formData.department) formDataToSend.append("department", formData.department);
  
  // Arrays as JSON
  if (formData.tags.length > 0) {
    formDataToSend.append("tags", JSON.stringify(formData.tags));
  }
  
  // Files
  formData.media.images.forEach(image => {
    formDataToSend.append("images", image);
  });
  
  // API call with progress tracking
  const response = await api.post('/v1/complaints', formDataToSend, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      set({ uploadProgress: progress });
    }
  });
  
  return response.data;
};
```

---

## Best Practices

### 1. File Upload Optimization
- Compress images on client-side before upload when possible
- Use appropriate file formats (WEBP for images, MP4 for videos)
- Implement upload progress indicators for better UX
- Handle upload failures gracefully with retry mechanisms

### 2. Form Validation
- Validate required fields on client-side before submission
- Implement real-time validation for PIN codes and coordinates
- Provide clear error messages for validation failures
- Use proper input types and constraints

### 3. Error Handling
```javascript
try {
  const result = await submitComplaint(data);
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    // Handle validation errors
    setFieldErrors(error.response.data.error);
  } else if (error.response?.status === 401) {
    // Handle authentication errors
    redirectToLogin();
  } else if (error.response?.status === 413) {
    // Handle file size errors
    showFileSizeError();
  } else {
    // Handle generic errors
    showGenericError();
  }
}
```

### 4. Performance Considerations
- Implement file size limits (recommended: 5MB for images, 50MB for videos)
- Use chunked upload for large files
- Implement client-side image compression
- Show upload progress for files > 1MB

---

## Rate Limiting

- **Limit:** 10 requests per minute per user
- **File Size:** Max 10MB per file, 50MB total per request
- **Files Count:** Max 10 files per type (images/videos/audio)

---

## Security Notes

- All file uploads are scanned for malware
- File types are strictly validated
- User authentication required for all requests
- Files are stored with generated names (not original filenames)
- Sensitive location data is handled according to privacy policies