# FitCheck - AI Virtual Try-On Platform

FitCheck is a modern, AI-powered virtual try-on application that allows users to visualize how different clothing items would look on them. Built with a premium "Apple-style" aesthetic, it combines a sleek React frontend with a robust Node.js backend and Google Gemini AI integration.

## Features

-   **AI Virtual Try-On**: Upload a photo and instantly see how selected outfits look on you.
-   **Smart Body Detection**: Uses Google Gemini 2.0 Flash to intelligently detect torso coordinates for accurate clothing placement.
-   **Premium UI/UX**: Minimalist, responsive design inspired by Apple's product pages, featuring glassmorphism, smooth GSAP animations, and high-quality imagery.
-   **Dynamic Hero Section**: Auto-playing carousel showcasing the latest fashion trends.
-   **Real-time Processing**: Fast image compositing using Sharp and optimized backend logic.

## Tech Stack

### Frontend
-   **React**: UI library (Vite).
-   **Tailwind CSS**: Utility-first styling.
-   **GSAP**: Advanced animations (ScrollTrigger, Timelines).
-   **Lucide React**: Iconography.
-   **React Router**: Client-side routing.

### Backend
-   **Node.js & Express**: Server runtime and API framework.
-   **Sharp**: High-performance image processing.
-   **Google Gemini API**: AI vision for body analysis.
-   **Multer**: File upload handling.

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm (v9 or higher)
-   Google Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd FitCheck
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd ../backend
    npm install
    ```

4.  **Environment Setup**:
    Create a `.env` file in the `backend` directory:
    ```env
    GEMINI_API_KEY=your_api_key_here
    PORT=5001
    ```

### Running the Application

1.  **Start the Backend**:
    ```bash
    cd backend
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

-   `frontend/`: React application source code.
-   `backend/`: Express server, API routes, and image processing scripts.
-   `Doc/`: Project documentation.
