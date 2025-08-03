import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function Recommendation() {
  const [inputs, setInputs] = useState({
    interests: '',
    budget: '',
    location: '',
    type: '',
    hotel: '',
  });

  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { interests, budget, location, type, hotel } = inputs;
    if (!interests && !budget && !location && !type && !hotel) return;

    setLoading(true);
    setRecommendation('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You're a smart travel planner. Based on the user's preferences below, recommend ideal destinations, hotel types, and activities.

User Preferences:
- Interests: ${interests}
- Budget: ${budget}
- Location: ${location}
- Travel Type: ${type}
- Hotel Preferences: ${hotel}

Provide the suggestions in plain text (no markdown) with bullet points and short reasoning.
`;

      const result = await model.generateContent(prompt);
      const resText = await result.response.text();
      setRecommendation(resText.trim());
    } catch (err) {
      console.error('Gemini error:', err);
      setRecommendation('⚠️ Failed to generate travel suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-60 bg-pink-600 text-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-3">🌐 Travel Recommendation Engine</h1>
      <p className="text-pink-100 mb-6">Get personalized AI-based travel ideas based on your inputs</p>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="p-3 rounded-lg text-black bg-white"
          placeholder="🌴 Interests (e.g. beach, hiking)"
          onChange={(e) => handleChange('interests', e.target.value)}
        />
        <input
          className="p-3 rounded-lg text-black bg-white"
          placeholder="💰 Budget (e.g. ₹20k or $500)"
          onChange={(e) => handleChange('budget', e.target.value)}
        />
        <input
          className="p-3 rounded-lg text-black bg-white"
          placeholder="📍 Current location"
          onChange={(e) => handleChange('location', e.target.value)}
        />
        <input
          className="p-3 rounded-lg text-black bg-white"
          placeholder="🎯 Travel type (e.g. adventure, honeymoon)"
          onChange={(e) => handleChange('type', e.target.value)}
        />
        <input
          className="p-3 rounded-lg text-black bg-white md:col-span-2"
          placeholder="🏨 Hotel preference (e.g. budget, luxury)"
          onChange={(e) => handleChange('hotel', e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-white text-pink-600 font-semibold py-2 px-6 rounded-xl hover:bg-gray-100 transition-all"
      >
        {loading ? 'Generating...' : 'Get Recommendations'}
      </button>

      {recommendation && (
        <div className="mt-8 bg-white text-black p-6 rounded-xl whitespace-pre-wrap font-sans shadow-md leading-relaxed">
          {recommendation}
        </div>
      )}
    </div>
  );
}
