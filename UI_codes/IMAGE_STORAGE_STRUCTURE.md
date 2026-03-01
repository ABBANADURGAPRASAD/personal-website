# Image Storage Structure

## Overview
Images uploaded through the dashboard are now stored in the backend filesystem in organized folders, instead of being stored as Base64 in browser localStorage.

## Backend Storage Structure

### Directory Structure
```
Backend_codes/
└── uploads/                    # Main upload directory (configurable in application.yml)
    ├── profile/                # Profile images folder
    │   ├── uuid1.jpg
    │   ├── uuid2.png
    │   └── ...
    ├── gallery/                # Gallery images folder
    │   ├── uuid1.jpg
    │   ├── uuid2.png
    │   └── ...
    └── achievements/           # Achievement background images folder
        ├── uuid1.jpg
        ├── uuid2.png
        └── ...
```

### Configuration
- **Location**: `Backend_codes/src/main/resources/application.yml`
- **Setting**: `app.upload.dir: "uploads"` (relative to project root)
- **Default**: Creates `uploads/` folder in the backend project root

### Backend Components

#### 1. ImageStorageService (`Backend_codes/src/main/java/com/example/demo/service/ImageStorageService.java`)
- Handles file storage operations
- Creates directory structure automatically
- Generates unique filenames using UUID
- Validates file types (images only)
- Methods:
  - `storeProfileImage(MultipartFile)` → Returns `/api/images/profile/{filename}`
  - `storeGalleryImage(MultipartFile)` → Returns `/api/images/gallery/{filename}`
  - `storeAchievementImage(MultipartFile)` → Returns `/api/images/achievements/{filename}`
  - `deleteImage(String path)` → Deletes image from filesystem

#### 2. ImageUploadController (`Backend_codes/src/main/java/com/example/demo/controller/ImageUploadController.java`)
- REST endpoints for image uploads
- Endpoints:
  - `POST /api/images/profile` - Upload profile image
  - `POST /api/images/gallery` - Upload gallery image
  - `POST /api/images/achievement` - Upload achievement background image
  - `DELETE /api/images?path={imagePath}` - Delete image

#### 3. WebConfig (`Backend_codes/src/main/java/com/example/demo/config/WebConfig.java`)
- Configures Spring Boot to serve static files
- Maps `/api/images/**` to the `uploads/` directory
- Enables image access via HTTP URLs

## Frontend Storage

### Data Storage
- **Location**: Browser `localStorage` (key: `home_page_data`)
- **Format**: JSON with image URLs (not Base64)
- **Structure**:
```typescript
{
  profileImages: string[],        // Array of image URLs
  galleryItems: GalleryItem[],     // Objects with imageUrl property
  achievements: Achievement[]      // Objects with backgroundImage property
}
```

### Image URLs Format
- **Uploaded Images**: `http://localhost:8080/api/images/{folder}/{filename}`
  - Example: `http://localhost:8080/api/images/profile/abc123.jpg`
- **External URLs**: Stored as-is (e.g., `https://example.com/image.jpg`)

### Frontend Components

#### 1. ImageUploadService (`src/app/services/image-upload.service.ts`)
- Angular service for uploading images to backend
- Methods:
  - `uploadProfileImage(file: File): Observable<string>`
  - `uploadGalleryImage(file: File): Observable<string>`
  - `uploadAchievementImage(file: File): Observable<string>`
  - `deleteImage(imagePath: string): Observable<boolean>`

#### 2. HomeComponent (`src/app/pages/home/home.component.ts`)
- Updated to use `ImageUploadService` instead of FileReader/Base64
- Supports both file uploads and external URLs
- Shows loading indicators during uploads
- Stores image URLs (not Base64) in localStorage

## Image Upload Flow

### Profile Images
1. User selects file or enters URL in dashboard
2. If file: Uploads to `POST /api/images/profile`
3. Backend saves to `uploads/profile/{uuid}.{ext}`
4. Returns URL: `/api/images/profile/{uuid}.{ext}`
5. Frontend stores full URL in `profileImages` array
6. Saved to localStorage

### Gallery Images
1. User selects file or enters URL when adding/editing gallery item
2. If file: Uploads to `POST /api/images/gallery`
3. Backend saves to `uploads/gallery/{uuid}.{ext}`
4. Returns URL: `/api/images/gallery/{uuid}.{ext}`
5. Frontend stores in `galleryItems[].imageUrl`
6. Saved to localStorage

### Achievement Background Images
1. User selects file or enters URL when editing achievement
2. If file: Uploads to `POST /api/images/achievement`
3. Backend saves to `uploads/achievements/{uuid}.{ext}`
4. Returns URL: `/api/images/achievements/{uuid}.{ext}`
5. Frontend stores in `achievements[].backgroundImage`
6. Saved to localStorage

## Accessing Images

### Via HTTP
- Images are served via: `http://localhost:8080/api/images/{folder}/{filename}`
- Example: `http://localhost:8080/api/images/profile/abc123.jpg`

### In Angular Templates
- Images are displayed using the stored URLs directly:
```html
<img [src]="imageUrl" alt="Description" />
```

## Benefits

1. **File System Storage**: Images stored as actual files, not Base64 strings
2. **Organized Structure**: Separate folders for different image types
3. **Unique Filenames**: UUID prevents filename conflicts
4. **Scalable**: No localStorage size limitations
5. **Performance**: Direct file access, no Base64 encoding overhead
6. **Flexibility**: Supports both uploaded files and external URLs

## Migration Notes

- Existing Base64 images in localStorage will continue to work
- New uploads will use the file system storage
- To migrate existing Base64 images, users need to re-upload them through the dashboard

## Production Considerations

1. **File Size Limits**: Consider adding file size validation
2. **Image Optimization**: Add image compression/resizing before storage
3. **Storage Location**: Consider using cloud storage (AWS S3, etc.) for production
4. **Backup**: Implement backup strategy for uploaded images
5. **Security**: Add authentication/authorization for upload endpoints
6. **CDN**: Use CDN for serving images in production

