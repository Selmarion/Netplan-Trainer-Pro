import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { TaskConfig, ValidationResponse } from "../types";

// Initialize the client.
// NOTE: In a real production app, API keys should be handled via backend proxy.
// For this frontend-only demo, we access process.env.API_KEY directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateNetplanConfig = async (
  yamlContent: string,
  task: TaskConfig
): Promise<ValidationResponse> => {
  try {
    const prompt = `
    Ты - валидатор конфигураций Netplan для Ubuntu.
    
    ЗАДАЧА:
    Пользователь должен настроить статический IP адрес на LAN интерфейсе сервера так, чтобы он соответствовал заданию.
    
    ПАРАМЕТРЫ ЗАДАНИЯ:
    - Целевой IP сервера (LAN): ${task.serverLanIp}
    - Клиент, который пытается подключиться: ${task.clientIp} (должен быть в той же подсети, что и сервер)
    - WAN интерфейс (для справки): enp3s0
    - LAN интерфейс (который нужно настроить): enp4s0 (или eth1, или любой второй интерфейс)

    ТВОЯ ЦЕЛЬ:
    1. Проверить YAML синтаксис.
    2. Проверить, присвоен ли интерфейсу правильный IP адрес (${task.serverLanIp}).
    3. Если IP настроен верно, считаем, что клиент (${task.clientIp}) сможет подключиться (connectionSuccessful = true).
    
    ВХОДНОЙ YAML:
    ${yamlContent}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValidYaml: { type: Type.BOOLEAN, description: "Is the YAML syntax valid?" },
            syntaxCorrect: { type: Type.BOOLEAN, description: "Are netplan keys correct?" },
            connectionSuccessful: { type: Type.BOOLEAN, description: "Is the correct IP assigned to allow the client to connect?" },
            errors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific errors found (in Russian)"
            },
            explanation: { type: Type.STRING, description: "Brief educational explanation of what is wrong or right (in Russian)" },
          },
          required: ["isValidYaml", "syntaxCorrect", "connectionSuccessful", "errors", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ValidationResponse;

  } catch (error) {
    console.error("Validation error:", error);
    return {
      isValidYaml: false,
      syntaxCorrect: false,
      connectionSuccessful: false,
      errors: ["Ошибка соединения с AI сервисом проверки."],
      explanation: "Не удалось проверить конфигурацию. Проверьте подключение к интернету или API ключ."
    };
  }
};

export const explainNetplanConcepts = async (concept: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Объясни кратко и понятно для новичка концепцию Netplan: "${concept}". Отвечай на русском языке. Используй не более 3 предложений.`
        });
        return response.text || "Нет данных.";
    } catch (e) {
        return "Информация недоступна.";
    }
}
