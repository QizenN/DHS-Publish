from typing import Union, Annotated
from fastapi import FastAPI, File, Form, UploadFile
from pdf2image import convert_from_bytes
from pydantic import BaseModel
from fastapi.responses import(
  FileResponse,
  HTMLResponse,
  JSONResponse,
  ORJSONResponse,
  PlainTextResponse,
  RedirectResponse,
  Response,
  StreamingResponse,
  UJSONResponse
)
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import mysql.connector

app = FastAPI () #to run use fastapi dev api.py (dev mode) or fastapi run (production mode) api.py

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

BASE = '/data/data/com.termux/files/home/DHS-Publish'
UPLOAD_DIR = f"{BASE}/upload-multiple"
COVERS_DIR = f"{BASE}/covers"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

app.mount ("/static", StaticFiles(directory=f"{BASE}/static"), name="static")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR))
app.mount ("/covers", StaticFiles(directory=COVERS_DIR), name="covers")

DB_CONFIG = {
  "host": "localhost",
  "user": "dhspublish",
  "password": "UCqj-!4g)*cDUAX0",
  "database": "DHSPublishDB"
}

def get_db():
  return mysql.connector.connect(**DB_CONFIG)

def init_db():
  conn = get_db()
  cursor = conn.cursor()
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS papers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      pdf VARCHAR(255),
      cover VARCHAR(255)
    )
  """
  )
  conn.commit()
  cursor.close()
  conn.close()

init_db()

@app.get("/", response_class=HTMLResponse)
async def read_root():
  with open(f"{BASE}/home.html", "r") as f:
    return f.read()

@app.get("/upload-multiple", response_class=HTMLResponse)
async def upload_page():
  with open(f"{BASE}/upload-multiple.html" ,"r") as f:
    return f.read()

@app.get('/papers')
async def get_papers():
  conn = get_db()
  cursor = conn.cursor(dictionary=True)
  cursor.execute("SELECT*FROM papers ORDER BY id desc")
  rows = cursor.fetchall()
  cursor.close()
  conn.close()
  return rows

@app.post("/files/")
async def create_file(file:Annotated[bytes, File()]):
  return {"file_size": len(file)}

@app.post("/uploadfile/")
async def upload_file(
  title: str = Form(...),
  author: str = Form(...),
  file: UploadFile = File(...)
):
  contents = await file.read()

  #Save PDF
  pdf_filename = file.filename
  with open(os.path.join(UPLOAD_DIR, pdf_filename), "wb" ) as f:
    f.write(contents)

  cover_filename = pdf_filename.replace(".pdf", ".jpg")
  cover_path = os.path.join(COVERS_DIR, cover_filename)
  images = convert_from_bytes(contents, first_page=1, last_page=1, dpi=120)
  images[0].save(cover_path, "JPEG")

  conn = get_db()
  cursor = conn.cursor()
  cursor.execute(
    "INSERT INTO papers (title, author, pdf, cover) VALUES (%s, %s, %s, %s)",(title, author, pdf_filename, f"covers/{cover_filename}")
    )
  conn.commit()
  cursor.close()
  conn.close()

  return {"title": title, "author": author, "file": pdf_filename}

if __name__ =="__main__":
  uvicorn.run(app, host="0.0.0.0", port=5004)