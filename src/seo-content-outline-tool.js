import React, { useState, useEffect } from 'react';

const SEOContentOutlineTool = () => {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [metaDescription, setMetaDescription] = useState('');
  const [metaFeedback, setMetaFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (content && keyword) {
      analyzeSEO();
    }
  }, [content, keyword]);

  useEffect(() => {
    if (metaDescription) {
      analyzeMetaDescription();
    }
  }, [metaDescription]);

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

  const analyzeMetaDescription = () => {
    let feedbackItems = [];

    // Check meta description length
    const length = metaDescription.length;
    if (length >= 50 && length <= 160) {
      feedbackItems.push("✅ Good meta description length (50-160 characters)");
    } else if (length < 50) {
      feedbackItems.push("❌ Meta description is too short. Aim for 50-160 characters");
    } else {
      feedbackItems.push("❌ Meta description is too long. Aim for 50-160 characters");
    }

    // Check keyword presence in meta description
    if (metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      feedbackItems.push("✅ Keyword present in meta description");
    } else {
      feedbackItems.push("❌ Include the keyword in the meta description");
    }

    // Update state
    setMetaFeedback(feedbackItems);
  };

  return (
    <div className="container">
      <h1>UDigital SEO Checker</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('content')} className={activeTab === 'content' ? 'active' : ''}>Content</button>
        <button onClick={() => setActiveTab('meta')} className={activeTab === 'meta' ? 'active' : ''}>Meta Description</button>
      </div>
      {activeTab === 'content' && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter target keyword"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
            />
          </div>
          <div className="seo-score">
            <h2>SEO Score: {seoScore}/100</h2>
            <div className="progress-bar">
              <div className="progress-bar-inner" style={{ width: `${seoScore}%` }}></div>
            </div>
          </div>
          <div>
            <h3>SEO Feedback:</h3>
            <ul className="feedback">
              {feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {activeTab === 'meta' && (
        <>
          <div className="mb-4">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description here..."
            />
          </div>
          <div>
            <h3>Meta Description Feedback:</h3>
            <ul className="feedback">
              {metaFeedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SEOContentOutlineTool;
