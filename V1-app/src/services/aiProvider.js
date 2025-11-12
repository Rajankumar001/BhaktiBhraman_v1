/**
 * AI Provider for Trip Cost Estimation
 * Supports multiple AI providers with fallback to deterministic estimation
 */

const AI_PROVIDERS = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  COHERE: "cohere",
  MISTRAL: "mistral",
};

// Configuration from environment variables
const AI_CONFIG = {
  provider: process.env.AI_PROVIDER || AI_PROVIDERS.OPENAI,
  apiKey: process.env.AI_API_KEY || null,
  model: process.env.AI_MODEL || "gpt-4o-mini",
};

/**
 * Generate trip cost estimate using AI API or fallback logic
 * @param {Object} tripData - Trip planning data
 * @returns {Promise<Object>} Cost estimate with breakdown and tips
 */
export async function getTripEstimate(tripData) {
  try {
    // If AI API key is available, use AI provider
    if (AI_CONFIG.apiKey) {
      return await getAIEstimate(tripData);
    } else {
      // Fallback to deterministic estimation
      return getDeterministicEstimate(tripData);
    }
  } catch (_error) {
    console.warn("AI estimation failed, using fallback:", _error.message);
    return getDeterministicEstimate(tripData);
  }
}

/**
 * Get estimate from AI provider
 */
async function getAIEstimate(tripData) {
  const prompt = createEstimationPrompt(tripData);

  let response;

  switch (AI_CONFIG.provider) {
    case AI_PROVIDERS.OPENAI:
      response = await callOpenAI(prompt);
      break;
    case AI_PROVIDERS.ANTHROPIC:
      response = await callAnthropic(prompt);
      break;
    case AI_PROVIDERS.COHERE:
      response = await callCohere(prompt);
      break;
    case AI_PROVIDERS.MISTRAL:
      response = await callMistral(prompt);
      break;
    default:
      throw new Error(`Unsupported AI provider: ${AI_CONFIG.provider}`);
  }

  // Parse and validate AI response
  const estimate = parseAIResponse(response);

  // Apply deterministic guards and caps
  return applyEstimationGuards(estimate, tripData);
}

/**
 * Create estimation prompt for AI
 */
function createEstimationPrompt(tripData) {
  return `
You are a travel cost estimation expert for temple trips in India. 

Trip Details:
- From: ${tripData.from}
- To Temple: ${tripData.toTemple}
- Travel Mode: ${tripData.travelMode}
- Duration: ${tripData.duration} days
- Travel Date: ${tripData.travelDate}
- Number of Travelers: ${tripData.travelers}
- Budget Level: ${tripData.budgetLevel}

Please provide a detailed cost breakdown in JSON format with the following structure:
{
  "breakdown": {
    "transportation": number,
    "accommodation": number,
    "food": number,
    "templeEntry": number,
    "localTransport": number,
    "miscellaneous": number
  },
  "total": number,
  "aiTips": ["tip1", "tip2"]
}

Consider:
- Current Indian travel costs (2024)
- Seasonal variations
- Budget level preferences
- Temple-specific costs
- Local transportation needs
- Accommodation options near temples

Provide 1-2 practical money-saving tips.
`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        {
          role: "system",
          content:
            "You are a travel cost estimation expert. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Anthropic API (Claude)
 */
async function callAnthropic(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": AI_CONFIG.apiKey,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Call Cohere API
 */
async function callCohere(prompt) {
  const response = await fetch("https://api.cohere.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere API error: ${response.status}`);
  }

  const data = await response.json();
  return data.generations[0].text;
}

/**
 * Call Mistral API
 */
async function callMistral(prompt) {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Parse AI response and extract JSON
 */
function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try parsing the whole response
    return JSON.parse(response);
  } catch (error) {
    throw new Error("Failed to parse AI response as JSON");
  }
}

/**
 * Deterministic fallback estimation
 */
function getDeterministicEstimate(tripData) {
  const travelers = parseInt(tripData.travelers) || 1;
  const duration = parseInt(tripData.duration) || 1;

  // Base costs per person per day (in INR)
  const baseCosts = {
    budget: {
      accommodation: 800,
      food: 500,
      local: 300,
    },
    medium: {
      accommodation: 1400,
      food: 700,
      local: 400,
    },
    luxury: {
      accommodation: 3000,
      food: 1200,
      local: 600,
    },
  };

  const budgetLevel = tripData.budgetLevel || "medium";
  const costs = baseCosts[budgetLevel];

  // Transportation costs (one-way, will be doubled)
  const transportCosts = {
    flight: 4000,
    train: 1500,
    car: 2000,
  };

  const transportation =
    (transportCosts[tripData.travelMode] || 2000) * 2 * travelers;
  const accommodation = costs.accommodation * duration * travelers;
  const food = costs.food * duration * travelers;
  const templeEntry = 100 * travelers;
  const localTransport = costs.local * duration * travelers;
  const miscellaneous = Math.round(
    (transportation + accommodation + food) * 0.1,
  );

  const total =
    transportation +
    accommodation +
    food +
    templeEntry +
    localTransport +
    miscellaneous;

  return {
    breakdown: {
      transportation,
      accommodation,
      food,
      templeEntry,
      localTransport,
      miscellaneous,
    },
    total,
    aiTips: [
      "Book accommodations 2-3 weeks in advance for better rates and availability.",
      "Consider traveling during weekdays to save 15-20% on hotel costs.",
    ],
  };
}

/**
 * Apply guards and caps to ensure reasonable estimates
 */
function applyEstimationGuards(estimate, tripData) {
  const travelers = parseInt(tripData.travelers) || 1;
  const duration = parseInt(tripData.duration) || 1;

  // Minimum and maximum bounds per person per day
  const bounds = {
    transportation: { min: 500, max: 15000 },
    accommodation: { min: 300, max: 5000 },
    food: { min: 200, max: 2000 },
    templeEntry: { min: 50, max: 500 },
    localTransport: { min: 100, max: 1000 },
    miscellaneous: { min: 100, max: 2000 },
  };

  // Apply bounds
  Object.keys(estimate.breakdown).forEach((key) => {
    if (bounds[key]) {
      const min =
        bounds[key].min * travelers * (key === "transportation" ? 1 : duration);
      const max =
        bounds[key].max * travelers * (key === "transportation" ? 1 : duration);

      estimate.breakdown[key] = Math.max(
        min,
        Math.min(max, estimate.breakdown[key]),
      );
    }
  });

  // Recalculate total
  estimate.total = Object.values(estimate.breakdown).reduce(
    (sum, cost) => sum + cost,
    0,
  );

  // Ensure tips are present
  if (!estimate.aiTips || estimate.aiTips.length === 0) {
    estimate.aiTips = [
      "Consider booking during off-peak seasons for better prices.",
      "Look for package deals that include accommodation and meals.",
    ];
  }

  return estimate;
}

export default {
  getTripEstimate,
  AI_PROVIDERS,
  AI_CONFIG,
};
