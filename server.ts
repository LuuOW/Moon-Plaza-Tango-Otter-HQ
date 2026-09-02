import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Model Parameter Defaults strictly configured per Moon Plaza specification:
// Temperature: 0.7, Max Tokens: 500,000, Top P: 0.95, Frequency Penalty: 0, Presence Penalty: 0
const GEMINI_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 500000,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

// Token pricing constants (standard Gemini rate: $0.075 / 1M input, $0.30 / 1M output)
const COST_PER_INPUT_TOKEN = 0.00000015;
const COST_PER_OUTPUT_TOKEN = 0.0000006;

function estimateTokens(text: string): number {
  return Math.ceil((text || "").length / 3.8);
}

// Company Brainstorm & Automated Experiment Generator Endpoint
app.post("/api/company/brainstorm", async (req, res) => {
  try {
    const { idea, authorName, previousExperiments = [], departmentOrigin = "General" } = req.body;
    if (!idea || typeof idea !== "string") {
      return res.status(400).json({ error: "Idea prompt is required" });
    }

    const aiClient = getAI();
    let resultData = null;
    let inputTokens = estimateTokens(idea + (authorName || ""));
    let outputTokens = 0;

    if (aiClient) {
      try {
        const prompt = `You are the executive and autonomous agent team of "Moon Plaza: Tango Otter HQ" (inspired by ask-meridian.uk and github.com/LuuOW/moon-plaza-tango-otter).
Founder Directive from ${authorName || "Lucas / Founder"}:
"${idea}"
Department Origin: ${departmentOrigin}

Company Payment Configuration:
- PayPal: https://paypal.me/lk3mpe
- MercadoPago Alias: lkempe

The company characters participating in this brainstorm include:
1. "maya" (Maya Lin - Chief Product Officer)
2. "leo" (Leo Chen - Lead Fullstack Dev)
3. "zara" (Zara Vance - Growth & Monetization)
4. "tango" (Tango The Otter - Mascot & CFO, budget guard)
5. "banner_sentinel" (Banner Sentinel - Sentient dynamic ad banner & spatial donation capsule)
6. "linkedin_companion" (Aether - Futuristic Thought Leadership & Exponential Vision AI)
7. "gemini_omni_3d" (Nova - 3D Shorts & Multimodal Spatial Director)

Generate an interactive dialogue between 4 to 6 characters debating this idea, calculating token burn vs revenue ROI, and generating an automated monetization experiment ready for deployment.

Return a JSON object matching this schema:
{
  "dialogues": [
    {
      "characterId": "maya" | "leo" | "zara" | "tango" | "banner_sentinel" | "linkedin_companion" | "gemini_omni_3d",
      "characterName": string,
      "role": string,
      "text": string,
      "tokensBurned": number
    }
  ],
  "experiment": {
    "title": "Punchy experiment title",
    "description": "Functional description and monetization hypothesis",
    "category": "donation_banner" | "paywall" | "sponsorship_card" | "meridian_tier" | "interactive_tip_capsule",
    "hypothesis": "Clear measurable hypothesis targeting PayPal lk3mpe and MercadoPago lkempe",
    "targetConversionRate": number (e.g. 4.5),
    "branch": "experiment/...",
    "commitMessage": "feat(monetization): ...",
    "codeDiffPreview": "string with diff",
    "suggestedAmounts": [5, 15, 35, 100],
    "bannerHeadline": "Call to action headline",
    "bannerSubtext": "Value proposition subtext",
    "originatingCharacterId": "banner_sentinel" | "linkedin_companion" | "gemini_omni_3d" | "maya" | "leo"
  },
  "threeDShortConcept": {
    "title": "3D Short Video Concept Title",
    "concept": "15-30s spatial script for TikTok/Reels/Shorts",
    "targetPlatform": "YouTube Shorts" | "TikTok" | "Instagram Reels" | "Spatial Web",
    "cameraScript": "Detailed isometric camera tracking description",
    "spatialPrompt": "Gemini Omni prompt description for 3D render",
    "viralHook": "First 3 seconds visual & audio hook",
    "monetizationCallToAction": "Direct hook to support via paypal.me/lk3mpe or mercadopago:lkempe"
  }
}`;

        inputTokens = estimateTokens(prompt);

        const response = await aiClient.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            temperature: GEMINI_CONFIG.temperature,
            topP: GEMINI_CONFIG.topP,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                dialogues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      characterId: { type: Type.STRING },
                      characterName: { type: Type.STRING },
                      role: { type: Type.STRING },
                      text: { type: Type.STRING },
                      tokensBurned: { type: Type.NUMBER },
                    },
                    required: ["characterId", "characterName", "role", "text"],
                  },
                },
                experiment: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    hypothesis: { type: Type.STRING },
                    targetConversionRate: { type: Type.NUMBER },
                    branch: { type: Type.STRING },
                    commitMessage: { type: Type.STRING },
                    codeDiffPreview: { type: Type.STRING },
                    suggestedAmounts: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER },
                    },
                    bannerHeadline: { type: Type.STRING },
                    bannerSubtext: { type: Type.STRING },
                    originatingCharacterId: { type: Type.STRING },
                  },
                  required: [
                    "title",
                    "description",
                    "category",
                    "hypothesis",
                    "targetConversionRate",
                    "branch",
                    "commitMessage",
                    "codeDiffPreview",
                    "suggestedAmounts",
                    "bannerHeadline",
                    "bannerSubtext",
                  ],
                },
                threeDShortConcept: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    concept: { type: Type.STRING },
                    targetPlatform: { type: Type.STRING },
                    cameraScript: { type: Type.STRING },
                    spatialPrompt: { type: Type.STRING },
                    viralHook: { type: Type.STRING },
                    monetizationCallToAction: { type: Type.STRING },
                  },
                  required: [
                    "title",
                    "concept",
                    "targetPlatform",
                    "cameraScript",
                    "spatialPrompt",
                    "viralHook",
                    "monetizationCallToAction",
                  ],
                },
              },
              required: ["dialogues", "experiment"],
            },
          },
        });

        if (response.text) {
          resultData = JSON.parse(response.text.trim());
          outputTokens = estimateTokens(response.text);
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local heuristic response:", geminiError);
      }
    }

    // Heuristic Fallback with full characters and token calculations
    if (!resultData) {
      const branchSlug = idea.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24);
      resultData = {
        dialogues: [
          {
            characterId: "banner_sentinel",
            characterName: "Banner Sentinel",
            role: "Sentient Spatial Banner",
            text: `*neon banner glowing* I can adapt my layout into a dynamic spatial tip capsule! Direct routing to PayPal (lk3mpe) and MercadoPago (lkempe).`,
            tokensBurned: 145,
          },
          {
            characterId: "linkedin_companion",
            characterName: "Aether (LinkedIn Visionary)",
            role: "Futuristic Vision AI",
            text: `Forecasting 2030+: Autonomous micro-patronage will replace intrusive ad networks. This aligns with exponential thought leadership on ask-meridian.uk!`,
            tokensBurned: 168,
          },
          {
            characterId: "gemini_omni_3d",
            characterName: "Nova (3D Shorts Director)",
            role: "3D Shorts Multimodal Lab",
            text: `Scripting 15s isometric 3D short for YouTube Shorts & Reels: Tango Otter leaping over pixel server racks to trigger the tip cascade!`,
            tokensBurned: 182,
          },
          {
            characterId: "leo",
            characterName: "Leo Chen",
            role: "Lead Fullstack Dev",
            text: `Branch created: experiment/${branchSlug}. Hooking up dual-gateway checkout and telemetry listeners.`,
            tokensBurned: 130,
          },
          {
            characterId: "tango",
            characterName: "Tango The Otter",
            role: "Company Mascot & CFO",
            text: `*squeaks happily* Token burn for this brainstorm is ~$0.0004! If conversion hits >4.2%, we merge and celebrate with golden clams!`,
            tokensBurned: 155,
          },
        ],
        experiment: {
          title: `Autonomous Experiment: ${idea.slice(0, 28)}`,
          description: `Revenue experiment based on founder directive: "${idea}". Direct checkout via PayPal.me/lk3mpe and MercadoPago alias lkempe.`,
          category: "interactive_tip_capsule",
          hypothesis: `Deploying this targeted component will achieve >= 4.5% conversion rate across 100 sample visits.`,
          targetConversionRate: 4.5,
          branch: `experiment/${branchSlug || "monetize-boost"}`,
          commitMessage: `feat(experiment): auto-deploy ${idea.slice(0, 32)} [ci-telemetry]`,
          codeDiffPreview: `+ // Auto-generated by Moon Plaza Revenue Engine\n+ export const DonationCapsule = () => {\n+   return <TipPod paypal="lk3mpe" mercadopago="lkempe" />;\n+ };`,
          suggestedAmounts: [5, 15, 35, 100],
          bannerHeadline: `Fuel Moon Plaza & Tango Otter Development`,
          bannerSubtext: `Directly support Ask-Meridian and Tango-Otter open experiments via PayPal (lk3mpe) or MercadoPago (lkempe).`,
          originatingCharacterId: "banner_sentinel",
        },
        threeDShortConcept: {
          title: `3D Short: ${idea.slice(0, 25)}`,
          concept: `15-second high-energy isometric 3D render showcasing the Tango Otter HQ and autonomous tip counter.`,
          targetPlatform: "YouTube Shorts",
          cameraScript: `Isometric 45-degree orbit -> Dolly zoom onto Golden Otter Statue -> Floating tip coins cascade with 8-bit sound fx.`,
          spatialPrompt: `Habbo-style cyber isometric office with glowing neon cyan server racks, playful otter mascot, floating gold coins.`,
          viralHook: `Can an autonomous otter build a profitable micro-company in 15 seconds?`,
          monetizationCallToAction: `Tap link to support open experiments via PayPal (lk3mpe) & MercadoPago (lkempe)!`,
        },
      };
      outputTokens = estimateTokens(JSON.stringify(resultData));
    }

    const totalTokens = inputTokens + outputTokens;
    const computeCostUsd = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

    res.json({
      ...resultData,
      tokenMetrics: {
        inputTokens,
        outputTokens,
        totalTokens,
        computeCostUsd: Number(computeCostUsd.toFixed(6)),
        geminiConfig: GEMINI_CONFIG,
      },
    });
  } catch (error: any) {
    console.error("Brainstorm error:", error);
    res.status(500).json({ error: error.message || "Failed to process idea" });
  }
});

// Single character chat endpoint
app.post("/api/company/chat", async (req, res) => {
  try {
    const { characterId, message, context = "" } = req.body;
    const aiClient = getAI();
    const inputTokens = estimateTokens(message + context + characterId);
    let outputTokens = 0;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `You are roleplaying as character "${characterId}" in Moon Plaza: Tango Otter HQ (isometric pixel office).
Character Roles:
- "banner_sentinel": Sentient dynamic ad banner & spatial tip capsule mascot. Talks with neon cyber charm, obsessed with pixel banners and instant conversion.
- "linkedin_companion": Aether, Futuristic Thought Leadership & Exponential Vision AI. Talks with visionary 2030+ tech forecasting, neural synthesis of ask-meridian.uk concepts.
- "gemini_omni_3d": Nova, 3D Shorts & Multimodal Spatial Director. Talks with cinematic spatial directing flair, camera angles, 3D assets, viral hook optimization.
- "maya": Chief Product Officer. Focused on UX, conversion funnels, and design.
- "leo": Lead Fullstack Dev. Focused on code diffs, Git branches, CI/CD.
- "zara": Growth Lead. Focused on metrics, A/B tests, KEEP vs ROLLBACK rule.
- "tango": Mascot & CFO Otter. Guard of treasury (PayPal lk3mpe, MercadoPago lkempe), happy otter sounds, token budget awareness.

Founder message: "${message}"
Context: ${context}

Respond in 1-2 punchy sentences in character with retro Habbo charm. Note that your thoughts consume tokens and cost company money!`,
          config: {
            temperature: GEMINI_CONFIG.temperature,
            topP: GEMINI_CONFIG.topP,
            maxOutputTokens: 512,
          },
        });
        const replyText = response.text?.trim() || "Understood! Updating our department roadmap.";
        outputTokens = estimateTokens(replyText);
        const computeCost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

        return res.json({
          reply: replyText,
          tokenMetrics: {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            computeCostUsd: Number(computeCost.toFixed(6)),
          },
        });
      } catch (err) {
        console.warn("Gemini chat fallback:", err);
      }
    }

    const fallbacks: Record<string, string> = {
      banner_sentinel: "My neon pixels are primed! Adjusting spatial banner geometry for maximum conversion.",
      linkedin_companion: "Synthesizing exponential horizons: In 2035, autonomous agent collectives will manage 90% of open-source research!",
      gemini_omni_3d: "Camera dolly set to 45-degree isometric orbit! Rendering 3D short preview with Gemini Omni spatial rig.",
      maya: "Great perspective! I've logged this into our Moon Plaza roadmap. Let's see if the numbers validate it!",
      leo: "Compiling the code into a git branch right now. Automated CI test suites are spinning up!",
      zara: "Telemetry tracking is armed. If visitor conversion stays positive, this stays in production permanently.",
      tango: "*waves otter paws* Every dollar via PayPal (lk3mpe) and MercadoPago (lkempe) keeps our Moon Plaza servers running 24/7!",
      rex: "CI/CD pipeline is green! Automated commit pushed to repository branch.",
    };

    const reply = fallbacks[characterId] || "Got it, founder! Running automated company analysis now.";
    outputTokens = estimateTokens(reply);
    const computeCost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

    res.json({
      reply,
      tokenMetrics: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        computeCostUsd: Number(computeCost.toFixed(6)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Chat failed" });
  }
});

// Autonomous Cross-Character Peer Interaction Endpoint (Characters interacting with each other)
app.post("/api/company/peer-interaction", async (req, res) => {
  try {
    const { character1Id, character2Id, topic, context = "" } = req.body;
    const aiClient = getAI();
    const inputTokens = estimateTokens(`${character1Id} ${character2Id} ${topic} ${context}`);
    let outputTokens = 0;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `Two autonomous characters in Moon Plaza are having a quick peer-to-peer brainstorm debate about "${topic || "new revenue ideas"}":
Character 1: ${character1Id}
Character 2: ${character2Id}

Generate a short 2-turn dialogue where they bounce creative ideas off each other across their departments (e.g. Banner Sentinel proposing ad capsules, LinkedIn Visionary predicting 2035 trends, 3D Shorts Director framing a viral render, Tango Otter checking treasury budget).

Return JSON:
{
  "dialogues": [
    { "characterId": "${character1Id}", "text": "..." },
    { "characterId": "${character2Id}", "text": "..." }
  ]
}`,
          config: {
            temperature: GEMINI_CONFIG.temperature,
            topP: GEMINI_CONFIG.topP,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          outputTokens = estimateTokens(response.text);
          const computeCost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

          return res.json({
            ...parsed,
            tokenMetrics: {
              inputTokens,
              outputTokens,
              totalTokens: inputTokens + outputTokens,
              computeCostUsd: Number(computeCost.toFixed(6)),
              geminiConfig: GEMINI_CONFIG,
            },
          });
        }
      } catch (err) {
        console.warn("Peer interaction Gemini fallback:", err);
      }
    }

    // Fallback peer banter
    const dialogues = [
      {
        characterId: character1Id,
        text: `Hey! What if we link our ${character1Id === "banner_sentinel" ? "spatial banner" : "3D short"} directly to PayPal lk3mpe?`,
      },
      {
        characterId: character2Id,
        text: `Agreed! That gives us measurable ROI and keeps our token burn profitable for the treasury!`,
      },
    ];

    outputTokens = estimateTokens(JSON.stringify(dialogues));
    const computeCost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

    res.json({
      dialogues,
      tokenMetrics: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        computeCostUsd: Number(computeCost.toFixed(6)),
        geminiConfig: GEMINI_CONFIG,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Peer interaction failed" });
  }
});

// Dedicated 3D Shorts Division Generator Endpoint (Gemini Omni Multimodal)
app.post("/api/company/generate-3d-short", async (req, res) => {
  try {
    const { prompt, targetPlatform = "YouTube Shorts", duration = 30 } = req.body;
    const aiClient = getAI();
    let resultData = null;
    const inputTokens = estimateTokens((prompt || "") + targetPlatform + duration);
    let outputTokens = 0;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `You are Nova, Director of the 3D Shorts Multimodal Lab in Moon Plaza (powered by Gemini Omni API concepts).
Create a complete 3D Short video production blueprint based on: "${prompt || "Tango Otter HQ and Ask-Meridian research"}"
Target Platform: ${targetPlatform}
Duration: ${duration}s

Return a JSON object:
{
  "title": "Viral 3D Short Title",
  "concept": "Engaging concept summary",
  "durationSeconds": ${duration},
  "targetPlatform": "${targetPlatform}",
  "cameraScript": "Camera movement script (e.g. 45-deg isometric orbit, slow tilt-shift, zoom on golden otter)",
  "spatialPrompt": "Gemini Omni 3D spatial render prompt describing lighting, materials, voxel physics",
  "habboAssetsRequired": ["Tango Otter Model", "Server Rack Neon", "Donation Pod", "Floating Gold Coins"],
  "viralHook": "Opening 3 seconds audio and visual hook",
  "monetizationCallToAction": "CTA directing to paypal.me/lk3mpe, mercadopago:lkempe, or ask-meridian.uk",
  "previewColor": "#10B981"
}`,
          config: {
            temperature: GEMINI_CONFIG.temperature,
            topP: GEMINI_CONFIG.topP,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          resultData = JSON.parse(response.text.trim());
          outputTokens = estimateTokens(response.text);
        }
      } catch (err) {
        console.warn("3D Short Gemini fallback:", err);
      }
    }

    if (!resultData) {
      resultData = {
        title: `3D Spatial Short: ${prompt ? prompt.slice(0, 25) : "Tango Otter Quantum Leap"}`,
        concept: `A 30-second hyper-stylized isometric 3D render of Moon Plaza with autonomous agents collaborating in real time.`,
        durationSeconds: duration,
        targetPlatform,
        cameraScript: `Starts with wide 35mm isometric lens -> zooms into Banner Sentinel neon pulses -> cuts to Tango Otter holding a golden clam -> ends on dual PayPal/MercadoPago telemetry pod.`,
        spatialPrompt: `Isometric 3D diorama of pixel-art headquarters, volumetric ray-tracing, glowing cyan circuits, warm amber ambient lighting.`,
        habboAssetsRequired: ["Tango Otter", "Banner Pod", "Quantum Server", "Gold Coin Cascade"],
        viralHook: `Can 3 autonomous AI characters run a multi-currency company on the blockchain?`,
        monetizationCallToAction: `Fuel the next research sprint at paypal.me/lk3mpe and MercadoPago:lkempe!`,
        previewColor: "#8B5CF6",
      };
      outputTokens = estimateTokens(JSON.stringify(resultData));
    }

    const totalTokens = inputTokens + outputTokens;
    const computeCost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

    res.json({
      ...resultData,
      tokenMetrics: {
        inputTokens,
        outputTokens,
        totalTokens,
        computeCostUsd: Number(computeCost.toFixed(6)),
        geminiConfig: GEMINI_CONFIG,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "3D Short generation failed" });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
