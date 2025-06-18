import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 스트릭 모드라 두 번 호출됨
  <React.StrictMode> 
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
