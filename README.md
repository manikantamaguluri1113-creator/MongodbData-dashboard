# 📊 MongoDB Data Visualization Dashboard

An interactive, production-style data visualization dashboard built using **Angular**, **D3.js**, **Node.js**, and **MongoDB** to analyze and explore insights data provided by Blackcoffer.

The application focuses on transforming raw JSON data into meaningful business insights through filters, charts, and a polished UI.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login
- Protected routes using Angular Auth Guards
- Secure logout functionality

---

### 🎛️ Interactive Filters
Users can dynamically filter insights based on:
- End Year
- Topic
- Sector
- Region
- PESTLE
- Source
- Country

Filters update charts and data in real time.  
A reset option restores the default state.

---

### 📈 Data Visualizations (D3.js)

#### 1. Intensity Trend by End Year
- Line chart showing average intensity over time
- Axis labels and legend
- Tooltip on data points
- Responsive and dynamically updated

#### 2. Insights by Sector
- Bar chart displaying number of insights per sector
- Dynamic color scaling based on count
- Smooth bar growth animation on load
- Tooltips on hover
- Color intensity legend and axis labels

---

### 🎨 UI & UX
- Responsive dashboard layout using **CSS Grid**
- Professional gradient page background
- Elevated cards with subtle shadows
- Clean typography and spacing
- No horizontal scroll or layout overlap
- Mobile-friendly design

---

## 🛠️ Tech Stack

### Frontend
- Angular
- Angular Material
- D3.js
- TypeScript
- HTML & CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## 📁 Project Structure

```bash
BlackCoffer-dashboard/
│
├── backend/                     # Backend API (Node.js / Express)
│   ├── controllers/             # API controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── config/                  # DB & environment config
│   ├── app.js                   # Express app entry
│   └── package.json
│
├── frontendAngular/             # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Dashboard module (charts, filters)
│   │   │   ├── login/           # Authentication module
│   │   │   ├── services/        # API services
│   │   │   ├── guards/          # Route guards
│   │   │   └── interceptors/    # Auth interceptors
│   │   │
│   │   ├── assets/              # Static assets
│   │   ├── environments/        # Environment configs
│   │   └── index.html
│   │
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── README.md                    # Project documentation
├── .gitignore                   # Git ignored files
└── LICENSE                      # Project license

### 🧩 Architecture Overview
- Backend exposes REST APIs to serve filtered insights data
- Angular frontend consumes APIs and renders interactive D3 visualizations
- Filters, charts, and pagination are handled on the frontend
- D3.js is used for custom, performant data visualizations

## Prerequisites
- Node.js (v18+)
- Angular CLI
- Git

## Backend Setup
- cd backend
- npm install
- npm start

## Frontend Setup
- cd frontendAngular
- npm install
- ng serve

## URLs
- Backend: http://localhost:5000
- Frontend: http://localhost:4200
