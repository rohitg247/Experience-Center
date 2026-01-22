// src/components/settings/StartupAndDefaultPreferences.jsx
import {
  Zap,
  Thermometer,
  Volume2,
  Mic,
  Settings,
  Monitor,
  Blinds,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Lightbulb, Sun, Users, Video, Coffee } from "lucide-react";
import Toggle from "../ui/Toggle";
import Slider from "../ui/Slider";
import Button from "../ui/Button"; // Assuming Button component from '../ui/Button'

const lightingPresets = [
  {
    name: "Welcome",
    value: 1,
    icon: <Coffee size={18} />, // Using Coffee as per your original structure
    description: "Warm ambient lighting",
  },
  {
    name: "Presentation",
    value: 2,
    icon: <Sun size={18} />,
    description: "Bright task lighting",
  },
  {
    name: "Video Conference",
    value: 3,
    icon: <Video size={18} />,
    description: "Optimized for cameras",
  },
  {
    name: "Meeting",
    value: 4,
    icon: <Users size={18} />,
    description: "Balanced room lighting",
  },
];

const drapePositions = [
  { name: "Open", value: "open", icon: <Blinds size={16} /> },
  {
    name: "Closed",
    value: "closed",
    icon: <Blinds size={16} className="rotate-90" />,
  },
  {
    name: "As Is",
    value: "as-is",
    icon: <Blinds size={16} className="text-gray-500" />,
  },
];

const micStartupOptions = [
  { name: "BR Mic", key: "boardroomMicStartup" },
  { name: "TR Mic", key: "trainingMicStartup" },
  { name: "Wireless", key: "wirelessMicStartup" },
];

// Helper component for each setting group
const SettingGroup = ({
  icon: Icon,
  title,
  isEnabled,
  onToggle,
  children,
  isMicOrDrapes = false,
}) => (
  <div
    className={`p-4 rounded-lg transition-all ${
      isEnabled ? "bg-gray-50" : "bg-white border"
    }`}
  >
    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Icon
          size={20}
          className={isEnabled ? "text-primary" : "text-gray-400"}
        />
        <h3
          className={`font-semibold text-sm ${
            isEnabled ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {title}
        </h3>
      </div>
      <Toggle checked={isEnabled} onChange={onToggle} />
    </div>

    {isEnabled && (
      <div className={`pt-4 ${isMicOrDrapes ? "pb-2" : ""}`}>
        {/* <p className="text-xs font-medium text-gray-600 mb-2">Default Startup Value:</p> */}
        {children}
      </div>
    )}
  </div>
);

const StartupAndDefaultPreferences = ({
  settings,
  onToggle,
  onValueChange,
}) => {
  // Handlers for specific changes
  const handleLightingPresetChange = (presetValue) => {
    onValueChange("lightingPreset", presetValue);
  };

  const handleDrapesPositionChange = (position) => {
    onValueChange("drapesPosition", position);
  };

  const handleRoomSourceChange = (e) => {
    onValueChange("displaySource", e.target.value);
  };

  // NEW HANDLER for mic buttons (since they're toggle/multi-select)
  const handleMicStartupToggle = (key) => {
    // This toggles the specific boolean setting
    onValueChange(key, !settings[key]);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings size={20} />
          <span>Startup & Default Preferences</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">

        {/* --- Climate Control --- */}
        <SettingGroup
          icon={Thermometer}
          title="Climate Control"
          isEnabled={settings.climate}
          onToggle={() => onToggle("climate")}
        >
          <Slider
            value={settings.temperature}
            onChange={(value) => onValueChange("temperature", value)}
            min={16}
            max={30}
            step={1}
            label={`Default Temperature: ${settings.temperature}°C`}
            showValue={false}
          />
        </SettingGroup>
        {/* --- Lighting Control --- */}
        <SettingGroup
          icon={Zap}
          title="Lighting Control"
          isEnabled={settings.lighting}
          onToggle={() => onToggle("lighting")}
        >
          <div className="flex space-x-2">
            {lightingPresets.map((preset) => (
              <Button
                key={preset.value}
                variant={
                  settings.lightingPreset === preset.value
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                onClick={() => handleLightingPresetChange(preset.value)}
                className="flex-1"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </SettingGroup>
        {/* --- Audio/Volume Control --- */}
        <SettingGroup
          icon={Volume2}
          title="Audio/Volume"
          isEnabled={settings.audio}
          onToggle={() => onToggle("audio")}
        >
          <Slider
            value={settings.volume}
            onChange={(value) => onValueChange("volume", value)}
            min={0}
            max={100}
            step={5}
            label={`Default Volume: ${settings.volume}%`}
            showValue={false}
          />
        </SettingGroup>
        
        {/* --- Microphone Control --- */}       
        <SettingGroup
          icon={Mic}
          title="Microphone System"
          isEnabled={settings.microphones}
          onToggle={() => onToggle("microphones")}
          isMicOrDrapes={true}
        >
          {/* Title for clarity */}
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Mute on Startup Settings:            
          </h4>
          {/* 4-column grid for the buttons */}           
          <div className="grid grid-cols-3 gap-2">
                           
            {micStartupOptions.map((option) => (
              <Button
                key={option.key}
                // Use 'danger' (red) variant if the mic is set to be MUTED
                variant={settings[option.key] ? "danger" : "secondary"}
                size="sm"
                onClick={() => handleMicStartupToggle(option.key)} // Ensure button content aligns vertically if it wraps
                className="flex-1 flex flex-col space-y-1 items-center justify-center text-center p-2 h-auto min-h-[50px]"
              >
                                       
                <span className="text-xs font-medium leading-none">
                                            {option.name}                       
                </span>
                {/* Display the current state clearly */}
                        <span className="text-xs font-bold leading-none">
                            {settings[option.key] ? 'MUTED' : 'UNMUTED'}
                        </span>
                                   
              </Button>
            ))}
                       
          </div>
                 
        </SettingGroup>
        {/* --- Drapes/Shades Control --- */}
        <SettingGroup
          icon={Blinds}
          title="Drapes/Shades Control"
          isEnabled={settings.drapes}
          onToggle={() => onToggle("drapes")}
          isMicOrDrapes={true}
        >
          <div className="flex space-x-2">
            {drapePositions.map((position) => (
              <Button
                key={position.value}
                variant={
                  settings.drapesPosition === position.value
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                onClick={() => handleDrapesPositionChange(position.value)}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                {position.icon}
                <span>{position.name}</span>
              </Button>
            ))}
          </div>
        </SettingGroup>
      </CardContent>
    </Card>
  );
};

export default StartupAndDefaultPreferences;
