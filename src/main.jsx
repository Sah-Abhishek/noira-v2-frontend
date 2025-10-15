import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { registerSW } from "virtual:pwa-register";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // keep it in .env


registerSW({ immediate: true }); // registers and auto-updates SW

const stripePromise = loadStripe("pk_test_51Ry9Da0BLQw7wGhoGMMnFQ99pxtSAflKbaJLzDDqtyZo9ftcoqnmrj8t1wkd6hYrYW5mTTwNLFuBrQj6v08mniPz00cuCGnWaa"); // your publishable key
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Elements stripe={stripePromise} >
      <App />

    </Elements>
  </GoogleOAuthProvider>


)
