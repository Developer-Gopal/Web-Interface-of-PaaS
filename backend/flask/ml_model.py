import cv2
import numpy as np
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, db
import time

# --- Firebase Setup ---
# Ensure your path to serviceKey.json is correct for your local environment
cred = credentials.Certificate(r'D:\app\Project-Energy\backend\flask_server\serviceKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://ecp-database-e772a-default-rtdb.asia-southeast1.firebasedatabase.app/'
})
ref = db.reference('devices')


# --- Helper Function for Mask/Zone Overlap ---
def mask_in_zone(mask_pixels, zone_coords):
    """
    Checks if any part of the person's segmentation mask is within the zone.
    mask_pixels: numpy array of [x, y] coordinates of the mask
    zone_coords: [zx1, zy1, zx2, zy2]
    """
    zx1, zy1, zx2, zy2 = zone_coords
    # Filter mask pixels to see if any fall within zone boundaries
    in_zone = mask_pixels[(mask_pixels[:, 0] >= zx1) & (mask_pixels[:, 0] <= zx2) &
                          (mask_pixels[:, 1] >= zy1) & (mask_pixels[:, 1] <= zy2)]
    return len(in_zone) > 0


# --- Global Variables for Drawing ---
zones = {}
drawing = False
ix, iy = -1, -1
current_x, current_y = -1, -1
setup_complete = False


def draw_zone_callback(event, x, y, flags, param):
    global ix, iy, current_x, current_y, drawing, zones

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y
        current_x, current_y = x, y

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            current_x, current_y = x, y

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False

        # Calculate final coordinates
        zx1, zy1 = min(ix, x), min(iy, y)
        zx2, zy2 = max(ix, x), max(iy, y)

        zone_id = len(zones) + 1
        zone_letter = chr(64 + zone_id)  # Converts 1 to 'A', 2 to 'B', etc.
        zone_name = f"Zone_{zone_letter}"

        # Store in dictionary
        zones[zone_name] = {
            "coords": [zx1, zy1, zx2, zy2],
            "light": f"light_{zone_id}"
        }

        # --- NEW CONSOLE PRINT ---
        # Prints top-left coordinates as requested: "Zone A: 60,75"
        print(f"Zone {zone_letter}: {zx1},{zy1}")

# --- Init Setup ---
TARGET_WIDTH, TARGET_HEIGHT = 1280, 720
PROCESS_EVERY_N_FRAME = 3
STABILITY_THRESHOLD = 3
# SWITCHED TO SEGMENTATION MODEL
model = YOLO('yolov8s-seg.pt')
cap = cv2.VideoCapture(1)

cv2.namedWindow("Setup & Monitor")
cv2.setMouseCallback("Setup & Monitor", draw_zone_callback)

# --- PHASE 1: DYNAMIC SETUP ---
print("--- SETUP MODE ---")
while not setup_complete:
    ret, frame = cap.read()
    if not ret: break
    frame = cv2.resize(frame, (TARGET_WIDTH, TARGET_HEIGHT))
    for name, data in zones.items():
        z = data["coords"]
        cv2.rectangle(frame, (z[0], z[1]), (z[2], z[3]), (255, 255, 0), 2)

    if drawing:
        cv2.rectangle(frame, (ix, iy), (current_x, current_y), (0, 0, 255), 1)

    cv2.imshow("Setup & Monitor", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('s') and zones:
        setup_complete = True
    elif key == ord('c'):
        zones = {}

# --- PHASE 2: MONITORING ---
print(f"--- MONITORING ACTIVE ---")
last_firebase_states = {}  # Initialized dynamically
zone_timers = {name: time.time() for name in zones}
pending_states = {name: "OFF" for name in zones}
frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret: break
    frame_count += 1

    if frame_count % PROCESS_EVERY_N_FRAME == 0:
        display_frame = cv2.resize(frame, (TARGET_WIDTH, TARGET_HEIGHT))

        # Predict using Segmentation
        results = model.predict(display_frame, classes=[0], conf=0.25, imgsz=640, verbose=False)

        current_live_states = {name: "OFF" for name in zones}

        for r in results:
            if r.masks is not None:
                # Get mask coordinates in pixels
                masks = r.masks.xy
                for mask in masks:
                    # Draw the mask outline on the frame for visual confirmation
                    mask = mask.astype(np.int32)
                    cv2.polylines(display_frame, [mask], True, (255, 255, 255), 1)

                    for name, data in zones.items():
                        if mask_in_zone(mask, data["coords"]):
                            current_live_states[name] = "ON"

        # --- Firebase & Stability Logic ---
        now = time.time()
        updates_to_send = {}
        for name, data in zones.items():
            light_key = data["light"]
            instant_state = current_live_states[name]

            if light_key not in last_firebase_states: last_firebase_states[light_key] = "OFF"

            if instant_state != last_firebase_states[light_key]:
                if instant_state != pending_states[name]:
                    pending_states[name] = instant_state
                    zone_timers[name] = now
                elif now - zone_timers[name] >= STABILITY_THRESHOLD:
                    updates_to_send[light_key] = instant_state
                    last_firebase_states[light_key] = instant_state
            else:
                pending_states[name] = instant_state

        if updates_to_send:
            ref.update(updates_to_send)

        # UI Overlay
        for name, data in zones.items():
            z = data["coords"]
            color = (0, 255, 0) if current_live_states[name] == "ON" else (0, 0, 255)
            cv2.rectangle(display_frame, (z[0], z[1]), (z[2], z[3]), color, 2)
            cv2.putText(display_frame, f"{name}: {current_live_states[name]}", (z[0], z[1] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        cv2.imshow("Setup & Monitor", display_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()