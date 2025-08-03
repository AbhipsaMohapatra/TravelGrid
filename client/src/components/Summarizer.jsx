import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Function to clean markdown (##, **, etc.)
const cleanMarkdown = (text) => {
  return text
    .replace(/^#+\s?/gm, '') // remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/[*`_~]/g, '') // remove inline markdown symbols
    .trim();
};

export default function Summarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSummary('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You're an AI travel assistant. Based on the provided hotel or flight name and its description, generate a review summary with:

- Estimated Rating (out of 5)
- Customer Experience (1–2 lines)
- Pros (bulleted)
- Cons (bulleted)
- Overall Impression (1–2 lines)

Keep it structured and professional. No markdown formatting.

Input:
"${input}"
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();
      const cleaned = cleanMarkdown(rawText);
      setSummary(cleaned);
    } catch (error) {
      console.error('Gemini summarization failed:', error);
      setSummary('⚠️ Error generating summary. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-pink-600 text-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-3">✈️ AI Hotel & Flight Review Analyzer</h1>
      <p className="text-pink-100 mb-6">Enter a hotel or flight name with brief details to generate a summarized analysis.</p>

      <textarea
        className="w-full p-4 rounded-lg text-black text-base focus:outline-none h-32 resize-none shadow-md placeholder-gray-500 bg-gray-200"
        placeholder="e.g. Taj Hotel New Delhi - luxury hotel known for its service and ambience"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="mt-4 bg-white text-pink-600 font-semibold py-2 px-6 rounded-xl hover:bg-gray-100 transition-all"
      >
        {loading ? 'Analyzing...' : 'Analyze Review'}
      </button>

      {summary && (
        <div className="mt-8 bg-white text-black p-6 rounded-xl whitespace-pre-wrap font-sans shadow-md leading-relaxed">
          {summary}
        </div>
      )}
    </div>
  );
}
