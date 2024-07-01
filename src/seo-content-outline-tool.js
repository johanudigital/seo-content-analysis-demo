import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import logo from './assets/logo.jpeg'; // Adjust the path based on your project structure

const SEOContentOutlineTool = () => {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitleFeedback, setMetaTitleFeedback] = useState([]);
  const [metaDescriptionFeedback, setMetaDescriptionFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('blogPost');
  const [productDescription, setProductDescription] = useState('');
  const [categoryContent, setCategoryContent] = useState('');

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

  const analyzeProductDescription = useCallback(debounce(() => {
    let score = 0;
    let feedbackItems = [];

    // Product description length check
    const wordCount = productDescription.split(/\s+/).length;
    if (wordCount >= 100) {
      score += 20;
      feedbackItems.push({ type: 'success', message: "Good product description length (100+ words)" });
    } else {
      feedbackItems.push({ type: 'error', message: "Product description is too short. Aim for 100+ words" });
    }

    // Keyword presence in product description
    if (productDescription.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
      feedbackItems.push({ type: 'success', message: "Keyword present in product description" });
    } else {
      feedbackItems.push({ type: 'error', message: "Include the keyword in the product description" });
    }

    // Update state
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [productDescription, keyword]);

  const analyzeCategoryContent = useCallback(debounce(() => {
    let score = 0;
    let feedbackItems = [];

    // Category page content length check
    const wordCount = categoryContent.split(/\s+/).length;
    if (wordCount >= 200) {
      score += 20;
      feedbackItems.push({ type: 'success', message: "Good category page content length (200+ words)" });
    } else {
      feedbackItems.push({ type: 'error', message: "Category page content is too short. Aim for 200+ words" });
    }

    // Keyword presence in category content
    if (categoryContent.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
      feedbackItems.push({ type: 'success', message: "Keyword present in category content" });
    } else {
      feedbackItems.push({ type: 'error', message: "Include the keyword in the category content" });
    }

    // Update state
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [categoryContent, keyword]);

  useEffect(() => {
    if (content && keyword && activeTab === 'blogPost') {
      analyzeSEO();
    }
  }, [content, keyword, analyzeSEO, activeTab]);

  useEffect(() => {
    if ((metaTitle || metaDescription) && activeTab === 'metaContent') {
      analyzeMeta();
    }
  }, [metaTitle, metaDescription, analyzeMeta, activeTab]);

  useEffect(() => {
    if (productDescription && keyword && activeTab === 'productDescriptions') {
      analyzeProductDescription();
    }
  }, [productDescription, keyword, analyzeProductDescription, activeTab]);

  useEffect(() => {
    if (categoryContent && keyword && activeTab === 'categoryPage') {
      analyzeCategoryContent();
    }
  }, [categoryContent, keyword, analyzeCategoryContent, activeTab]);

  const getProgressBarColor = (score) => {
    if (score < 40) return 'red';
    if (score < 70) return 'orange';
    return 'green';
  };

  const FeedbackItem = ({ item }) => (
    <li className={`feedback-item ${item.type}`}>
      {item.type === 'success' && '✅ '}
      {item.type === 'error' && '❌ '}
      {item.type === 'warning' && '⚠️ '}
      {item.message}
    </li>
  );

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
        <h1>UDigital SEO Tool</h1>
      </header>
      <div className="tabs">
        <button
          onClick={() => setActiveTab('blogPost')}
          className={`tab ${activeTab === 'blogPost' ? 'active' : ''}`}
        >
          Blog Post
        </button>
        <button
          onClick={() => setActiveTab('metaContent')}
          className={`tab ${activeTab === 'metaContent' ? 'active' : ''}`}
        >
          Meta Content
        </button>
        <button
          onClick={() => setActiveTab('productDescriptions')}
          className={`tab ${activeTab === 'productDescriptions' ? 'active' : ''}`}
        >
          Product Descriptions
        </button>
        <button
          onClick={() => setActiveTab('categoryPage')}
          className={`tab ${activeTab === 'categoryPage' ? 'active' : ''}`}
        >
          Category Page
        </button>
      </div>
      {activeTab === 'blogPost' && (
        <>
          <div className="input-group">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter target keyword"
            />
          </div>
          <div className="input-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
            />
          </div>
          <div className="seo-score">
            <h2>SEO Score: {seoScore}/100</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${seoScore}%`, backgroundColor: getProgressBarColor(seoScore) }}
              ></div>
            </div>
          </div>
          <div>
            <h3>SEO Feedback:</h3>
            <ul className="feedback">
              {feedback.map((item, index) => (
                <FeedbackItem key={index} item={item} />
              ))}
            </ul>
          </div>
        </>
      )}
      {activeTab === 'metaContent' && (
        <>
          <div className="input-group">
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title here..."
            />
          </div>
          <div className="input-group">
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
                    <FeedbackItem key={index} item={item} />
                  ))}
                </ul>
              </>
            )}
            {metaDescription && (
              <>
                <h4>Meta Description Feedback:</h4>
                <ul className="feedback">
                  {metaDescriptionFeedback.map((item, index) => (
                    <FeedbackItem key={index} item={item} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
      {activeTab === 'productDescriptions' && (
        <>
          <div className="input-group">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter target keyword"
            />
          </div>
          <div className="input-group">
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description here..."
            />
          </div>
          <div className="seo-score">
            <h2>SEO Score: {seoScore}/100</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${seoScore}%`, backgroundColor: getProgressBarColor(seoScore) }}
              ></div>
            </div>
          </div>
          <div>
            <h3>SEO Feedback:</h3>
            <ul className="feedback">
              {feedback.map((item, index) => (
                <FeedbackItem key={index} item={item} />
              ))}
            </ul>
          </div>
        </>
      )}
      {activeTab === 'categoryPage' && (
        <>
          <div className="input-group">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter target keyword"
            />
          </div>
          <div className="input-group">
            <textarea
              value={categoryContent}
              onChange={(e) => setCategoryContent(e.target.value)}
              placeholder="Enter category page content here..."
            />
          </div>
          <div className="seo-score">
            <h2>SEO Score: {seoScore}/100</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${seoScore}%`, backgroundColor: getProgressBarColor(seoScore) }}
              ></div>
            </div>
          </div>
          <div>
            <h3>SEO Feedback:</h3>
            <ul className="feedback">
              {feedback.map((item, index) => (
                <FeedbackItem key={index} item={item} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SEOContentOutlineTool;
