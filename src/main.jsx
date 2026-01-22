// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/global.css';

// ✅ Import Crestron libraries
import * as WebXPanelModule from '@crestron/ch5-webxpanel';
import * as CrComLibModule from '@crestron/ch5-crcomlib';

// --- Correctly extract libraries ---
const { WebXPanel, isActive, WebXPanelEvents } = WebXPanelModule.getWebXPanel(true);
export { WebXPanel, isActive };

// --- Extract CrComLib ---
const CrComLib = CrComLibModule.CrComLib || CrComLibModule.default?.CrComLib || CrComLibModule;

// 🔥 CRITICAL FIX: Attach bridge functions for Crestron ONE mobile app
window.CrComLib = CrComLib;
window.bridgeReceiveBooleanFromNative = CrComLib.bridgeReceiveBooleanFromNative;
window.bridgeReceiveIntegerFromNative = CrComLib.bridgeReceiveIntegerFromNative;
window.bridgeReceiveStringFromNative = CrComLib.bridgeReceiveStringFromNative;
window.bridgeReceiveObjectFromNative = CrComLib.bridgeReceiveObjectFromNative;

export { CrComLib };

console.log('🚀 Starting Crestron React App');
console.log(`- WebXPanel isActive: ${isActive}`);
console.log(`- CrComLib available:`, !!CrComLib);
console.log(`- Bridge functions attached:`, !!window.bridgeReceiveBooleanFromNative);
console.log(`- Running on: ${window.location.hostname}`);
console.log(`- User Agent:`, navigator.userAgent);
console.log(`- runsInContainerApp:`, WebXPanelModule.runsInContainerApp());

// --- Core Initialization Logic ---
const initializeCrestron = () => {
  console.log('🔧 Initializing Crestron environment...');

  // 🔥 FIXED: Better detection for production vs development
  const isDevelopment = (
    window.location.hostname === '127.0.0.1' || 
    window.location.protocol === 'file:' ||
    (window.location.hostname === 'localhost' && window.location.port === '3000')
  );

  // 🔥 CRITICAL: Check if running in Crestron container app (mobile/touch panel)
  const isInContainerApp = WebXPanelModule.runsInContainerApp();

  console.log(`📊 Environment Detection:`);
  console.log(`  - isDevelopment: ${isDevelopment}`);
  console.log(`  - isInContainerApp: ${isInContainerApp}`);
  console.log(`  - isActive: ${isActive}`);

  // Initialize WebXPanel if NOT in development AND NOT in container app
  if (!isDevelopment && !isInContainerApp) {
    console.log('✅ WebXPanel environment detected. Initializing WebXPanel...');

    const configuration = {
      host: window.location.hostname,
      ipId: '0x03',
      roomId: '',
    };

    try {
      WebXPanel.initialize(configuration);
      console.log('✅ WebXPanel initialized successfully with config:', configuration);

      WebXPanel.addEventListener(WebXPanelEvents.CONNECT_CIP, ({ detail }) => {
        console.log('🟢 CONNECTED to Crestron Processor:', detail);
      });

      WebXPanel.addEventListener(WebXPanelEvents.DISCONNECT_CIP, ({ detail }) => {
        console.warn('🔴 DISCONNECTED from Crestron Processor:', detail);
      });

      WebXPanel.addEventListener(WebXPanelEvents.ERROR, ({ detail }) => {
        console.error('❌ WebXPanel ERROR:', detail);
      });

    } catch (error) {
      console.error('❌ Critical error initializing WebXPanel:', error);
    }

  } else if (isInContainerApp) {
    console.log('📱 Crestron ONE / Touch Panel detected. Using native bridge communication.');
    console.log('✅ Bridge functions ready for native app communication.');
    
  } else {
    console.warn('⚠️ Development environment detected. Skipping WebXPanel initialization.');
    console.log('💡 Tip: Use mock joins or connect to a test processor for development.');
  }

  renderApp();
};

// --- React Rendering Logic ---
const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found!');
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('✅ React app rendered.');
};

// --- Start the initialization process ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCrestron);
} else {
  initializeCrestron();
}
