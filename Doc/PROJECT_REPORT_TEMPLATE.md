# FitCheck Project Report

## 1. Project Information

- Project Title: FitCheck - AI Virtual Try-On Platform
- Author/Team: [Add name(s)]
- Institution/Course: [Add details]
- Submission Date: [Add date]
- Version: 1.0

## 2. Executive Summary

FitCheck is a web-based AI virtual try-on application that allows users to upload a personal photo and a garment image, then generate a synthesized try-on result. The project uses a React + Vite frontend and a Python Flask backend that connects to the Hugging Face IDM-VTON model through `gradio_client`.

The system focuses on user experience (clean modern UI, drag-and-drop workflows, local history of generated results) while delegating garment fitting quality to a specialized external model. The backend is lightweight and primarily responsible for input handling, preprocessing, model invocation, and output encoding.

## 3. Problem Statement

Online fashion shopping suffers from uncertainty around appearance and fit. Static product photos do not represent how garments look on a specific user. FitCheck aims to reduce this uncertainty by providing a quick virtual try-on workflow using image synthesis.

## 4. Objectives

- Build an end-to-end virtual try-on system with a simple, responsive UI.
- Enable user image upload and garment image upload/selection.
- Run AI try-on inference and return visual output in near real-time.
- Provide basic collection management and recent history for better usability.

## 5. Scope

### In Scope

- Web frontend with navigation, hero/landing experience, try-on studio, collections, and recent outputs.
- Python API server exposing health and try-on endpoints.
- Integration with external IDM-VTON model hosted via Hugging Face/Gradio.
- Local persistence in browser storage for custom garments and recent try-ons.

### Out of Scope

- User authentication/authorization.
- Persistent cloud database.
- Production deployment hardening (rate limits, auth tokens per user, observability stack).
- Deterministic automated testing pipeline (not present in the current repository).

## 6. Current System Architecture (As Implemented)

### 6.1 High-Level Architecture

1. Frontend (React, Vite) runs on port 5174.
2. Backend (Flask) runs on port 5001.
3. Frontend sends multipart form data (`userImage`, `garmentImage`) to backend.
4. Backend preprocesses images (resize/pad to 768x1024), calls IDM-VTON via `gradio_client`, then returns Base64 output.
5. Frontend renders generated result and stores metadata in browser localStorage.

### 6.2 Key Backend Behaviors

- Health endpoint: `GET /api/health`
- Inference endpoint: `POST /api/tryon`
- CORS enabled for `/api/*`
- Startup model initialization with retries
- Inference retries for transient failures (timeouts/handshake)
- Temporary file cleanup in `finally` block

### 6.3 Key Frontend Behaviors

- Multi-page SPA with routes: `/`, `/tryon`, `/collections`, `/recent`
- Drag-and-drop uploads via `react-dropzone`
- Collections page supports custom garment uploads and save/remove actions
- Try-on results can be downloaded and stored in local history
- Backend health check drives UI readiness indicator

## 7. Technology Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS 4
- GSAP
- React Router DOM
- React Dropzone
- Lucide React icons

### Backend

- Python 3
- Flask
- Flask-CORS
- Pillow
- gradio_client
- python-dotenv
- huggingface_hub

## 8. Project Structure Summary

- `frontend/`: React client application
- `backend/`: Flask inference API and runtime directories
- `backend/public/costumes/`: static garment images
- `backend/temp_vton/`: temporary inference files
- `backend/uploads/`: upload-related temporary files
- `Doc/`: documentation and report materials
- `start.sh`: script to launch backend + frontend together

## 9. API Summary

### `GET /api/health`

- Purpose: quick readiness check for backend/model status
- Typical response:

```json
{
	"status": "ready",
	"model": "yisol/IDM-VTON"
}
```

### `POST /api/tryon`

- Content type: `multipart/form-data`
- Required fields:
	- `userImage` (file)
	- `garmentImage` (file)
- Successful response includes:

```json
{
	"resultImage": "<base64_data>"
}
```

## 10. Implementation Status Assessment

### Completed

- End-to-end try-on flow from upload to generated output
- UI pages for landing, try-on studio, collections, and recent outputs
- Local persistence for custom garments and recent generations
- Basic backend resiliency through retries and cleanup

### Partially Completed

- Documentation alignment (some docs describe an older Node/Gemini architecture)
- Validation and input constraints (basic checks exist, but no strict size/type policy)

### Not Implemented Yet

- Automated tests (unit/integration/e2e)
- Authentication and multi-user data handling
- Production-ready security and monitoring controls

## 11. Observed Gaps and Risks

1. Documentation mismatch: some markdown files still refer to Node.js + Gemini + Sharp workflow, while the codebase currently uses Flask + IDM-VTON.
2. Dependency inconsistency: backend `requirements.txt` includes `axios` (JavaScript package, not a Python dependency).
3. Hardcoded frontend API base (`http://localhost:5001`) limits environment flexibility.
4. No automated tests make regression detection difficult.
5. LocalStorage-only persistence means data is browser-specific and not shareable across devices.

## 12. Performance and Reliability Notes

- Server startup preloads model client with retry logic.
- Inference call retries up to three times for common transient errors.
- Image preprocessing standardizes dimensions, which helps model consistency.
- Temporary files are removed after requests to prevent storage growth.

## 13. Security and Privacy Considerations

- CORS currently allows all origins for API routes.
- Uploaded user photos are temporarily written to disk before cleanup.
- No auth or per-user access boundaries are enforced.
- Environment variables are used for model/token settings.

## 14. Future Improvements

1. Align all documentation with the current Flask + IDM-VTON implementation.
2. Add comprehensive automated tests (API tests + UI flow tests).
3. Introduce configurable API base URL through environment variables.
4. Add request size/type limits and better client/server validation.
5. Add optional database/object storage for persistent history.
6. Add observability (structured logs, latency metrics, error dashboards).

## 15. Conclusion

FitCheck successfully demonstrates a practical AI virtual try-on workflow with a polished frontend experience and a functional inference backend. The core use case is implemented and usable. The primary next step is project hardening: documentation consistency, testing, configuration management, and production-grade reliability/security improvements.

## 16. Submission Checklist

- [ ] Fill author, institution, and submission metadata.
- [ ] Add screenshots for Home, Try-On Studio, Collections, and Recent pages.
- [ ] Add latency observations from local testing (optional table).
- [ ] Update references/citations if required by your course format.
- [ ] Confirm final architecture diagram reflects Flask + IDM-VTON (not Node + Gemini).

## 17. Optional Appendices

### Appendix A: Local Run Steps

```bash
./start.sh
```

Expected local endpoints:

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:5001`

### Appendix B: Example Report Figures

- Figure 1: System architecture diagram
- Figure 2: Try-on request/response flow
- Figure 3: Before/garment/result comparison
- Figure 4: Collections and recent history UX
