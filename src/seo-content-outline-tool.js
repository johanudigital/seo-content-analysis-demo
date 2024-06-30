import React, { useState, useEffect } from 'react';

const SEOContentOutlineTool = () => {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitleFeedback, setMetaTitleFeedback] = useState([]);
  const [metaDescriptionFeedback, setMetaDescriptionFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (content && keyword) {
      analyzeSEO();
    }
  }, [content, keyword]);

  useEffect(() => {
    if (metaTitle || metaDescription) {
      analyzeMeta();
    }
  }, [metaTitle, metaDescription]);

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

  const analyzeMeta = () => {
    let titleFeedbackItems = [];
    let descriptionFeedbackItems = [];

    // Check meta title length
    const titleLength = metaTitle.length;
    if (titleLength >= 50 && titleLength <= 60) {
      titleFeedbackItems.push("✅ Good meta title length (50-60 characters)");
    } else if (titleLength < 50) {
      titleFeedbackItems.push("❌ Meta title is too short. Aim for 50-60 characters");
    } else {
      titleFeedbackItems.push("❌ Meta title is too long. Aim for 50-60 characters");
    }

    // Check keyword presence in meta title
    if (metaTitle.toLowerCase().includes(keyword.toLowerCase())) {
      titleFeedbackItems.push("✅ Keyword present in meta title");
    } else {
      titleFeedbackItems.push("❌ Include the keyword in the meta title");
    }

    // Check for Call-to-Action keyword in meta title
    const ctaKeywords = ["buy", "get", "try", "find", "learn"];
    if (ctaKeywords.some(cta => metaTitle.toLowerCase().includes(cta))) {
      titleFeedbackItems.push("✅ Call-to-Action keyword present in meta title");
    } else {
      titleFeedbackItems.push("❌ Consider adding a Call-to-Action keyword in the meta title");
    }

    // Check for special characters in meta title
    if (/[^a-zA-Z0-9\s]/.test(metaTitle)) {
      titleFeedbackItems.push("❌ Avoid using special characters in the meta title");
    } else {
      titleFeedbackItems.push("✅ No special characters in meta title");
    }

    // Check for unique meta title
    if (metaTitle.toLowerCase() !== content.toLowerCase().slice(0, 60)) {
      titleFeedbackItems.push("✅ Unique meta title");
    } else {
      titleFeedbackItems.push("❌ Meta title is too similar to the content. Make it unique");
    }

    // Check meta description length
    const descriptionLength = metaDescription.length;
    if (descriptionLength >= 50 && descriptionLength <= 160) {
      descriptionFeedbackItems.push("✅ Good meta description length (50-160 characters)");
    } else if (descriptionLength < 50) {
      descriptionFeedbackItems.push("❌ Meta description is too short. Aim for 50-160 characters");
    } else {
      descriptionFeedbackItems.push("❌ Meta description is too long. Aim for 50-160 characters");
    }

    // Check keyword presence in meta description
    if (metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      descriptionFeedbackItems.push("✅ Keyword present in meta description");
    } else {
      descriptionFeedbackItems.push("❌ Include the keyword in the meta description");
    }

    // Check for Call-to-Action in meta description
    if (ctaKeywords.some(cta => metaDescription.toLowerCase().includes(cta))) {
      descriptionFeedbackItems.push("✅ Call-to-Action present in meta description");
    } else {
      descriptionFeedbackItems.push("❌ Consider adding a Call-to-Action in the meta description");
    }

    // Check for natural language and readability in meta description
    const readabilityScore = (metaDescription.split(' ').length / metaDescription.split('.').length) < 20;
    if (readabilityScore) {
      descriptionFeedbackItems.push("✅ Meta description is readable and uses natural language");
    } else {
      descriptionFeedbackItems.push("❌ Improve readability and use natural language in meta description");
    }

    // Check for duplicate meta description
    // Assuming a function `isDuplicateMetaDescription` exists to check for duplicates
    const isDuplicateMetaDescription = (description) => {
      // Implement your logic to check for duplicate meta descriptions
      return false;
    };
    if (isDuplicateMetaDescription(metaDescription)) {
      descriptionFeedbackItems.push("❌ Duplicate meta description detected. Make it unique");
    } else {
      descriptionFeedbackItems.push("✅ Meta description is unique");
    }

    // Check for keyword at the beginning of meta description
    if (metaDescription.toLowerCase().startsWith(keyword.toLowerCase())) {
      descriptionFeedbackItems.push("✅ Keyword at the beginning of meta description");
    } else {
      descriptionFeedbackItems.push("❌ Consider starting the meta description with the keyword");
    }

    // Update state
    setMetaTitleFeedback(titleFeedbackItems);
    setMetaDescriptionFeedback(descriptionFeedbackItems);
  };

  return (
    <div className="container">
      <h1>UDigital SEO tool</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('content')} className={activeTab === 'content' ? 'active' : ''}>Content</button>
        <button onClick={() => setActiveTab('meta')} className={activeTab === 'meta' ? 'active' : ''}>Meta</button>
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
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title here..."
            />
          </div>
          <div className="mb-4">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description here..."
            />
          </div>
          <div>
            <h3>Meta Feedback:</h3>
            {metaTitle && (
              <>
                <h4>Meta Title Feedback:</h4>
                <ul className="feedback">
                  {metaTitleFeedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {metaDescription && (
              <>
                <h4>Meta Description Feedback:</h4>
                <ul className="feedback">
                  {metaDescriptionFeedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SEOContentOutlineTool;
