# FitCheck - AI Virtual Try-On Platform

FitCheck is a modern, AI-powered virtual try-on application that allows users to visualize how different clothing items would look on them. Built with a premium "Apple-style" aesthetic, it combines a sleek React frontend with a robust Node.js backend and Google Gemini AI integration.

## Features

-   **AI Virtual Try-On**: High-fidelity virtual try-on using the **IDM-VTON** model.
-   **Dual-Backend Architecture**: Optimized for performance with a Node.js gateway and a Python inference server.
-   **Image Processing**: Automatic resizing and optimization for ML inference.
-   **Premium UI/UX**: Minimalist, responsive design inspired by Apple's product pages.

## Tech Stack

### Frontend
-   **React**: UI library.
-   **Tailwind CSS**: Styling.
-   **GSAP**: Animations.

### Backend (The Gateway)
-   **Node.js & Express**: Handles API requests and file uploads.
-   **Axios**: Forwards requests to the inference server.

### Inference (The Brain)
-   **Python & Flask**: Dedicated server for AI processing.
-   **Gradio Client**: Interfaces with the **yisol/IDM-VTON** model on Hugging Face.
-   **Pillow**: Image resizing and pre-processing.

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
