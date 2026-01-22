// src/hooks/useJoin.js
import { useState, useEffect } from 'react';
import WebXPanel, { isActive } from '@crestron/ch5-webxpanel';
import mockJoins from '../mockJoins.json';

// const IS_DEV = false; // Use mock in browser dev, real on panel or external
// working
const IS_DEV = !isActive && !window.location.search.includes('ipid') && window.location.hostname === 'localhost';
// const IS_DEV = !isActive && !window.location.search.includes('ipid'); // Use mock in browser dev, real on panel or external

// IMPROVED: Safer CrComLib access pattern (from working version)
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
  const [state, setState] = useState(
    IS_DEV ? mockJoins.digital[joinNumber] ?? false : false
  );
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      if (!IS_DEV && !cr) {
        console.warn(`⚠️ Digital join ${joinNumber} - CrComLib not available`);
      }
      return;
    }

    if (IS_DEV) return; // skip backend subscription

    try {
      cr.subscribeState('b', String(joinNumber), (value) => {
        setState(Boolean(value));
      });
      return () => {
        cr.unsubscribeState('b', String(joinNumber));
      };
    } catch (error) {
      console.error(`❌ Error subscribing to digital join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  const toggle = () => {
    if (!cr && !IS_DEV) {
      console.warn(`⚠️ Cannot toggle digital join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      if (IS_DEV) {
        setState((prev) => !prev); // Toggle in mock mode
      } else {
        const newState = !state;
        cr.publishEvent('b', String(joinNumber), newState);
        setState(newState);
      }
    } catch (error) {
      console.error(`❌ Error toggling digital join ${joinNumber}:`, error);
    }
  };

  const setDigital = (value) => {
    if (!cr && !IS_DEV) {
      console.warn(`⚠️ Cannot set digital join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      const boolValue = Boolean(value);
      if (IS_DEV) {
        setState(boolValue);
      } else {
        cr.publishEvent('b', String(joinNumber), boolValue);
        setState(boolValue);
      }
    } catch (error) {
      console.error(`❌ Error setting digital join ${joinNumber}:`, error);
    }
  };

  return [state, toggle, setDigital];
}

//
// Analog Join Hook
//
export function useAnalogJoin(joinNumber, initialValue = 0) {
  const [value, setValue] = useState(
    IS_DEV ? mockJoins.analog[joinNumber] ?? initialValue : initialValue
  );
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      if (!IS_DEV && !cr) {
        console.warn(`⚠️ Analog join ${joinNumber} - CrComLib not available`);
      }
      return;
    }

    if (IS_DEV) return; // skip backend subscription

    try {
      cr.subscribeState('a', String(joinNumber), (val) => {
        setValue(Number(val));
      });
      return () => {
        cr.unsubscribeState('a', String(joinNumber));
      };
    } catch (error) {
      console.error(`❌ Error subscribing to analog join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  const setAnalog = (newValue) => {
    if (!cr && !IS_DEV) {
      console.warn(`⚠️ Cannot set analog join ${joinNumber} - CrComLib not available`);
      return;
    }
    if (!joinNumber && !IS_DEV) {
      console.warn(`⚠️ Cannot set analog join - joinNumber is undefined`);
      return;
    }
    try {
      const clampedValue = Math.max(0, Math.min(100, Number(newValue)));
      if (IS_DEV) {
        setValue(clampedValue);
      } else {
        cr.publishEvent('n', String(joinNumber), clampedValue);
        setValue(clampedValue);
      }
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
  const [text, setText] = useState(
    IS_DEV ? mockJoins.serial[joinNumber] ?? initialValue : initialValue
  );
  const cr = getCrComLib();

  useEffect(() => {
    if (!joinNumber || !cr) {
      if (!IS_DEV && !cr) {
        console.warn(`⚠️ Serial join ${joinNumber} - CrComLib not available`);
      }
      return;
    }

    if (IS_DEV) return; // skip backend subscription

    try {
      cr.subscribeState('s', String(joinNumber), (val) => {
        setText(String(val));
      });
      return () => {
        cr.unsubscribeState('s', String(joinNumber));
      };
    } catch (error) {
      console.error(`❌ Error subscribing to serial join ${joinNumber}:`, error);
    }
  }, [joinNumber, cr]);

  const sendText = (newText) => {
    if (!cr && !IS_DEV) {
      console.warn(`⚠️ Cannot send to serial join ${joinNumber} - CrComLib not available`);
      return;
    }
    try {
      const textValue = String(newText);
      if (IS_DEV) {
        setText(textValue);
      } else {
        cr.publishEvent('s', String(joinNumber), textValue);
        setText(textValue);
      }
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
  const [isOnline, setIsOnline] = useState(IS_DEV ? true : false);
  const [connectionStatus, setConnectionStatus] = useState(
    IS_DEV ? 'Development Mode' : 'Initializing'
  );

  useEffect(() => {
    if (!isActive) {
      setConnectionStatus(IS_DEV ? 'Development Mode' : 'Not Active');
      return;
    }

    const handleConnect = () => {
      setIsOnline(true);
      setConnectionStatus('Connected');
    };
    const handleDisconnect = () => {
      setIsOnline(false);
      setConnectionStatus('Disconnected');
    };
    const handleError = (err) => {
      console.error('❌ WebXPanel error:', err);
      setIsOnline(false);
      setConnectionStatus('Error');
    };

    WebXPanel.addEventListener('connect', handleConnect);
    WebXPanel.addEventListener('disconnect', handleDisconnect);
    WebXPanel.addEventListener('error', handleError);

    return () => {
      WebXPanel.removeEventListener('connect', handleConnect);
      WebXPanel.removeEventListener('disconnect', handleDisconnect);
      WebXPanel.removeEventListener('error', handleError);
    };
  }, []);

  return { isOnline, connectionStatus };
}
