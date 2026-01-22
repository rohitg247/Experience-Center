// src/pages/Settings.jsx (Updated Logic)
import { useState, useEffect, useCallback } from 'react'; // 🚨 NEW: Added useEffect and useCallback
import { Save, RotateCcw, Wifi, Settings, Info } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import DeviceStatus from '../components/settings/DeviceStatus';
import StartupAndDefaultPreferences from '../components/settings/StartupAndDefaultPreferences'; 

/* --- EXPORTED HEADER CONTENT COMPONENT (Remains the same) --- */
export const SettingsHeader = ({ onSave, onReset }) => {
  // ... (Header content is unchanged)
  return (
    <div className="flex items-center justify-between w-full max-w-[800px] py-1">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <Settings size={24} className="text-primary" />
        <div>
          <h1 className="text-xl font-bold text-primary">System Settings</h1>
          {/* <p className="text-sm text-gray-600">Configure system preferences and defaults</p> */}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          className="flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </Button>
      </div>
    </div>
  );
};
/* --- END EXPORTED HEADER CONTENT COMPONENT --- */

// 🚨 Define the initial default state outside the component
const INITIAL_DEFAULT_SETTINGS = {
  defaultRoom: 'combined-room',
  shutdownTimer: 30,
  enableLogging: true,
  offlineMode: false,
  
  // COMBINED PREFERENCES & DEFAULTS
  display: true,
  climate: true,
  lighting: true,
  audio: true,
  microphones: false,
  drapes: false,

  displaySource: 'content-share',
  volume: 65,
  temperature: 24,
  brightness: 80,
  lightingPreset: 1,
  microphonesMuted: false, // Updated reset value for consistency with current code
  drapesPosition: 'as-is',
};

// 🚨 Receive the onHandlersReady prop from App.jsx's ContentWrapper
const SettingsPage = ({ onHandlersReady }) => { 
  
  // 1. Initial State: Function to ensure state is initialized only once
  const [settings, setSettings] = useState(INITIAL_DEFAULT_SETTINGS);
  
  // 2. NEW: State to track the last successfully saved settings
  const [savedSettings, setSavedSettings] = useState(INITIAL_DEFAULT_SETTINGS);

  // Mock program info (Remains the same)
  const [programInfo] = useState({
    loadedPath: '/NVRAM/Program01/ConferenceControl_v2.1.0.lpz',
    lastProgramEditor: {
      name: 'John Smith',
      email: 'Test@actis.co.in'
    },
    lastUIEditor: {
      name: 'John Smith',
      email: 'Test@actis.co.in'
    },
    uploadDate: 'January 15, 2025',
    version: 'v2.1.0'
  });

  // Handler for simple settings (e.g., shutdownTimer) - not used for combined component
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handler for Toggling a device's startup preference
  const handleStartupToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handler for changing a device's default value (Slider, Select, Button Group)
  const handleDefaultValueChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 3. UPDATED: Save handler now updates savedSettings
  const handleSave = useCallback(() => {
    console.log('Saving settings:', settings);
    // 🚨 Commit current settings to savedSettings
    setSavedSettings(settings);
    // alert('Settings Saved Successfully!');
    // Save to Crestron joins here
  }, [settings]);

  // 4. UPDATED: Reset handler now resets to the LAST SAVED state
  const handleReset = useCallback(() => {
    console.log('Resetting settings to last saved state:', savedSettings);
    // 🚨 Reset the working settings state back to the last saved settings
    setSettings(savedSettings);
    alert('Settings Reset to Last Saved State');
  }, [savedSettings]);

  // 🎯 useEffect to pass handlers up to App.jsx/ContentWrapper
  useEffect(() => {
    onHandlersReady({ onSave: handleSave, onReset: handleReset });
  }, [onHandlersReady, handleSave, handleReset]); // Dependency array ensures it runs when handlers change
  
  // ... (roomOptions is unchanged)
  const roomOptions = [
    { value: 'combined-room', label: 'Combined Room' },
    { value: 'boardroom', label: 'Boardroom' },
    { value: 'training-room', label: 'Training Room' }
  ];

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-blue-200 to-white">
      <div className="h-full overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          {/* NEW: Startup and Default Preferences (Combined Component) */}
          <StartupAndDefaultPreferences 
            settings={settings}
            onToggle={handleStartupToggle}
            onValueChange={handleDefaultValueChange}
          />

          {/* Device Status - Full Width */}
          <div className="lg:col-span-1">
            <DeviceStatus />
          </div>
          
          {/* Connection Status - Keeping this for layout balance */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info size={20} />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-danger rounded-lg">
                <Wifi size={24} className="text-danger" />
                <div>
                  <h4 className="font-medium text-danger">Processor</h4>
                  <p className="text-sm text-danger">Not Connected</p>
                </div>
              </div>  
              {/* <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Wifi size={24} className="text-green-600" />
                <div>
                  <h4 className="font-medium text-green-700">Processor</h4>
                  <p className="text-sm text-green-600">Not Connected</p>
                </div>
              </div> */}
              
              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                {/* <div>
                  <div className="text-gray-600">Processor</div>
                  <div className="text-danger font-medium">Not Connected</div>
                </div> */}
                {/* <div>
                  <div className="text-gray-600">Network Status</div>
                  <div className="text-green-600 font-medium">Online</div>
                </div> */}
                <div>
                  <div className="text-gray-600">Last Program Update</div>
                  <div className="text-gray-800 font-medium">January 15, 2025</div>
                </div>
                <div>
                  <div className="text-gray-600">Last UI Update</div>
                  <div className="text-gray-800 font-medium">April 15, 2025</div>
                </div>
                <div>
                  <div className="font-medium text-primary mb-1">Last Program Editor</div>
                    <div className="text-gray-600">
                      <div className="text-gray-800">
                        {programInfo.lastProgramEditor.name}
                      </div>
                      <span className="text-xs text-gray-500">
                        {programInfo.lastProgramEditor.email}
                      </span>
                    </div>
                </div>
                <div>
                  <div className="font-medium text-primary mb-1">Last UI Editor</div>
                    <div className="text-gray-600">
                      <div className="text-gray-800">
                        {programInfo.lastUIEditor.name}
                      </div>
                      <span className="text-xs text-gray-500">
                        {programInfo.lastUIEditor.email}
                      </span>
                    </div>
                </div>
                <div className="col-span-2">
                <div className="font-medium text-primary mb-1 text-sm ">Loaded Program Path</div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono break-all ">
                  {programInfo.loadedPath}
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;