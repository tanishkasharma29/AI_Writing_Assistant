# Deploy AI Writing Assistant to Render

## Prerequisites

- GitHub repository: https://github.com/tanishkasharma29/AI_Writing_Assistant
- OpenAI API Key
- Render account (free tier available)

## Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Add deployment configuration for Render"
   git push origin main
   ```

## Step 2: Deploy Backend (Server) on Render

1. **Go to Render Dashboard**

   - Visit [render.com](https://render.com)
   - Sign up/Login with your GitHub account

2. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select the repository: `AI_Writing_Assistant`

3. **Configure Web Service Settings**

   - **Name**: `ai-writing-assistant-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":

   ```
   PORT=8000
   OPENAI_API_KEY=your_actual_openai_api_key_here
   NODE_ENV=production
   ```

5. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Note your backend URL: `https://ai-writing-assistant-backend.onrender.com`

## Step 3: Deploy Frontend (Client) on Render

1. **Create Static Site**

   - In Render dashboard, click "New +" → "Static Site"
   - Select the same repository: `AI_Writing_Assistant`

2. **Configure Static Site Settings**

   - **Name**: `ai-writing-assistant-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables** (if needed)

   ```
   VITE_API_URL=https://ai-writing-assistant-backend.onrender.com
   ```

4. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Your app will be live at: `https://ai-writing-assistant-frontend.onrender.com`

## Step 4: Update CORS Settings

Update your server's CORS configuration to allow your frontend domain.

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test all features:
   - Spell checker
   - Grammar checker
   - Text analysis
   - Navigation between pages

## Troubleshooting

### Common Issues:

1. **Build Failures**

   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**

   - Verify environment variables are set correctly
   - Check CORS configuration
   - Ensure backend URL is correct in frontend

3. **OpenAI API Errors**
   - Verify API key is valid and has credits
   - Check API key permissions

### Render Free Tier Limitations:

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30+ seconds
- 750 hours per month (multiple services share this limit)

## Production URLs

- **Frontend**: `https://ai-writing-assistant-frontend.onrender.com`
- **Backend**: `https://ai-writing-assistant-backend.onrender.com`

## Environment Variables Reference

### Backend (.env)

```
PORT=8000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### Frontend (if needed)

```
VITE_API_URL=https://ai-writing-assistant-backend.onrender.com
```

---

**Note**: Replace `your_actual_openai_api_key_here` with your real OpenAI API key when setting up environment variables in Render.
