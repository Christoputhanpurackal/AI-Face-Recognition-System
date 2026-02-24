from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import shutil
import os

from backend.face_service import (
    extract_embeddings,
    recognize_faces,
    save_face
)
from backend.database import SessionLocal, Face

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

camera = None
camera_running = False

# ===============================
# START CAMERA
# ===============================

@app.post("/start_camera/")
def start_camera():
    global camera, camera_running

    if camera_running:
        return {"message": "Already running"}

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        return {"error": "Cannot open camera"}

    camera_running = True
    return {"message": "Camera started"}

# ===============================
# STOP CAMERA
# ===============================

@app.post("/stop_camera/")
def stop_camera():
    global camera, camera_running

    if camera:
        camera.release()
        camera = None

    camera_running = False
    return {"message": "Camera stopped"}

# ===============================
# VIDEO STREAM
# ===============================

def generate_frames():
    global camera, camera_running

    while camera_running and camera:
        success, frame = camera.read()
        if not success:
            break

        frame = cv2.resize(frame, (640, 480))

        embeddings = extract_embeddings(frame)
        results = recognize_faces(embeddings)

        for i, (name, score) in enumerate(results):

            cv2.rectangle(frame, (20, 20 + i*60), (400, 70 + i*60), (0,0,0), -1)

            cv2.putText(
                frame,
                f"{name} ({score})",
                (30, 60 + i*60),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0),
                2
            )

        ret, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            frame_bytes +
            b"\r\n"
        )

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# ===============================
# ADD FACE UPLOAD
# ===============================

@app.post("/add_face_upload/")
async def add_face_upload(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    temp_path = "temp.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    embeddings = extract_embeddings(temp_path)

    if not embeddings:
        return {"error": "No face detected"}

    result = save_face(name, embeddings[0])
    os.remove(temp_path)

    return {"message": result}

# ===============================
# ADD FACE LIVE
# ===============================

@app.post("/add_face_live/")
def add_face_live(name: str = Form(...)):

    if not name.strip():
        return {"error": "Name is required"}

    # Open camera
    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        return {"error": "Cannot open camera"}

    success, frame = camera.read()
    camera.release()

    if not success:
        return {"error": "Failed to capture frame"}

    embeddings = extract_embeddings(frame)

    if not embeddings:
        return {"error": "No face detected"}

    result = save_face(name, embeddings[0])

    return {"message": result}
# ===============================
# LIST USERS
# ===============================

@app.get("/users/")
def list_users():
    db = SessionLocal()
    users = db.query(Face).all()
    names = [u.name for u in users]
    db.close()
    return {"users": names}

# ===============================
# DELETE USER
# ===============================

@app.delete("/delete_user/{name}")
def delete_user(name: str):
    db = SessionLocal()
    user = db.query(Face).filter(Face.name == name).first()

    if not user:
        db.close()
        return {"error": "User not found"}

    db.delete(user)
    db.commit()
    db.close()
    return {"message": "User deleted"}