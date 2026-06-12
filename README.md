# ResetOS 🧠⚡

ResetOS is a modern, premium dopamine detox, burnout prevention, and recovery ecosystem. Designed for high-performers, builders, and knowledge workers, it functions as a personal operating system to track cognitive load, schedule optimized focus states, initiate guided physical/mental recovery routines, and interact with an AI cognitive coach.

The project is structured as a monorepo consisting of:
1. **Frontend App**: A state-of-the-art mobile application built with **React Native / Expo** and **TypeScript**, showcasing high-fidelity interactive elements, glassmorphism designs, micro-animations, and full offline/online state management via **Zustand**.
2. **Backend API**: A secure neural API microservice built with **Node.js, Express, and Firebase Admin SDK**, integrating **OpenAI API** for contextual cognitive insights and rate-limited endpoint defenses.

---

## 🚀 Key Features

### 💻 Mobile Client (`/`)
* **Dashboard Hub**: High-fidelity personal hub displaying active detox streaks, real-time energy rings, and direct actions.
* **Focus & Recovery Systems**: Custom Pomodoro engines, deep-work timers, and guided recovery modules (e.g., box breathing, eye exercises, stretching).
* **AI Cognitive Coach**: An interactive, localized chatbot helper configured to provide behavioral analytics, advice, and mental health checkups.
* **Habit & Dopamine Detox Tracking**: Specialized trackers designed to help users step away from hyper-stimulating apps, monitor screen time, and track daily check-ins.
* **Sleep & Analytics**: Telemetry analysis, interactive activity heatmaps, and structured health data visualization.
* **Gamification & Customization**: Dynamic experience points (XP) rewards, achievements, challenges, and customizable themes.

### 🔌 Backend Neural API (`/backend`)
* **AI Engine**: Core engine processing assessments and generating dynamic recovery recommendations powered by OpenAI.
* **Robust Security Stack**: Secured with **Helmet**, **CORS**, and layered rate-limiting (`express-rate-limit`) to defend against scraping and token depletion.
* **Firebase Admin SDK stubbing**: Local authentication middleware decoding JWT authorization tokens.
* **Analytics & Data Pipelines**: Aggregated calculations for user streaks, weekly burnout scores, and database migrations.

---

## 🛠 Tech Stack

### Frontend Mobile
* **Framework**: React Native with [Expo SDK 54](https://expo.dev)
* **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing with Typed Routes)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Design & Animations**: Haptics, Linear Gradients, Custom CSS Themes, Blur Views, and React Native Reanimated
* **Database & Auth Client**: Firebase Web SDK (v11.1.0)
* **HTTP Client**: Axios

### Backend Service
* **Runtime**: Node.js (v18+)
* **Server**: Express.js
* **Security & Optimizations**: Helmet, Compression, Cors
* **Validation**: Joi
* **AI Integration**: OpenAI SDK
* **Logging**: Winston & Morgan

---

## ⚙️ Environment Configuration

Before launching either service, configure the environment variables:

### 1. Frontend (`/.env`)
Create a `.env` file in the root directory. You can reference [`.env.example`](file:///Users/abhishekjha/Desktop/Burnout/ResetOS/.env.example):
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_OPENAI_KEY=your_openai_api_key

# Firebase Client configuration
EXPO_PUBLIC_FB_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FB_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FB_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FB_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FB_MESSAGING_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FB_APP_ID=your_firebase_app_id
```

### 2. Backend (`/backend/.env`)
Create a `.env` file inside the `backend` directory:
```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081
# Firebase Admin Credentials (when replacing local stubs)
FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## 🏁 Getting Started

Clone the repository and install the dependencies:

### 📦 Installation

To install dependencies for both the frontend application and backend service:

```bash
# Install root (Expo) dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 🏃 Running the Project

You can run both systems concurrently:

#### Start the Backend API:
```bash
# Run in development mode (with nodemon reload)
npm run backend:dev
```

#### Start the Frontend Mobile Client:
```bash
# Run the bundler
npm run start

# Alternatively, target specific platforms:
npm run ios     # Start iOS Simulator
npm run android # Start Android Emulator/Device
npm run web     # Start Web Preview
```

---

## 📂 Project Structure

```
ResetOS/
├── .expo/                   # Expo configuration & build cache
├── app/                     # Expo Router app structure
│   ├── auth/                # Welcome, onboarding, and assessment flows
│   ├── screens/             # Deep work, AI Coach, habit, sleep, detox screens
│   ├── tabs/                # Tab Bar Layout, Dashboard, Analytics, Focus, Recovery
│   ├── _layout.tsx          # Root Layout & Store Providers
│   └── index.tsx            # Main Entry Router
├── assets/                  # App images, branding assets, splash screen
├── backend/                 # Node.js API Microservice
│   ├── ai/                  # AI engine and OpenAI integrations
│   ├── config/              # Firebase Admin SDK setups
│   ├── controllers/         # Routing controller logic
│   ├── middleware/          # JWT authentication, logging middlewares
│   ├── models/              # Schema validations
│   ├── routes/              # Express Router bindings
│   └── server.js            # Express Entrypoint
├── components/              # Shared UI components (timers, rings, custom components)
├── constants/               # Color tokens, presets, game system config
├── services/                # Axios API services & Firebase client initialization
└── store/                   # Global state (auth, burnout, focus, and main stores)
```
