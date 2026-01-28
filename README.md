# X-Ray Edge Detection System

A full-stack web application for medical X-ray image edge detection using classical Canny and a custom fuzzy logic-based edge detection algorithm. This system implements the research methodology described in "Algorithm for Processing X-ray Images Using Fuzzy Logic" (Mannaa, 2024).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![React](https://img.shields.io/badge/react-18.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green)

## Features

### Core Functionality
- **Single & Batch Upload**: Process individual images or multiple images via ZIP files
- **Dual Edge Detection Methods**:
  - Classical Canny Edge Detection
  - Custom Fuzzy Logic-based Edge Detection (98% accuracy in clinical testing)
- **Real-time Processing**: Get results in under 20 seconds
- **Performance Metrics**: Detailed timing for preprocessing, Canny, and fuzzy detection
- **Download Results**: Export processed edge images
- **Interactive UI**: Compare Canny vs Fuzzy results side-by-side

### Technical Features
- Adaptive Gaussian filtering for noise reduction
- Fuzzy membership rules for edge enhancement
- Watershed segmentation support
- In-memory caching for fast retrieval
- RESTful API architecture

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **JSZip** for batch file handling
- **Lucide React** for icons

### Backend
- **FastAPI** - High-performance async API framework
- **OpenCV** - Computer vision processing
- **NumPy** - Numerical computations
- **scikit-fuzzy** - Fuzzy logic implementation
- **scikit-image** - Advanced image processing
- **Pandas** - Data manipulation

## 📂 Project Structure

```
EDGE_DETECTION/
├── api/                          # Backend (FastAPI)
│   ├── xray_api.py               # API routes & image processing
│   └── xray_fuzzy.py             # Fuzzy edge detection implementation
│
├── app/                          # Frontend (React + Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api_communication/
│   │   │   └── xrayApi.js        # API client
│   │   ├── components/
│   │   │   ├── common/           # Shared components (Loader, etc.)
│   │   │   ├── layout/           # Navbar & layout
│   │   │   ├── upload/           # Upload UI components
│   │   │   └── results/          # Results viewer & image display
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main upload page
│   │   │   └── Results.jsx       # Results display page
│   │   ├── utils/                # Utility functions
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── requirements.txt              # Backend Python dependencies
├── README.md
└── .gitignore
```

## Algorithm Overview

### Edge Detection Pipeline

The system implements a hybrid approach combining classical and fuzzy logic methods:

#### 1. Preprocessing
- Adaptive Gaussian filtering
- Noise suppression without over-smoothing

#### 2. Canny Edge Detection
- Standard OpenCV implementation
- Fixed thresholds: T1=50, T2=150
- Fast baseline for comparison

#### 3. Fuzzy Logic Edge Detection

**Key Components:**

**A. Fuzzy Membership Rules**
- Analyzes 8-neighborhood around each pixel
- Assigns membership degrees based on intensity relationships
- Implements 12 fuzzy rules for edge identification

**B. Automatic Threshold Detection**
- Uses fuzzy membership functions to auto-detect thresholds
- Low, Medium, High triangular membership functions
- Calculates T1 and T2 based on image statistics

**C. Edge Enhancement**
- Merges fuzzy edge map with original image (70%/30% blend)
- Applies morphological closing for edge continuity

#### 4. Post-processing
- Morphological operations to close gaps
- Optional watershed segmentation for region analysis


## API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Fuzzy Xray API"
}
```

#### 2. Single Image Processing
```http
POST /edge-detect
Content-Type: multipart/form-data
```

**Request:**
- `file`: X-ray image (PNG, JPG, JPEG)

**Response:**
```json
{
  "filename": "xray_knee.png",
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "images": {
    "canny": "/image/550e8400-e29b-41d4-a716-446655440000/canny",
    "fuzzy": "/image/550e8400-e29b-41d4-a716-446655440000/fuzzy"
  },
  "timing_sec": {
    "preprocess": 0.0234,
    "canny": 0.0156,
    "fuzzy": 0.1245,
    "total": 0.1635
  }
}
```

#### 3. Batch Processing
```http
POST /batch-edge-detect
Content-Type: multipart/form-data
```

**Request:**
- `file`: ZIP file containing X-ray images

**Response:**
```json
{
  "batch_id": "650e8400-e29b-41d4-a716-446655440000",
  "results": [
    {
      "filename": "image1.png",
      "image_id": "abc-123",
      "images": {
        "canny": "/image/abc-123/canny",
        "fuzzy": "/image/abc-123/fuzzy"
      },
      "timing_sec": { "preprocess": 0.02, "canny": 0.01, "fuzzy": 0.12, "total": 0.15 }
    },
    // ... more results
  ]
}
```

#### 4. Retrieve Processed Image
```http
GET /image/{image_id}/{edge_type}
```

**Parameters:**
- `image_id`: UUID from processing response
- `edge_type`: `canny` or `fuzzy`

**Response:**
- PNG image (binary stream)

## Installation & Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Backend Setup

1. **Navigate to API directory**
```bash
cd api
```

2. **Create virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r ../requirements.txt
```

4. **Start the server**
```bash
uvicorn xray_api:app --reload
```

Backend will run at: **http://localhost:8000**

### Frontend Setup

1. **Navigate to app directory**
```bash
cd app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

Frontend will run at: **http://localhost:5173**

### Environment Variables (Optional)

Create `.env` files for custom configuration:

**Backend (.env):**
```env
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
```

## Usage

### Single Image Processing

1. Open the application at `http://localhost:5173`
2. Click "Browse" or drag & drop an X-ray image
3. Click "Process Image"
4. View results with toggle between Canny and Fuzzy edges
5. Download processed images

### Batch Processing

1. Prepare a ZIP file with multiple X-ray images
2. Upload the ZIP file through the interface
3. Process all images at once
4. Navigate through results
5. Download individual or all processed images

### API Usage (curl)

**Single Image:**
```bash
curl -X POST "http://localhost:8000/edge-detect" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@xray_image.png"
```

**Batch:**
```bash
curl -X POST "http://localhost:8000/batch-edge-detect" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@xray_images.zip"
```

## Research Background

This implementation is based on the research paper:

**"Algorithm for Processing X-ray Images Using Fuzzy Logic"**  
*Ali Sajae Mannaa*  
Advanced Engineering Research (Rostov-on-Don), 2024;24(3):293–300  
DOI: [10.23947/2687-1653-2024-24-3-293-300](https://doi.org/10.23947/2687-1653-2024-24-3-293-300)
