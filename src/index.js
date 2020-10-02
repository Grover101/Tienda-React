import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'
import { FirebaseAppProvider } from 'reactfire'
import firebaseConfig from './components/firebase-config'

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Suspense fallback="Cargando...">
      <App />
    </Suspense>
  </FirebaseAppProvider>,
  document.getElementById('root')
);
