import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { configure } from 'mobx';
import ChatProvider from './context/ChatProvider';
import { FacebookProvider } from 'react-facebook';
import { GoogleOAuthProvider } from '@react-oauth/google';

// configure({
//   enforceActions: 'always',
//   computedRequiresReaction: true,
//   reactionRequiresObservable: true,
//   observableRequiresReaction: true,
//   disableErrorBoundaries: true,
// });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ChatProvider>
      <GoogleOAuthProvider clientId="1076673518797-kaqm977mc6qeqpu7duqu115jqvt1n4ej.apps.googleusercontent.com">
        <FacebookProvider appId="1759450831238442">
          <App />
        </FacebookProvider>
      </GoogleOAuthProvider>
    </ChatProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
