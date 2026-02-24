import numpy as np
import json
from deepface import DeepFace
from backend.database import SessionLocal, Face

THRESHOLD = 0.4  # Cosine similarity threshold

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def extract_embeddings(image):
    representations = DeepFace.represent(
        img_path=image,
        model_name="Facenet512",
        detector_backend="opencv",
        enforce_detection=False
    )

    embeddings = []

    for rep in representations:
        embeddings.append(np.array(rep["embedding"]))

    return embeddings

def recognize_faces(embeddings):

    results = []

    db = SessionLocal()
    faces = db.query(Face).all()

    for new_emb in embeddings:

        best_match = "Unknown"
        best_score = 0

        for face in faces:
            stored = np.array(json.loads(face.embedding))

            if stored.shape != new_emb.shape:
                continue

            score = cosine_similarity(stored, new_emb)

            if score > best_score:
                best_score = score
                best_match = face.name

        if best_score < (1 - THRESHOLD):
            best_match = "Unknown"

        results.append((best_match, round(float(best_score), 2)))

    db.close()
    return results

def save_face(name, embedding):

    db = SessionLocal()

    existing = db.query(Face).filter(Face.name == name).first()
    if existing:
        db.close()
        return "User already exists"

    face = Face(
        name=name,
        embedding=json.dumps(embedding.tolist())
    )

    db.add(face)
    db.commit()
    db.close()
    return "Saved"