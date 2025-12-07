# API Documentation

Base URL: `http://localhost:5001`

## Endpoints

### 1. Virtual Try-On

Generates a composite image of the user wearing a selected costume.

-   **URL**: `/api/tryon`
-   **Method**: `POST`
-   **Content-Type**: `multipart/form-data`

#### Request Parameters

| Field | Type | Description |
| :--- | :--- | :--- |
| `userImage` | File (Image) | The photo of the user (full body preferred). |
| `costumeId` | String/Number | The ID of the costume to try on (e.g., `1`, `2`). |

#### Response (Success)

```json
{
  "success": true,
  "resultImage": "<base64_encoded_image_string>",
  "debug": {
    "torso": {
      "top": 35,
      "left": 25,
      "width": 50,
      "height": 40
    }
  }
}
```

#### Response (Error)

```json
{
  "error": "Error description"
}
```

### 2. Static Assets

The backend serves static files from the `public` directory.

-   **Costume Images**: `/costumes/c{id}.png`
    -   Example: `http://localhost:5001/costumes/c1.png`
    -   Note: Use `?v=2` query param to bypass cache if images are updated.

## Error Handling

The API returns standard HTTP status codes:
-   `200`: Success
-   `400`: Bad Request (missing file or ID)
-   `500`: Internal Server Error (AI failure or processing error)
