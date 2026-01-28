import os
import uuid
import time
import zipfile
import cv2
import io
import numpy as np
from typing import Dict

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from xray_fuzzy import fuzzy_canny, preprocess_image


app = FastAPI(title="Fuzzy X-ray Edge Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGE_CACHE: Dict[str, bytes] = {}


@app.get("/")
def root():
    return {"message": "Fuzzy Xray API"}


@app.get("/image/{image_id}/{edge_type}")
def get_image(image_id: str, edge_type: str):
    if edge_type not in ("canny", "fuzzy"):
        raise HTTPException(status_code=400, detail="Invalid edge type")

    key = f"{image_id}_{edge_type}"

    if key not in IMAGE_CACHE:
        raise HTTPException(status_code=404, detail="Image not found")

    return StreamingResponse(
        io.BytesIO(IMAGE_CACHE[key]),
        media_type="image/png"
    )

@app.post("/edge-detect")
async def process_xray(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())

    # ---- Read upload into memory ----
    file_bytes = await file.read()
    file_np = np.frombuffer(file_bytes, np.uint8)
    img_raw = cv2.imdecode(file_np, cv2.IMREAD_GRAYSCALE)

    if img_raw is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    t0 = time.time()
    img = preprocess_image(img_raw)
    t1 = time.time()

    t2 = time.time()
    canny_edges = cv2.Canny(img, 50, 150)
    t3 = time.time()

    t4 = time.time()
    fuzzy_edges = fuzzy_canny(img)
    t5 = time.time()

    _, canny_buf = cv2.imencode(".png", canny_edges)
    _, fuzzy_buf = cv2.imencode(".png", fuzzy_edges)

    IMAGE_CACHE[f"{file_id}_canny"] = canny_buf.tobytes()
    IMAGE_CACHE[f"{file_id}_fuzzy"] = fuzzy_buf.tobytes()

    return JSONResponse({
        "filename": file.filename,
        "image_id": file_id,
        "images": {
            "canny": f"/image/{file_id}/canny",
            "fuzzy": f"/image/{file_id}/fuzzy"
        },
        "timing_sec": {
            "preprocess": round(t1 - t0, 4),
            "canny": round(t3 - t2, 4),
            "fuzzy": round(t5 - t4, 4),
            "total": round(t5 - t0, 4)
        }
    })


@app.post("/batch-edge-detect")
async def batch_edge_detect(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".zip"):
        return JSONResponse({"error": "Only ZIP files supported"}, status_code=400)

    batch_id = str(uuid.uuid4())
    results = []

    zip_bytes = await file.read()

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zip_ref:
        for fname in zip_ref.namelist():
            if not fname.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            with zip_ref.open(fname) as image_file:
                image_bytes = image_file.read()

            img_np = np.frombuffer(image_bytes, np.uint8)
            img_raw = cv2.imdecode(img_np, cv2.IMREAD_GRAYSCALE)

            if img_raw is None:
                continue

            t0 = time.time()
            img = preprocess_image(img_raw)
            t1 = time.time()

            t2 = time.time()
            canny_edges = cv2.Canny(img, 50, 150)
            t3 = time.time()
            
            t4 = time.time()
            fuzzy_edges = fuzzy_canny(img)
            t5 = time.time()

            out_id = str(uuid.uuid4())

            _, canny_buf = cv2.imencode(".png", canny_edges)
            _, fuzzy_buf = cv2.imencode(".png", fuzzy_edges)

            IMAGE_CACHE[f"{out_id}_canny"] = canny_buf.tobytes()
            IMAGE_CACHE[f"{out_id}_fuzzy"] = fuzzy_buf.tobytes()

            results.append({
                "filename": fname,
                "timing_sec": {
                    "preprocess": round(t1 - t0, 4),
                    "canny": round(t3 - t2, 4),
                    "fuzzy": round(t5 - t4, 4),
                    "total": round(t5 - t0, 4)
                },
                "image_id": out_id,
                "images": {
                    "canny": f"/image/{out_id}/canny",
                    "fuzzy": f"/image/{out_id}/fuzzy"
                }
            })

    return JSONResponse({
        "batch_id": batch_id,
        "results": results
    })
