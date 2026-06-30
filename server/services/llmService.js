const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LLMService {
  constructor() {
    this.geminiAi = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
    
    // Legacy OpenAI properties (will be deprecated as we move to Python ML)
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.timeout = 30000;
    this.maxRetries = 3;
  }

  // --- NEW GEMINI DYNAMIC QUIZ GENERATION --- //
  async generateDynamicQuiz(quizType) {
    if (!this.geminiAi) {
      console.warn("No GEMINI_API_KEY found, returning null to trigger fallback.");
      return null;
    }

    try {
      const model = this.geminiAi.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const numQuestions = quizType === 'interests' ? 15 : 20;
      const domain = quizType === 'interests' ? 'Personality, likes, and hobbies' : 'Sciences, Commerce, Arts, and Vocational skills';
      
      const prompt = `You are an expert career counselor crafting an engaging, dynamic student aptitude test.
      Generate EXACTLY ${numQuestions} unique quiz questions for evaluating a student's ${domain}.
      
      Your output MUST be a strict JSON array of objects using the exact following schema. 
      Important formatting rules:
      1. 'id' must be a unique integer.
      2. 'category' must be a string describing the question's topic.
      3. 'question' must be the clear question text.
      4. 'options' must be an array of EXACTLY 4 objects.
      5. Each option must have 'text' and 'weights' (which contains science, commerce, arts, vocational as integers from 0 to 3).
      
      Example Object Schema:
      [
        {
          "id": 1,
          "category": "Interests",
          "question": "What activity sounds the most fun?",
          "options": [
            { "text": "Building a robot", "weights": { "science": 3, "commerce": 0, "arts": 0, "vocational": 1 } },
            ...
          ]
        }
      ]
      
      Please return ONLY the JSON array without any markdown wrappers or backticks.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      // Clean up potential markdown formatting from Gemini
      let cleanedText = responseText;
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }

      const parsedQuestions = JSON.parse(cleanedText);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length !== numQuestions) {
        throw new Error(`Invalid generation structure or length. Expected ${numQuestions}, got ${parsedQuestions.length}`);
      }

      return parsedQuestions;

    } catch (error) {
      console.error("Gemini Quiz Generation Error:", error.message);
      return null; // Return null so the controller can fallback to static questions
    }
  }

  // --- LEGACY RECOMMENDATION METHODS (Moving to Python) --- //
  async generateRecommendations(studentProfile, eligibleCourses) {
    const startTime = Date.now();
    try {
      const prompt = this.buildPrompt(studentProfile, eligibleCourses);
      const response = await this.callLLM(prompt);
      return { success: true, recommendations: response.recommendations, processing_time: Date.now() - startTime };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        processing_time: Date.now() - startTime,
        fallback_recommendations: this.generateFallbackRecommendations(studentProfile, eligibleCourses)
      };
    }
  }

  buildPrompt(studentProfile, eligibleCourses) {
    const coursesText = eligibleCourses.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
    return `Generate 5 JSON course recommendations for ${studentProfile.name} in ${studentProfile.dominant_domain}.
    Options: ${coursesText}
    Format: { "recommendations": [ { "course": "name", "reason": "why", "score": 85, "rank": 1 } ] }`;
  }

  async callLLM(prompt) {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');
    const response = await axios.post(this.baseURL, {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, { headers: { 'Authorization': `Bearer ${this.apiKey}` } });
    return { recommendations: JSON.parse(response.data.choices[0].message.content).recommendations };
  }

  generateFallbackRecommendations(studentProfile, eligibleCourses) {
    const scoredCourses = eligibleCourses.map(course => {
      let score = 50;
      if (course.name.toLowerCase().includes(studentProfile.dominant_domain.toLowerCase())) score += 20;
      return { course: course.name, score: Math.min(100, score), reason: "Based on domain match.", rank: 0 };
    });
    scoredCourses.sort((a, b) => b.score - a.score);
    const top5 = scoredCourses.slice(0, 5);
    top5.forEach((c, i) => c.rank = i + 1);
    return top5;
  }

  validateRecommendations(recommendations, eligibleCourses) {
    return []; // Bypass validation for legacy fallback
  }
}

module.exports = new LLMService();
