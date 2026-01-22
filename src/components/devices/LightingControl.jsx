import { Lightbulb, Sun, Users, Video, Coffee } from 'lucide-react';
import { useDigitalJoin, useAnalogJoin } from '../../hooks/useJoin';
import { DIGITAL_JOINS, ANALOG_JOINS } from '../../crestron/joins';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Slider from '../ui/Slider';

const LightingControl = () => {
  // Preset controls
  const [welcomeActive, toggleWelcome] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_WELCOME);
  const [presentationActive, togglePresentation] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_PRESENTATION);
  const [videoConfActive, toggleVideoConf] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_VIDEO_CONF);
  const [meetingActive, toggleMeeting] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_MEETING);
  const [allOffActive, toggleAllOff] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_ALL_OFF);

  // Brightness control
  const [brightness, setBrightness] = useAnalogJoin(ANALOG_JOINS.LIGHTS_BRIGHTNESS, 50);
  const brightnessPercent = brightness; // Already 0-100 from hook

  const handleBrightnessChange = (newPercent) => {
    setBrightness(newPercent); // Direct percentage
  };

  // Exclusive preset selection (modeled like SourceSelection)
  const handlePresetSelect = (presetKey, isActive) => {
    // If the same preset is clicked again, toggle it off
    if (isActive) {
      if (presetKey === 'welcome') toggleWelcome();
      if (presetKey === 'presentation') togglePresentation();
      if (presetKey === 'videoConf') toggleVideoConf();
      if (presetKey === 'meeting') toggleMeeting();
      return;
    }

    // Turn off all other presets
    if (welcomeActive && presetKey !== 'welcome') toggleWelcome();
    if (presentationActive && presetKey !== 'presentation') togglePresentation();
    if (videoConfActive && presetKey !== 'videoConf') toggleVideoConf();
    if (meetingActive && presetKey !== 'meeting') toggleMeeting();

    // Activate the selected preset
    if (presetKey === 'welcome') toggleWelcome();
    if (presetKey === 'presentation') togglePresentation();
    if (presetKey === 'videoConf') toggleVideoConf();
    if (presetKey === 'meeting') toggleMeeting();

    // Ensure "All Off" resets when any preset is active
    if (allOffActive) toggleAllOff();
  };

  // Handle “All Lights Off”
  const handleAllOff = () => {
    // If any preset is active, turn it off
    if (welcomeActive) toggleWelcome();
    if (presentationActive) togglePresentation();
    if (videoConfActive) toggleVideoConf();
    if (meetingActive) toggleMeeting();

    // Trigger all-off
    if (!allOffActive) toggleAllOff();
  };

  // Determine which preset is active for animation class
  const activeLightingClass =
    welcomeActive
      ? 'lighting-welcome-active'
      : presentationActive
      ? 'lighting-presentation-active'
      : videoConfActive
      ? 'lighting-videoconf-active'
      : meetingActive
      ? 'lighting-meeting-active'
      : '';

  // Define preset buttons
  const presets = [
    { name: 'Welcome', key: 'welcome', icon: <Coffee size={18} />, active: welcomeActive },
    { name: 'Presentation', key: 'presentation', icon: <Sun size={18} />, active: presentationActive },
    { name: 'Video Conference', key: 'videoConf', icon: <Video size={18} />, active: videoConfActive },
    { name: 'Meeting', key: 'meeting', icon: <Users size={18} />, active: meetingActive },
  ];

  return (
    <Card className={`device-card ${activeLightingClass} relative h-[350px]`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb size={20} />
          <span>Lighting Presets</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Lighting Presets */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={preset.active ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handlePresetSelect(preset.key, preset.active)}
              className="flex items-center space-x-2 text-xs h-auto py-2"
            >
              {preset.icon}
              <span>{preset.name}</span>
            </Button>
          ))}
        </div>

        {/* All Off Button */}
        <Button
          variant={allOffActive ? 'danger' : 'outline'}
          size="sm"
          onClick={handleAllOff}
          className="w-full"
        >
          All Lights Off
        </Button>

        {/* Brightness Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-primary">Light Level</h4>
            <span className="text-sm font-medium text-primary">{brightnessPercent}%</span>
          </div>

          <Slider
            value={brightnessPercent}
            onChange={handleBrightnessChange}
            min={0}
            max={100}
            step={5}
            showValue={false}
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>Dim</span>
            <span>Bright</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LightingControl;
