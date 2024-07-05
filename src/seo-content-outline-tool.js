import { useState, useEffect, useCallback, useMemo } from 'react';
import logo from './assets/logo.jpeg';

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SEOContentOutlineTool = () => {
  const [keyword, setKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitleFeedback, setMetaTitleFeedback] = useState([]);
  const [metaDescriptionFeedback, setMetaDescriptionFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('metaContent');
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (activeTab === 'metaContent' && (metaTitle || metaDescription)) {
      analyzeMeta();
    }
  }, [activeTab, metaTitle, metaDescription, analyzeMeta]);

const analyzeUrl = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAnalysis(data.analysis);
  } catch (error) {
    console.error('Error:', error);
    setAnalysis(error.message || 'An error occurred while analyzing the URL');
  }
  setLoading(false);
};



  const FeedbackItem = useMemo(() => ({ item }) => (
    <li className={`feedback-item ${item.type}`}>
      {item.type === 'success' && '✅ '}
      {item.type === 'error' && '❌ '}
      {item.type === 'warning' && '⚠️ '}
      {item.message}
    </li>
  ), []);

  const getTextColor = (length, thresholds) => {
    if (length > thresholds.red) return 'red';
    if (length > thresholds.orange) return 'orange';
    return 'inherit';
  };

  const GooglePreview = () => (
    <div className="google-preview">
      <div className="preview-title">{metaTitle || 'Enter a title to see preview'}</div>
      <div className="preview-url">https://www.example.com › page</div>
      <div className="preview-description">
        {metaDescription || 'Enter a description to see preview'}
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'metaContent') {
      const metaTitleColor = getTextColor(metaTitle.length, { orange: 60, red: 80 });
      const metaDescriptionColor = getTextColor(metaDescription.length, { orange: 160, red: 200 });

      return (
        <>
          <div className="input-wrapper">
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title here..."
              style={{ color: metaTitleColor }}
            />
            <span className="character-count" style={{ color: metaTitleColor }}>
              {metaTitle.length} / 60
            </span>
          </div>
          <div className="input-wrapper">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description here..."
              style={{ color: metaDescriptionColor }}
            />
            <span className="character-count textarea-count" style={{ color: metaDescriptionColor }}>
              {metaDescription.length} / 160
            </span>
          </div>

          <GooglePreview />
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
    } else if (activeTab === 'urlAnalysis') {
      return (
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to analyze"
          />
          <button onClick={analyzeUrl} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </button>
          {analysis && (
            <div>
              <h3>Analysis Result:</h3>
              <pre>{analysis}</pre>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
        <h1>UDigital Meta SEO Tool</h1>
      </header>
      <div className="tabs">
        <button
          onClick={() => setActiveTab('metaContent')}
          className={`tab ${activeTab === 'metaContent' ? 'active' : ''}`}
        >
          Meta Content
        </button>
        <button
          onClick={() => setActiveTab('urlAnalysis')}
          className={`tab ${activeTab === 'urlAnalysis' ? 'active' : ''}`}
        >
          URL Analysis
        </button>
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
