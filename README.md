# Face Detection & Recognition

Small full-stack app (FastAPI + React) for live face recognition and adding faces via upload or live capture.

**Quick summary**: Backend exposes endpoints that power the React frontend in `frontend/`. Face embeddings are generated with DeepFace and stored in a local SQLite DB at `backend/face.db`.

**Repository Structure**
- **Backend**: [backend/main.py](backend/main.py) — FastAPI app; [backend/face_service.py](backend/face_service.py) — DeepFace utilities; [backend/database.py](backend/database.py) — SQLAlchemy models.
- **Frontend**: `frontend/` — React app (Tailwind setup present).

**Features**
- Live camera recognition stream.
- Add face by image upload or live camera capture.
- List and delete registered users.

**Prerequisites**
- Python 3.8+ (Windows)
- Node.js 16+ and npm
- A working camera for live capture

**Backend – Setup & Run**
- (Optional) create and activate a virtual environment:

```
python -m venv venv
venv\Scripts\activate
```

- Install required Python packages (recommended):

```
pip install fastapi uvicorn[standard] deepface opencv-python sqlalchemy numpy python-multipart Pillow
```

- Start the backend (development):

```
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- The app uses a local SQLite DB at `backend/face.db` created automatically.
- DeepFace may require `tensorflow` or other ML backend; if you run into model errors, install `tensorflow` (or `tensorflow-cpu`) per your environment.

**Frontend – Setup & Run**
- From `frontend/` install dependencies and start:

```
cd frontend
npm install
npm start
```

- The React app expects the backend at `http://127.0.0.1:8000` by default (see `frontend/src/components/*`), so run backend first.

**Main API Endpoints**
- `POST /start_camera/` — Start server-side camera capture (used by LiveStream).
- `POST /stop_camera/` — Stop server-side camera capture.
- `GET /video_feed` — Multipart JPEG stream for embedding live video.
- `POST /add_face_upload/` — Form: `name` + `file` to add a face from an uploaded image.
- `POST /add_face_live/` — Form: `name` to capture one frame from the server camera and save embedding.
- `GET /users/` — Returns registered user names.
- `DELETE /delete_user/{name}` — Remove a registered user.

Example: to list users

```
curl http://127.0.0.1:8000/users/
```

**How the system works (high level)**
- Images/frames are converted to embeddings via DeepFace (`Facenet512`).
- Embeddings are stored as JSON in the `faces` table (see [backend/database.py](backend/database.py)).
- Recognition compares cosine similarity against stored embeddings (threshold in [backend/face_service.py](backend/face_service.py)).

**Frontend components (where to look)**
- `frontend/src/components/LiveStream.js` — Start/stop camera and display `GET /video_feed`.
- `frontend/src/components/AddFaceUpload.js` — Upload image + name to `POST /add_face_upload/`.
- `frontend/src/components/AddFaceLive.js` — Trigger `POST /add_face_live/`.
- `frontend/src/components/UserManager.js` — List and delete users via `/users/` and `/delete_user/{name}`.

**Troubleshooting & Tips**
- If camera access fails, verify permissions and that no other app is using the camera.
- DeepFace may download model weights on first run — expect extra time and network usage.
- If recognition is poor, experiment with model/threshold in `backend/face_service.py`.
- To force CPU-only TensorFlow, install `tensorflow-cpu` or set your environment accordingly.

**Next steps / Improvements**
- Add a `requirements.txt` in `backend/` for reproducible installs.
- Add Dockerfiles for containerized runs.
- Add tests for endpoints.

**License & Acknowledgements**
- This project uses DeepFace models and open-source libraries (FastAPI, React, Tailwind). Check each dependency license for redistribution rules.

If you want, I can (1) create `backend/requirements.txt` matching the recommended packages, (2) add a simple Dockerfile, or (3) run the app and verify endpoints locally — tell me which next.
