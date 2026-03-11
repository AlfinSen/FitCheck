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

The backend is a RESTful API built with Python and Flask.

### Core Modules
-   **`vton_server.py`**: The unified Python backend. It handles:
    1.  Static file serving (costume images).
    2.  Metadata API (`/api/costumes`).
    3.  ML Inference API (`/api/tryon`).
-   **`costumes.json`**: Costume metadata storage.

### AI Integration (`vton_server.py`)
-   Interacts with **yisol/IDM-VTON** via Gradio.
-   Automatically resizes images for optimal model performance (max 1024px).
-   Processes the try-on and returns the generated image as Base64.

### Data Storage
-   **`data/costumes.json`**: Metadata for available costumes.
-   **`public/costumes/`**: Stores transparent PNG assets for clothing items.
-   **`uploads/`**: Temporary storage for user-uploaded images.

## Data Flow

1.  **User Upload**: User uploads a photo and selects a garment on `TryOnPage`.
2.  **Request**: Frontend sends `POST /api/tryon` directly to the Python server (Port 5001).
3.  **Inference**: 
    -   Python server resizes images.
    -   Calls `IDM-VTON` model to generate the try-on result.
4.  **Response**: Final image is sent back as Base64.
5.  **Display**: Frontend renders the result.
