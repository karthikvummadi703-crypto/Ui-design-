# CivicPulse UI Design Deployment Guide

This project is a high-performance, single-view interactive UI design built using React, Vite, Tailwind CSS, and structured with an Express + Vite backend. It is pre-configured for instant zero-config deployments to **Google Cloud Run** using containerization.

---

## 🚀 Deployment of this UI Design to Cloud Run (Git Integration)

Yes, it is entirely possible to deploy this application to Google Cloud Run directly from a Git repository (such as GitHub or GitLab). We have added all of the necessary files formatted for production environment loads:

1. **`Dockerfile`**: A multi-stage, lightweight production container setup compiling front-end assets through Vite and bundling the server.
2. **`.dockerignore`**: Excludes local dev modules to keep builds lightning fast.
3. **`cloudbuild.yaml`**: Pre-configured CI/CD trigger rules for Google Cloud Build automated environments.
4. **`server.ts`**: Updated to dynamically bind to the Cloud Run standard runtime environment port `$PORT`.

---

## 🛠️ Step-by-Step Deployment Instructions

### Method A: Automated Deployment via GitHub Connection (Recommended)

1. **Export the Code**: Click the **Settings Menu** in your AI Studio build area, and select **Export to GitHub** to create a repository.
2. **Go to Google Cloud Console**: Navigate to [Google Cloud Run](https://console.cloud.google.com/run).
3. **Create Service**: Click **Create Service**.
4. **Connect Git Repository**:
   - Choose **"Continuously deploy new revisions from a source repository"**.
   - Authenticate with your GitHub/GitLab account and select your repository.
5. **Configure Build Settings**:
   - For **Build Type**, select **Dockerfile** (Google Cloud will automatically read the root `/Dockerfile` we provided).
6. **Set Environment Variables**:
   *If you want to invoke active AI components securely:*
   - Under **Variables & Secrets**, add your `GEMINI_API_KEY` environment variable.
7. **Deploy**: Click **Create**. Google Cloud Build will automatically compile, containerize, and host your app live.

---

### Method B: Manual Deployment via Google Cloud SDK Command Line

If you have the Google Cloud SDK (`gcloud`) installed on your computer, you can build and launch it locally in seconds:

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Build and deploy using our pre-compiled Dockerfile
gcloud run deploy civicpulse-ui --source . --region us-central1 --allow-unauthenticated
```

---

## 📦 Tech Architecture & Standard Commands

- **Build Output**: Compilation places files into `/dist`, hosting a structured client-side client bundle alongside `/dist/server.cjs` (an esbuild-optimized single bundle file that contains the Express backend without loading large directories).
- **Run Locally**:
  ```bash
  # 1. Install local assets
  npm install
  # 2. Run in high-fidelity developer live-reload mode
  npm run dev
  # 3. Compile and Run in mimicking Production setup
  npm run build
  npm run start
  ```
