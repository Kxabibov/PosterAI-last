import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 3001;

// Proxy endpoint for Remove.bg API
app.post('/api/removebg', async (req, res) => {
  try {
    const { image_b64 } = req.body;
    if (!image_b64) {
      return res.status(400).json({ error: 'Missing image_b64 parameter' });
    }

    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'REMOVEBG_API_KEY is not configured on the server.' });
    }

    const formData = new URLSearchParams();
    formData.append('image_file_b64', image_b64);
    formData.append('size', 'auto');

    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!removeBgRes.ok) {
      const errText = await removeBgRes.text();
      console.error('Remove.bg API returned error:', errText);
      return res.status(removeBgRes.status).send(errText);
    }

    const buffer = await removeBgRes.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error('Server Remove.bg error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for Gemini API poster generation
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, image_b64 } = req.body;
    if (!prompt || !image_b64) {
      return res.status(400).json({ error: 'Missing prompt or image_b64' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const incomingReferer = req.headers.referer || req.headers.referrer;
    const refererHeader = (incomingReferer && (incomingReferer.includes('web.app') || incomingReferer.includes('firebaseapp.com')))
      ? (Array.isArray(incomingReferer) ? incomingReferer[0] : incomingReferer)
      : 'https://gen-lang-client-0995405102.firebaseapp.com/';

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'Referer': refererHeader
        }
      }
    });

    const result = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image_b64
          }
        }
      ],
      config: {
        responseModalities: ["IMAGE"]
      }
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Server Gemini error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// For Vercel Serverless environments, we export the Express app
export default app;
