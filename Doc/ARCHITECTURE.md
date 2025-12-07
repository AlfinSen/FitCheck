# System Architecture

## Overview

FitCheck follows a standard Client-Server architecture. The frontend handles user interaction and display, while the backend manages image processing, AI integration, and file storage.

## Frontend Architecture (`/frontend`)

The frontend is a Single Page Application (SPA) built with React and Vite.

### Key Components
-   **`App.jsx`**: Main entry point, handles routing (`/` for Home, `/tryon` for Studio).
-   **`Navbar.jsx`**: Global navigation with responsive mobile menu and glassmorphic design.
-   **`Hero.jsx`**: Landing page hero section featuring a GSAP-animated carousel and bento-grid layout.
-   **`TryOnPage.jsx`**: The core feature page. Handles:
    -   Image drag-and-drop upload (`react-dropzone`).
    -   Costume selection state.
    -   API communication with the backend.
    -   Result display.

### Styling
-   **Tailwind CSS**: Used for layout, spacing, and typography.
-   **Custom Utilities**: `cn` helper for class merging (`clsx` + `tailwind-merge`).
-   **Design System**: Defined in `index.css` (Inter font, custom animations, Apple-like color palette).

## Backend Architecture (`/backend`)

The backend is a RESTful API built with Express.js.

### Core Modules
-   **`server.js`**: Application entry point.
-   **`app.js`**: Express app configuration (CORS, Middleware, Static files).
-   **`routes/tryon.js`**: Defines the `/api/tryon` endpoint.
-   **`controllers/tryonController.js`**: Contains the business logic:
    1.  Receives user image and costume ID.
    2.  Calls `nanoApiClient` to analyze the user image.
    3.  Calculates optimal placement coordinates.
    4.  Uses `sharp` to composite the costume onto the user image.
    5.  Returns the processed image as Base64.

### AI Integration (`utils/nanoApiClient.js`)
-   Interacts with **Google Gemini 2.0 Flash**.
-   Sends the user's image to the model with a prompt to detect the "torso" area (top, left, width, height).
-   This coordinate data is used to scale and position the virtual clothing accurately.

### Data Storage
-   **`data/costumes.json`**: Metadata for available costumes.
-   **`public/costumes/`**: Stores transparent PNG assets for clothing items.
-   **`uploads/`**: Temporary storage for user-uploaded images.

## Data Flow

1.  **User Upload**: User uploads a photo on `TryOnPage`.
2.  **Request**: Frontend sends `POST /api/tryon` with the image and selected costume ID.
3.  **AI Analysis**: Backend sends the image to Gemini API to find the torso.
4.  **Processing**:
    -   Backend calculates the scale and position for the costume based on Gemini's response.
    -   `sharp` resizes the costume PNG and overlays it on the user's photo.
5.  **Response**: Backend returns the final image.
6.  **Display**: Frontend renders the returned Base64 image.
