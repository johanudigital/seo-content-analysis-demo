import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SEOContentOutlineTool from './seo-content-outline-tool';
import './index.css';

ReactDOM.render(
  <Router>
    <SEOContentOutlineTool />
  </Router>,
  document.getElementById('root')
);
