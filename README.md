# AI Writing Assistant

[Live Demo](https://ai-writing-assistant-frontend-46t2.onrender.com)

A full-stack writing platform offering grammar correction, text rephrasing, and intelligent writing assistance using OpenAI. Combines a React + Tailwind frontend with a Node.js / Express backend and secure authentication via Privy Auth.

---

## 🧰 Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **AI / Language**: OpenAI API  
- **Auth**: Privy Auth  
- **Deployment**: (e.g. Render, Vercel, etc.)  

---

## 🚀 Features

- Real-time grammar correction  
- Intelligent rephrasing / paraphrasing  
- Secure authentication and user management  
- Responsive UI with clean design  
- Reduced manual editing workload (estimated ~40% time saving)  

---

## 📁 Repository Structure

- `client/`: React app, Tailwind CSS styling, UI components.  
- `server/`: REST API endpoints, OpenAI integration, authentication.  
- `RENDER_DEPLOYMENT.md`: Deployment steps for Render.

---

## 🛠️ Setup & Usage

### Prerequisites

- Node.js & npm installed  
- OpenAI API key  
- Privy Auth credentials / setup  

### Install & Run Locally

1. Clone the repository  
   ```bash
   git clone https://github.com/tanishkasharma29/AI_Writing_Assistant.git
   cd AI_Writing_Assistant

2. Setup backend
   ```bash
   cd server
   npm install
   # configure environment variables:
   #   OPENAI_API_KEY, PRIVY_CLIENT_ID, PRIVY_SECRET, etc.
   npm run dev

3. Setup frontend
   ```bash
   cd ../client
   npm install
   # configure environment (e.g. API base URL)
   npm start
