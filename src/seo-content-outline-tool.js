import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

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

  const analyzeSEO = useCallback(debounce(() => {
    let score = 0;
    let feedbackItems = [];

    // Content length check
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 300) {
      score += 20;
      feedbackItems.push({ type: 'success', message: "Good content length (300+ words)" });
    } else {
      feedbackItems.push({ type: 'error', message: "Content is too short. Aim for 300+ words" });
    }

    // Keyword presence in introduction
    if (content.slice(0, 100).toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
      feedbackItems.push({ type: 'success', message: "Keyword present in the introduction" });
    } else {
      feedbackItems.push({ type: 'error', message: "Include the keyword in the first 100 characters" });
    }

    // Keyword density
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
      score += 15;
      feedbackItems.push({ type: 'success', message: "Good keyword density" });
    } else if (keywordDensity > 2.5) {
      feedbackItems.push({ type: 'error', message: "Keyword stuffing detected. Reduce keyword usage" });
    } else {
      feedbackItems.push({ type: 'warning', message: "Increase keyword usage slightly" });
    }

    // Headings check
    const headingsRegex = /^#+\s.+$/gm;
    const headingsCount = (content.match(headingsRegex) || []).length;
    if (headingsCount > 0) {
      score += 10;
      feedbackItems.push({ type: 'success', message: `${headingsCount} heading(s) detected` });
    } else {
      feedbackItems.push({ type: 'error', message: "Add headings (use # for h1, ## for h2, etc.)" });
    }

    // Links check
    const linksRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linksCount = (content.match(linksRegex) || []).length;
    if (linksCount > 0) {
      score += 10;
      feedbackItems.push({ type: 'success', message: `${linksCount} link(s) detected` });
    } else {
      feedbackItems.push({ type: 'error', message: "Add internal or external links" });
    }

    // Lists check
    const listsRegex = /^(-|\d+\.)\s.+$/gm;
    const listsCount = (content.match(listsRegex) || []).length;
    if (listsCount > 0) {
      score += 10;
      feedbackItems.push({ type: 'success', message: `${listsCount} list item(s) detected` });
    } else {
      feedbackItems.push({ type: 'warning', message: "Consider adding bullet points or numbered lists" });
    }

    // Image alt text check
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const imagesCount = (content.match(imageRegex) || []).length;
    if (imagesCount > 0) {
      score += 10;
      feedbackItems.push({ type: 'success', message: `${imagesCount} image(s) with alt text detected` });
    } else {
      feedbackItems.push({ type: 'warning', message: "Add images with descriptive alt text" });
    }

    // Update state
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [content, keyword]);

  const analyzeMeta = useCallback(debounce(() => {
    let titleFeedbackItems = [];
    let descriptionFeedbackItems = [];

    // Meta title checks
    const titleLength = metaTitle.length;
    if (titleLength >= 50 && titleLength <= 60) {
      titleFeedbackItems.push({ type: 'success', message: "Good meta title length (50-60 characters)" });
    } else if (titleLength < 50) {
      titleFeedbackItems.push({ type: 'error', message: "Meta title is too short. Aim for 50-60 characters" });
    } else {
      titleFeedbackItems.push({ type: 'error', message: "Meta title is too long. Aim for 50-60 characters" });
    }

    if (metaTitle.toLowerCase().includes(keyword.toLowerCase())) {
      titleFeedbackItems.push({ type: 'success', message: "Keyword present in meta title" });
    } else {
      titleFeedbackItems.push({ type: 'error', message: "Include the keyword in the meta title" });
    }

    const ctaKeywords = ["buy", "get", "try", "find", "learn"];
    if (ctaKeywords.some(cta => metaTitle.toLowerCase().includes(cta))) {
      titleFeedbackItems.push({ type: 'success', message: "Call-to-Action keyword present in meta title" });
    } else {
      titleFeedbackItems.push({ type: 'warning', message: "Consider adding a Call-to-Action keyword in the meta title" });
    }

    // Meta description checks
    const descriptionLength = metaDescription.length;
    if (descriptionLength >= 50 && descriptionLength <= 160) {
      descriptionFeedbackItems.push({ type: 'success', message: "Good meta description length (50-160 characters)" });
    } else if (descriptionLength < 50) {
      descriptionFeedbackItems.push({ type: 'error', message: "Meta description is too short. Aim for 50-160 characters" });
    } else {
      descriptionFeedbackItems.push({ type: 'error', message: "Meta description is too long. Aim for 50-160 characters" });
    }

    if (metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      descriptionFeedbackItems.push({ type: 'success', message: "Keyword present in meta description" });
    } else {
      descriptionFeedbackItems.push({ type: 'error', message: "Include the keyword in the meta description" });
    }

    if (ctaKeywords.some(cta => metaDescription.toLowerCase().includes(cta))) {
      descriptionFeedbackItems.push({ type: 'success', message: "Call-to-Action present in meta description" });
    } else {
      descriptionFeedbackItems.push({ type: 'warning', message: "Consider adding a Call-to-Action in the meta description" });
    }

    // Update state
    setMetaTitleFeedback(titleFeedbackItems);
    setMetaDescriptionFeedback(descriptionFeedbackItems);
  }, 500), [metaTitle, metaDescription, keyword]);

  useEffect(() => {
    if (content && keyword) {
      analyzeSEO();
    }
  }, [content, keyword, analyzeSEO]);

  useEffect(() => {
    if (metaTitle || metaDescription) {
      analyzeMeta();
    }
  }, [metaTitle, metaDescription, analyzeMeta]);

  const FeedbackItem = ({ item }) => (
    <li className={`feedback-item ${item.type}`}>
      {item.type === 'success' && '✅ '}
      {item.type === 'error' && '❌ '}
      {item.type === 'warning' && '⚠️ '}
      {item.message}
    </li>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">UDigital SEO Tool</h1>
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('content')}
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('meta')}
          className={`px-4 py-2 rounded ${activeTab === 'meta' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Meta
        </button>
      </div>
      {activeTab === 'content' && (
        <>
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
              className="w-full p-2 border rounded h-64"
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">SEO Score: {seoScore}/100</h2>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
                style={{ width: `${seoScore}%` }}
              >
                {seoScore}%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">SEO Feedback:</h3>
            <ul className="space-y-2">
              {feedback.map((item, index) => (
                <FeedbackItem key={index} item={item} />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description here..."
              className="w-full p-2 border rounded h-32"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Meta Feedback:</h3>
            {metaTitle && (
              <>
                <h4 className="font-bold mt-4 mb-2">Meta Title Feedback:</h4>
                <ul className="space-y-2">
                  {metaTitleFeedback.map((item, index) => (
                    <FeedbackItem key={index} item={item} />
                  ))}
                </ul>
              </>
            )}
            {metaDescription && (
              <>
                <h4 className="font-bold mt-4 mb-2">Meta Description Feedback:</h4>
                <ul className="space-y-2">
                  {metaDescriptionFeedback.map((item, index) => (
                    <FeedbackItem key={index} item={item} />
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
