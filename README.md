# 🌍 AI Powered Land Surveillance System

> Real-time satellite-powered forest monitoring & AI threat detection for Kenya Forest Service

**Live Demo:** UPCOMING



---

## 🎯 Project Overview

An AI-powered platform that helps Kenya Forest Service (KFS) rangers detect illegal logging, fires, and encroachment using:

- 🛰️ **Sentinel-2 satellite imagery** (free ESA data)
- 🌿 **NDVI analysis** for vegetation health
- 🤖 **Groq AI (Llama 3.3 70B)** for threat analysis & dispatch recommendations
- 📍 **Real-time geospatial mapping** with MapLibre GL
- 👥 **Public reporting system** with photo evidence

---

## ✨ Features

### Public Dashboard
- National forest cover statistics (47 counties)
- County leaderboard (growth & cover)
- Live threat feed
- Forestry news aggregator
- Anonymous incident reporting with photos
- AI chatbot assistant

### Ranger Console (password-protected)
- Full-screen interactive map of Kenya
- 4 layer modes: Satellite / NDVI / Terrain / Navigate
- Flashing threat markers with severity color-coding
- Forest reserve & county boundary overlays
- 5-year temporal slider for historical comparison
- AI-generated tactical briefings per threat
- Dispatch system with Google Maps integration
- Real-time public reports drawer
- AI batch analysis of incoming reports
- Ranger intelligence chatbot

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | TailwindCSS v4 + shadcn/ui |
| Map | MapLibre GL + MapTiler |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase + cookie-based ranger session |
| AI | Groq (Llama 3.3 70B) |
| Storage | Supabase Storage (report photos) |
| Deployment | Vercel |
| Animations | Framer Motion |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- pnpm
- Supabase account
- Groq API key
- MapTiler API key

### Setup

```bash
git clone https://github.com/unsteadyasset/ai.git
cd ai
pnpm install
