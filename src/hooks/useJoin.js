// src/hooks/useJoin.js
import { useState, useEffect } from 'react';
import { isActive, WebXPanel } from '../main.jsx';

// FIXED: Access CrComLib the same way as TypeScript reference
const getCrComLib = () => {
  if (window.CrComLib) {
    // If CrComLib.CrComLib exists (nested), use it; otherwise use CrComLib directly
    return window.CrComLib.CrComLib || window.CrComLib;
  }
  return null;
};

//
// Digital Join Hook
//
export function useDigitalJoin(joinNumber) {
  const [state, setState] = useState(false);
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      console.warn(`⚠️ Digital join ${joinNumber} - CrComLib not available`);
      return;
    }

    try {
      console.log(`📡 Subscribing to digital join ${joinNumber}`);
      cr.subscribeState('b', String(joinNumber), (value) => {
        console.log(`📥 Digital join ${joinNumber} received:`, value);
        setState(Boolean(value));
      });

      return () => {
        cr.unsubscribeState('b', String(joinNumber));
        console.log(`🔌 Unsubscribed from digital join ${joinNumber}`);
      };
    } catch (error) {
      console.error(`❌ Error subscribing to digital join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  const toggle = () => {
    if (!cr) {
      console.warn(`⚠️ Cannot toggle digital join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      const newState = !state;
      console.log(`📤 Toggling digital join ${joinNumber} to:`, newState);
      setState(newState); // UI update first (optimistic)
      cr.publishEvent('b', String(joinNumber), newState); // Backend second
    } catch (error) {
      console.error(`❌ Error toggling digital join ${joinNumber}:`, error);
      setState(!newState); // Revert on error
    }
  };

  const setDigital = (value) => {
    if (!cr) {
      console.warn(`⚠️ Cannot set digital join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      const boolValue = Boolean(value);
      console.log(`📤 Setting digital join ${joinNumber} to:`, boolValue);
      setState(boolValue); // UI update first (optimistic)
      cr.publishEvent('b', String(joinNumber), boolValue); // Backend second
    } catch (error) {
      console.error(`❌ Error setting digital join ${joinNumber}:`, error);
      setState(!boolValue); // Revert on error
    }
  };

  return [state, toggle, setDigital];
}

//
// Analog Join Hook
//
// export function useAnalogJoin(joinNumber, initialValue = 0) {
//   const [value, setValue] = useState(initialValue);
//   const cr = getCrComLib();

//   useEffect(() => {
//     if (!joinNumber || !cr) {
//       console.warn(`⚠️ Analog join ${joinNumber} - CrComLib not available`);
//       return;
//     }

//     try {
//       console.log(`📡 Subscribing to analog join ${joinNumber}`);
//       cr.subscribeState('a', String(joinNumber), (val) => {
//         console.log(`📥 Analog join ${joinNumber} received:`, val);
//         setValue(Number(val));
//       });

//       return () => {
//         cr.unsubscribeState('a', String(joinNumber));
//         console.log(`🔌 Unsubscribed from analog join ${joinNumber}`);
//       };
//     } catch (error) {
//       console.error(`❌ Error subscribing to analog join ${joinNumber}:`, error);
//     }
//   }, [joinNumber, cr]);

//   const setAnalog = (newValue) => {
//     if (!cr) {
//       console.warn(`⚠️ Cannot set analog join ${joinNumber} - CrComLib not available`);
//       return;
//     }
//     try {
//       const clampedValue = Math.max(0, Math.min(65535, Number(newValue)));
//       console.log(`📤 Setting analog join ${joinNumber} to:`, clampedValue);
//       cr.publishEvent('a', String(joinNumber), clampedValue);
//       setValue(clampedValue);
//     } catch (error) {
//       console.error(`❌ Error setting analog join ${joinNumber}:`, error);
//     }
//   };

//   return [value, setAnalog];
// }

// export function useAnalogJoin(joinNumber, initialValue = 0) {
//   const [value, setValue] = useState(initialValue);
//   const cr = getCrComLib();

//   useEffect(() => {
//     if (!joinNumber || !cr) {
//       console.warn(`⚠️ Analog join ${joinNumber} - CrComLib not available`);
//       return;
//     }

//     try {
//       console.log(`📡 Subscribing to analog join ${joinNumber}`);
//       cr.subscribeState('a', String(joinNumber), (val) => {
//         console.log(`📥 Analog join ${joinNumber} received:`, val);
//         setValue(Number(val));
//       });

//       return () => {
//         cr.unsubscribeState('a', String(joinNumber));
//         console.log(`🔌 Unsubscribed from analog join ${joinNumber}`);
//       };
//     } catch (error) {
//       console.error(`❌ Error subscribing to analog join ${joinNumber}:`, error);
//     }
//   }, [joinNumber, cr]);

//   // FIX: Create setAnalog inside useEffect or ensure joinNumber is captured
//   const setAnalog = (newValue) => {
//     if (!cr) {
//       console.warn(`⚠️ Cannot set analog join ${joinNumber} - CrComLib not available`);
//       return;
//     }
//     if (!joinNumber) {
//       console.warn(`⚠️ Cannot set analog join - joinNumber is undefined`);
//       return;
//     }
//     try {
//       const clampedValue = Math.max(0, Math.min(65535, Number(newValue)));
//       console.log(`📤 Setting analog join ${joinNumber} to:`, clampedValue);
//       cr.publishEvent('a', String(joinNumber), clampedValue);
//       setValue(clampedValue);
//     } catch (error) {
//       console.error(`❌ Error setting analog join ${joinNumber}:`, error);
//     }
//   };

//   return [value, setAnalog];
// }

export function useAnalogJoin(joinNumber, initialValue = 0) {
  const [value, setValue] = useState(initialValue);
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      console.warn(`⚠️ Analog join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      console.log(`📡 Subscribing to analog join ${joinNumber}`);
      cr.subscribeState('a', String(joinNumber), (val) => {
        console.log(`📥 Analog join ${joinNumber} received:`, val);
        setValue(Number(val));
      });
      return () => {
        cr.unsubscribeState('a', String(joinNumber));
        console.log(`🔌 Unsubscribed from analog join ${joinNumber}`);
      };
    } catch (error) {
      console.error(`❌ Error subscribing to analog join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  // Simpler: joinNumber is captured as argument in setAnalog
  const setAnalog = (newValue) => {
    if (!cr) {
      console.warn(`⚠️ Cannot set analog join ${joinNumber} - CrComLib not available`);
      return;
    }
    if (!joinNumber) {
      console.warn(`⚠️ Cannot set analog join - joinNumber is undefined`);
      return;
    }
    try {
      const clampedValue = Math.max(0, Math.min(100, Number(newValue)));
      console.log(`📤 Setting analog join ${joinNumber} to: ${clampedValue}%`);
      setValue(clampedValue); // UI update first (optimistic)
      cr.publishEvent('n', String(joinNumber), clampedValue); // Backend second
      // const scaledValue = Math.max(0, Math.min(65535, Number(newValue)));
      // console.log(`📤 Setting analog join ${joinNumber} to: ${scaledValue}`);
      // cr.publishEvent('n', String(joinNumber), scaledValue);
      // setValue(scaledValue);
    } catch (error) {
      console.error(`❌ Error setting analog join ${joinNumber}:`, error);
    }
  };

  return [value, setAnalog];
}


//
// Serial Join Hook
//
export function useSerialJoin(joinNumber, initialValue = '') {
  const [text, setText] = useState(initialValue);
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      console.warn(`⚠️ Serial join ${joinNumber} - CrComLib not available`);
      return;
    }

    try {
      console.log(`📡 Subscribing to serial join ${joinNumber}`);
      cr.subscribeState('s', String(joinNumber), (val) => {
        console.log(`📥 Serial join ${joinNumber} received:`, val);
        setText(String(val));
      });

      return () => {
        cr.unsubscribeState('s', String(joinNumber));
        console.log(`🔌 Unsubscribed from serial join ${joinNumber}`);
      };
    } catch (error) {
      console.error(`❌ Error subscribing to serial join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  const sendText = (newText) => {
    if (!cr) {
      console.warn(`⚠️ Cannot send to serial join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      const textValue = String(newText);
      console.log(`📤 Sending to serial join ${joinNumber}:`, textValue);
      setText(textValue); // UI update first (optimistic)
      cr.publishEvent('s', String(joinNumber), textValue); // Backend second
    } catch (error) {
      console.error(`❌ Error sending to serial join ${joinNumber}:`, error);
    }
  };

  return [text, sendText];
}

//
// System Status Hook
//
export function useSystemStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Initializing');
  const cr = getCrComLib();

  useEffect(() => {
    if (!cr) {
      setConnectionStatus('CrComLib Not Available');
      return;
    }

    if (isActive) {
      setIsOnline(true);
      setConnectionStatus('Connected');
    } else {
      setConnectionStatus('Not Active');
    }
  }, [cr]);

  return { isOnline, connectionStatus };
}

//
// Crestron Connection Status Hook
// Monitors WebXPanel connection status for real-time processor connectivity feedback
//
export function useCrestronConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if WebXPanel is available
    if (!WebXPanel || typeof WebXPanel.addEventListener !== 'function') {
      setConnectionStatus('not_available');
      setError('WebXPanel not available');
      console.warn('⚠️ WebXPanel not available for connection monitoring');
      return;
    }

    const handleConnect = ({ detail }) => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      console.log('✅ Crestron processor connected:', detail);
    };

    const handleDisconnect = ({ detail }) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.warn('🔴 Crestron processor disconnected:', detail);
    };

    const handleError = ({ detail }) => {
      setIsConnected(false);
      setConnectionStatus('error');
      setError(detail);
      console.error('❌ Crestron connection error:', detail);
    };

    try {
      // WebXPanelEvents are imported from the WebXPanel module
      // Using string event names directly as a fallback
      WebXPanel.addEventListener('connectwebsocket', handleConnect);
      WebXPanel.addEventListener('disconnectwebsocket', handleDisconnect);
      WebXPanel.addEventListener('error', handleError);

      // Set initial status based on isActive
      if (isActive) {
        setIsConnected(true);
        setConnectionStatus('connected');
      }

      return () => {
        WebXPanel.removeEventListener('connectwebsocket', handleConnect);
        WebXPanel.removeEventListener('disconnectwebsocket', handleDisconnect);
        WebXPanel.removeEventListener('error', handleError);
      };
    } catch (error) {
      console.error('❌ Error setting up connection listeners:', error);
      setConnectionStatus('error');
      setError(error.message);
    }
  }, []);

  return { isConnected, connectionStatus, error };
}
