import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import logo from './assets/logo.jpeg';

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

  const analyzeContent = useCallback((text, type) => {
    let score = 0;
    let feedbackItems = [];

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minWordCount = type === 'blogPost' ? 300 : type === 'productDescription' ? 100 : 200;

    if (wordCount >= minWordCount) {
      score += 20;
      feedbackItems.push({ type: 'success', message: `Good ${type} length (${minWordCount}+ words)` });
    } else {
      feedbackItems.push({ type: 'error', message: `${type.charAt(0).toUpperCase() + type.slice(1)} is too short. Aim for ${minWordCount}+ words` });
    }

    if (text.slice(0, 100).toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
      feedbackItems.push({ type: 'success', message: "Keyword present in the introduction" });
    } else {
      feedbackItems.push({ type: 'error', message: "Include the keyword in the first 100 characters" });
    }

    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
      score += 15;
      feedbackItems.push({ type: 'success', message: "Good keyword density" });
    } else if (keywordDensity > 2.5) {
      feedbackItems.push({ type: 'error', message: "Keyword stuffing detected. Reduce keyword usage" });
    } else {
      feedbackItems.push({ type: 'warning', message: "Increase keyword usage slightly" });
    }

    if (type === 'blogPost') {
      const headingsCount = (text.match(/^#+\s.+$/gm) || []).length;
      if (headingsCount > 0) {
        score += 10;
        feedbackItems.push({ type: 'success', message: `${headingsCount} heading(s) detected` });
      } else {
        feedbackItems.push({ type: 'error', message: "Add headings (use # for h1, ## for h2, etc.)" });
      }

      const linksCount = (text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
      if (linksCount > 0) {
        score += 10;
        feedbackItems.push({ type: 'success', message: `${linksCount} link(s) detected` });
      } else {
        feedbackItems.push({ type: 'error', message: "Add internal or external links" });
      }

      const listsCount = (text.match(/^(-|\d+\.)\s.+$/gm) || []).length;
      if (listsCount > 0) {
        score += 10;
        feedbackItems.push({ type: 'success', message: `${listsCount} list item(s) detected` });
      } else {
        feedbackItems.push({ type: 'warning', message: "Consider adding bullet points or numbered lists" });
      }

      const imagesCount = (text.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length;
      if (imagesCount > 0) {
        score += 10;
        feedbackItems.push({ type: 'success', message: `${imagesCount} image(s) with alt text detected` });
      } else {
        feedbackItems.push({ type: 'warning', message: "Add images with descriptive alt text" });
      }
    }

    return { score, feedbackItems };
  }, [keyword]);

  const analyzeSEO = useCallback(debounce(() => {
    const { score, feedbackItems } = analyzeContent(content, 'blogPost');
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [content, analyzeContent]);

  const analyzeMeta = useCallback(debounce(() => {
    let titleFeedbackItems = [];
    let descriptionFeedbackItems = [];

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

    setMetaTitleFeedback(titleFeedbackItems);
    setMetaDescriptionFeedback(descriptionFeedbackItems);
  }, 500), [metaTitle, metaDescription, keyword]);

  const analyzeProductDescription = useCallback(debounce(() => {
    const { score, feedbackItems } = analyzeContent(productDescription, 'productDescription');
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [productDescription, analyzeContent]);

  const analyzeCategoryContent = useCallback(debounce(() => {
    const { score, feedbackItems } = analyzeContent(categoryContent, 'categoryContent');
    setSeoScore(score);
    setFeedback(feedbackItems);
  }, 500), [categoryContent, analyzeContent]);

  useEffect(() => {
    if (activeTab === 'blogPost' && content && keyword) {
      analyzeSEO();
    } else if (activeTab === 'metaContent' && (metaTitle || metaDescription)) {
      analyzeMeta();
    } else if (activeTab === 'productDescriptions' && productDescription && keyword) {
      analyzeProductDescription();
    } else if (activeTab === 'categoryPage' && categoryContent && keyword) {
      analyzeCategoryContent();
    }
  }, [activeTab, content, keyword, metaTitle, metaDescription, productDescription, categoryContent, analyzeSEO, analyzeMeta, analyzeProductDescription, analyzeCategoryContent]);

  const getProgressBarColor = useCallback((score) => {
    if (score < 40) return 'red';
    if (score < 70) return 'orange';
    return 'green';
  }, []);

  const FeedbackItem = useMemo(() => ({ item }) => (
    <li className={`feedback-item ${item.type}`}>
      {item.type === 'success' && '✅ '}
      {item.type === 'error' && '❌ '}
      {item.type === 'warning' && '⚠️ '}
      {item.message}
    </li>
  ), []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blogPost':
        return (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
            />
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
        );
      case 'metaContent':
        return (
          <>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title here..."
            />
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description here..."
            />
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
        );
      case 'productDescriptions':
        return (
          <>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description here..."
            />
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
        );
      case 'categoryPage':
        return (
          <>
            <textarea
              value={categoryContent}
              onChange={(e) => setCategoryContent(e.target.value)}
              placeholder="Enter category page content here..."
            />
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
        <h1>UDigital SEO Tool</h1>
      </header>
      <div className="tabs">
        {['blogPost', 'metaContent', 'productDescriptions', 'categoryPage'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter target keyword"
        />
      </div>
      {renderTabContent()}
    </div>
  );
};

export default SEOContentOutlineTool;
