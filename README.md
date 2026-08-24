# 🚧 SadakRakshak

### AI-Enabled Smart Road Safety and Pothole Detection System

> **Turning everyday public transport into a mobile road-monitoring network.**

SadakRakshak is an **AI and IoT-based road safety system** designed to detect, monitor, verify, and track potholes using road-surface images captured from moving public transport vehicles.

The project combines **computer vision, IoT hardware, machine learning, geospatial visualization, and a web-based monitoring platform** to create a continuous approach to road-condition monitoring.

Instead of depending entirely on manual inspections or individual complaints, SadakRakshak aims to use existing public transportation networks as **mobile sensing platforms**, allowing road defects to be identified and systematically followed up.

---

## 🎯 Problem Statement

Potholes are a persistent road-safety problem. When road defects remain unnoticed or unresolved, they can contribute to:

* 🚗 Vehicle damage
* ⚠️ Road safety hazards
* 🚦 Traffic disruption
* 🛣️ Poor road conditions
* 📍 Delayed maintenance
* 📋 Inefficient manual inspection processes

Traditional road inspection often relies heavily on manual surveys and citizen complaints, which can make continuous monitoring difficult.

**SadakRakshak proposes a technology-driven alternative.**

---

## 💡 Our Solution

SadakRakshak uses a camera-equipped IoT system mounted on public transport vehicles to capture road-surface images while the vehicle is moving.

The captured data can then be processed using a machine-learning model to identify potholes. Detected road defects are represented within a centralized web platform where they can be visualized, verified, tracked, analyzed, and followed up.

### Core Concept

```text
🚌 Public Transport Vehicle
          │
          ▼
     📷 ESP32-CAM
          │
          ▼
   🖼️ Road Image Capture
          │
          ▼
     🤖 AI / ML Model
          │
          ▼
    🕳️ Pothole Detection
          │
          ▼
   🌐 SadakRakshak Platform
          │
     ┌────┼─────────────┐
     ▼    ▼             ▼
   🗺️ Map  📊 Analytics  🔍 Verification
     │
     ▼
 📋 Tracking & Follow-up
```

---

## ✨ Key Features

### 🤖 AI-Based Pothole Detection

Uses image-based machine learning to identify potholes from captured road-surface images.

### 📷 IoT-Based Road Monitoring

An **ESP32-CAM** can be deployed on moving vehicles to capture road images without requiring dedicated inspection vehicles.

### 🗺️ Interactive Pothole Mapping

Detected road defects can be visualized geographically, helping users understand where potholes are concentrated.

### 🔍 Pothole Verification

Detected reports can be reviewed and verified before being treated as confirmed road defects.

### 🔁 Duplicate Detection and Grouping

Repeated reports of the same road defect can be grouped to reduce unnecessary duplication and provide a clearer representation of persistent potholes.

### 📊 Analytics and Reporting

The platform provides data-driven views of detected road defects to support monitoring and analysis.

### 🚨 Escalation and Follow-up

Unresolved road defects can be tracked over time, with pending actions and follow-up mechanisms helping prevent reports from being forgotten.

### 🏛️ Authority Mapping

Road defects can be associated with relevant administrative or responsible authorities to support systematic follow-up.

### 🤖 AI Assistant

The platform includes an AI-assisted interface designed to help users interact with and understand the road-condition monitoring system.

### 📡 IoT Monitoring

The software platform provides an interface for monitoring the status and information associated with the IoT-based detection system.

---

## 🏗️ System Architecture

SadakRakshak is designed around three major layers:

### 1. IoT Layer

The physical sensing layer captures road-surface information.

**Primary hardware:**

* ESP32-CAM
* Camera module
* Vehicle-mounted sensing setup

### 2. AI / Data Processing Layer

The captured road images are processed to identify potential potholes using machine-learning-based image analysis.

### 3. Software Layer

A centralized web platform provides:

* Dashboard
* Interactive map
* Detection interface
* Pothole profiles
* Verification
* Grouping
* Analytics
* Reports
* Authority management
* Escalation tracking
* IoT monitoring
* AI Assistant

---

## 🛠️ Technology Stack

### Hardware

| Component        | Purpose                           |
| ---------------- | --------------------------------- |
| **ESP32-CAM**    | Road image acquisition            |
| Camera           | Capturing road-surface images     |
| IoT connectivity | Data communication and monitoring |

### Software

| Technology           | Purpose                           |
| -------------------- | --------------------------------- |
| **React**            | Frontend application              |
| **TypeScript**       | Application development           |
| **Vite**             | Development and build tooling     |
| **Tailwind CSS**     | User interface styling            |
| **Machine Learning** | Pothole image detection           |
| **Interactive Maps** | Geospatial pothole visualization  |
| **Git & GitHub**     | Version control and collaboration |

---

## 🖥️ Software Platform

The SadakRakshak web application acts as the central monitoring interface for the system.

The platform is organized into multiple functional modules, including:

```text
SadakRakshak Platform
│
├── Dashboard
├── Detection
├── Pothole Map
├── Pothole Details
├── Verification
├── Grouping
├── Analytics
├── Reports
├── Authorities
├── Escalation
├── IoT Monitoring
├── Architecture
└── AI Assistant
```

This allows detected road defects to move from **initial detection to monitoring and follow-up** within a unified interface.

---

## 🔄 Workflow

```text
Vehicle Movement
       ↓
Road Image Capture
       ↓
Image Processing
       ↓
AI-Based Detection
       ↓
Potential Pothole Identified
       ↓
Location / Road Information
       ↓
Web Platform
       ↓
Verification & Grouping
       ↓
Mapping & Analytics
       ↓
Authority Assignment
       ↓
Follow-up / Escalation
       ↓
Resolution Tracking
```

---

## 🌍 Why Public Transport?

One of the central ideas behind SadakRakshak is to make use of **vehicles that are already travelling through the city every day**.

Instead of deploying separate inspection vehicles across every road, public transport vehicles can potentially act as mobile road-monitoring platforms.

This creates the possibility of:

* Greater road coverage
* More frequent observations
* Reduced dependence on manual inspections
* Continuous road-condition monitoring
* Scalable deployment across transportation networks

---

## 📚 Research

SadakRakshak was developed as a research-oriented project exploring the combination of **IoT, machine learning, computer vision, and web-based road monitoring**.

### Research Paper

**SadakRakshak: An AI-Enabled Smart Road Safety and Pothole Detection System**

**Authors:**

* **Zoya Sameer Shaikh**
* **Alisha Ashfaq Shaikh**

**Affiliation:**
Atharva University, Mumbai, Maharashtra, India

---

## 🚀 Project Objectives

The major objectives of SadakRakshak are to:

1. Develop an automated approach to pothole detection.
2. Use low-cost IoT hardware for road-surface image acquisition.
3. Reduce dependence on manual road inspections.
4. Provide centralized visualization of detected road defects.
5. Enable verification and tracking of pothole reports.
6. Support systematic follow-up of unresolved road defects.
7. Explore the use of public transport as a mobile road-monitoring network.
8. Create a scalable foundation for intelligent road-condition monitoring.

---

## 🔮 Future Scope

SadakRakshak can be extended beyond the current prototype through:

* 📍 More accurate GPS-based localization
* 🤖 Improved pothole detection models
* 📱 Dedicated mobile applications
* ☁️ Live cloud-based data synchronization
* 🏛️ Integration with municipal road-maintenance systems
* 📡 Large-scale deployment across public transport fleets
* 📈 Predictive road-condition analysis
* 🕳️ Detection of additional road hazards
* 🌐 Real-time centralized monitoring
* 🔔 Automated notifications and maintenance workflows

A production deployment could use a **live centralized backend or cloud infrastructure** for continuous collection, synchronization, and monitoring of road-condition data.

---

## 📁 Project Structure

```text
SadakRakshak/
│
├── public/
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── styles.css
│   ├── router.tsx
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/Zoya-shaikh-o/SadakRakshak.git
```

### Navigate to the Project

```bash
cd SadakRakshak
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The application will then be available through the local development URL provided by Vite.

---

## 🔐 Environment Variables

If the project requires API keys or other environment-specific configuration, store them in a local `.env` file.

**Never commit API keys, passwords, access tokens, or other sensitive credentials to GitHub.**

Environment files are excluded through `.gitignore`.

---

## 👩‍💻 Authors

### Zoya Sameer Shaikh

Robotics and Automation
Atharva University, Mumbai, Maharashtra, India

### Alisha Ashfaq Shaikh

Robotics and Automation
Atharva University, Mumbai, Maharashtra, India

---

## 📄 License

This project is intended for **academic, research, and educational purposes**.

For permissions regarding reuse, modification, or commercial deployment, please contact the authors.

---

## ⭐ Acknowledgement

SadakRakshak represents an exploration of how **AI, IoT, and software engineering can work together to address real-world urban infrastructure challenges**.

> **Detect the road. Track the problem. Protect the journey.**

### 🚧 SadakRakshak

**Smarter roads. Safer journeys.**

