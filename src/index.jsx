import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './assets/css/masterstyle.css';

import { Amplify} from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: import.meta.env.AWS_REGION,
    userPoolId: import.meta.env.AWS_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.AWS_WEB_CLIENT_ID,
    mandatorySignIn: true
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
