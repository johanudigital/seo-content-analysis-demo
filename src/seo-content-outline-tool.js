import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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

  console.log('Rendering SEOContentOutlineTool');

  const analyzeMeta = useCallback(
    debounce(() => {
      let titleFeedbackItems = [];
      let descriptionFeedbackItems = [];

      const titleLength = metaTitle.length;
      if (titleLength >= 50 && titleLength <= 60) {
        titleFeedbackItems.push({ type: 'success', message: 'Good meta title length (50-60 characters)' });
      } else if (titleLength < 50) {
        titleFeedbackItems.push({ type: 'error', message: 'Meta title is too short. Aim for 50-60 characters' });
      } else {
        titleFeedbackItems.push({ type: 'error', message: 'Meta title is too long. Aim for 50-60 characters' });
      }

      if (metaTitle.toLowerCase().includes(keyword.toLowerCase())) {
        titleFeedbackItems.push({ type: 'success', message: 'Keyword present in meta title' });
      } else {
        titleFeedbackItems.push({ type: 'error', message: 'Include the keyword in the meta title' });
      }

      setMetaTitleFeedback(titleFeedbackItems);
      setMetaDescriptionFeedback(descriptionFeedbackItems);
    }, 500),
    [metaTitle, keyword, metaDescription]
  );

  useEffect(() => {
    analyzeMeta();
  }, [metaTitle, metaDescription, analyzeMeta]);

 const analyzeUrl = async () => {
  console.log('Analyzing URL:', url);
  setLoading(true);
  setAnalysis('');

  try {
    const response = await axios.post('/api/analyze', { url });
    console.log('Analysis response:', response.data);
    setAnalysis(response.data.analysis);
  } catch (error) {
    console.error('Error analyzing URL:', error);
    alert('There was an error analyzing the URL. Please try again later.');
  } finally {
    setLoading(false);
  }
};



  const renderTabContent = () => {
    console.log('Rendering tab content for:', activeTab);
    if (activeTab === 'metaContent') {
      return (
        <>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Enter meta title"
          />
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Enter meta description"
          />
          <div>
            <h4>Meta Title Feedback:</h4>
            <ul className="feedback">
              {metaTitleFeedback.map((item, index) => (
                <li key={index} className={item.type}>
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Meta Description Feedback:</h4>
            <ul className="feedback">
              {metaDescriptionFeedback.map((item, index) => (
                <li key={index} className={item.type}>
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    } else if (activeTab === 'urlAnalysis') {
      console.log('URL Analysis tab selected');
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
        <h1>SEO Content Analysis Tool</h1>
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
