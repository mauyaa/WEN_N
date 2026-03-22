import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, Position, WennIntelligence } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getWennIntelligence(
  marketData: MarketData[],
  currentPositions: Position[]
): Promise<WennIntelligence> {
  const model = "gemini-3-flash-preview";
  
  // Simulated Macro & On-Chain Context
  const macroContext = {
    dxy: 104.2,
    cpi: "3.2% (Forecast: 3.1%)",
    interestRate: "5.25-5.50%"
  };

  const onChainData = {
    btc: "Exchange Outflows: +$450M (Bullish)",
    eth: "Whale Accumulation: High (Bullish)",
    sol: "DEX Volume: ATH ($2.4B)"
  };

  const prompt = `
    You are WENN, the orchestrator of a world-class Multi-Agent Trading System.
    Your system consists of 4 specialized agents:
    1. THE TECHNICAL ANALYST: Focuses on RSI, MACD, Order Book Pressure, and Market Structure.
    2. THE SENTIMENT ANALYST: Scans Twitter, Reddit, and News for BTC, ETH, and SOL sentiment.
    3. THE RISK MANAGER: Sets dynamic stop-losses and position sizing based on volatility.
    4. THE EXECUTIONER: Synthesizes all data to find the optimal entry/exit.

    CURRENT MARKET DATA: ${JSON.stringify(marketData)}
    CURRENT POSITIONS: ${JSON.stringify(currentPositions)}
    MACRO CONTEXT: ${JSON.stringify(macroContext)}
    ON-CHAIN DATA: ${JSON.stringify(onChainData)}

    TASK:
    Conduct a "War Room" discussion between these agents. Each agent must provide their insight.
    Then, as WENN, provide the final execution command.

    RESPONSE FORMAT (JSON):
    {
      "thought": "Final synthesized strategy thought",
      "action": "OPEN_LONG" | "OPEN_SHORT" | "CLOSE_POSITION" | "HOLD",
      "coin": "BTC" | "ETH" | "SOL",
      "reason": "Detailed technical and fundamental justification",
      "stopLoss": 64000.50,
      "takeProfit": 68000.00,
      "consensusScore": 0.85, 
      "agents": [
        { "agent": "TECHNICAL", "insight": "...", "confidence": 0.95, "timestamp": "..." },
        { "agent": "SENTIMENT", "insight": "...", "confidence": 0.88, "timestamp": "..." },
        { "agent": "RISK", "insight": "...", "confidence": 0.92, "timestamp": "..." },
        { "agent": "EXECUTIONER", "insight": "...", "confidence": 0.90, "timestamp": "..." }
      ],
      "macroContext": ${JSON.stringify(macroContext)}
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thought: { type: Type.STRING },
            action: { type: Type.STRING },
            coin: { type: Type.STRING },
            reason: { type: Type.STRING },
            stopLoss: { type: Type.NUMBER },
            takeProfit: { type: Type.NUMBER },
            consensusScore: { type: Type.NUMBER },
            agents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agent: { type: Type.STRING },
                  insight: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  timestamp: { type: Type.STRING }
                }
              }
            },
            macroContext: {
              type: Type.OBJECT,
              properties: {
                dxy: { type: Type.NUMBER },
                cpi: { type: Type.STRING },
                interestRate: { type: Type.STRING }
              }
            }
          },
          required: ["thought", "action", "coin", "reason", "agents", "macroContext", "consensusScore"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Wenn Intelligence Error:", error);
    return {
      thought: "System recalibrating due to high volatility.",
      action: "HOLD",
      coin: "BTC",
      reason: "Waiting for clearer signals.",
      consensusScore: 0.5,
      agents: [],
      macroContext: macroContext
    };
  }
}

export async function getMarketNews() {
  const model = "gemini-3-flash-preview";
  const prompt = "Generate 3 short, realistic crypto news headlines for BTC, ETH, and SOL that would affect trading decisions right now.";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              headline: { type: "string" },
              impact: { type: "string", enum: ["BULLISH", "BEARISH", "NEUTRAL"] },
              coin: { type: "string" }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [];
  }
}
