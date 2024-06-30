import React, { useState, useEffect } from 'react';

const SEOContentOutlineTool = () => {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (content && keyword) {
      analyzeSEO();
    }
  }, [content, keyword]);

  const analyzeSEO = () => {
    let score = 0;
    let feedbackItems = [];

    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 300) {
      score += 20;
      feedbackItems.push("✅ Good content length (300+ words)");
    } else {
      feedbackItems.push("❌ Content is too short. Aim for 300+ words");
    }

    // Check keyword presence in the first 100 characters
    if (content.slice(0, 100).toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
      feedbackItems.push("✅ Keyword present in the introduction");
    } else {
      feedbackItems.push("❌ Include the keyword in the first 100 characters");
    }

    // Check keyword density
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
      score += 15;
      feedbackItems.push("✅ Good keyword density");
    } else if (keywordDensity > 2.5) {
      feedbackItems.push("❌ Keyword stuffing detected. Reduce keyword usage");
    } else {
      feedbackItems.push("❌ Increase keyword usage slightly");
    }

    // Check for headings
    if (content.includes('#')) {
      score += 10;
      feedbackItems.push("✅ Headings detected");
    } else {
      feedbackItems.push("❌ Add headings (use # for h1, ## for h2, etc.)");
    }

    // Check for links
    if (content.includes('http') || content.includes('www')) {
      score += 10;
      feedbackItems.push("✅ Links detected");
    } else {
      feedbackItems.push("❌ Add internal or external links");
    }

    // Check for bullet points or numbered lists
    if (content.includes('-') || content.includes('1.')) {
      score += 10;
      feedbackItems.push("✅ Lists detected");
    } else {
      feedbackItems.push("❌ Consider adding bullet points or numbered lists");
    }

    // Check for image alt text (simulated)
    if (content.includes('![') && content.includes('](')) {
      score += 10;
      feedbackItems.push("✅ Image with alt text detected");
    } else {
      feedbackItems.push("❌ Add images with descriptive alt text");
    }

    // Update state
    setSeoScore(score);
    setFeedback(feedbackItems);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SEO Content Outline Tool</h1>
      <div className="mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter target keyword"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content here..."
          className="w-full h-64 p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">SEO Score: {seoScore}/100</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${seoScore}%`}}></div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">SEO Feedback:</h3>
        <ul className="list-disc pl-5">
          {feedback.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
