from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import sys
import os
import signal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        # add your deployed frontend origin here
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "ml_model.py")
ml_process = None


@app.post("/start-model")
def start_model():
    global ml_process

    if ml_process and ml_process.poll() is None:
        return {"status": "Model already running"}

    ml_process = subprocess.Popen(
        [sys.executable, SCRIPT_PATH],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return {"status": "ML model started", "pid": ml_process.pid}


@app.post("/stop-model")
def stop_model():
    global ml_process

    if ml_process and ml_process.poll() is None:
        ml_process.terminate()
        try:
            ml_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            ml_process.kill()
        ml_process = None
        return {"status": "ML model stopped"}

    return {"status": "No model running"}


@app.get("/status")
def status():
    running = ml_process is not None and ml_process.poll() is None
    return {"running": running}