// src/components/devices/ContentShare.jsx

import { Wifi, Monitor, Square } from 'lucide-react';
import { useDigitalJoin } from '../../hooks/useJoin';
import { DIGITAL_JOINS } from '../../crestron/joins';
// Removed Card, CardHeader, CardTitle, CardContent imports
import Button from '../ui/Button';

// NOTE: This component is now designed to be rendered INSIDE a CardContent block.

const ContentShare = () => {
  const [wirelessActive, , , pressWireless, releaseWireless] = useDigitalJoin(DIGITAL_JOINS.CONTENT_WIRELESS);
  const [byodActive, , , pressBYOD, releaseBYOD] = useDigitalJoin(DIGITAL_JOINS.CONTENT_BYOD);
  const [, , , pressStop, releaseStop] = useDigitalJoin(DIGITAL_JOINS.CONTENT_STOP);

  // Handle content source selection - only one can be active at a time
  const handleSourceSelect = (sourceToggle, isCurrentlyActive) => {
    if (!isCurrentlyActive) {
      // If clicking an inactive source, deactivate the other one first
      // Assuming Wireless and Lectern are the two content share options for Zoom
      if (wirelessActive && sourceToggle !== toggleWireless) {
        toggleWireless();
      }
      if (byodActive && sourceToggle !== toggleBYOD) {
        toggleBYOD();
      }
    }
    // Then toggle the clicked source
    sourceToggle();
  };

  // Handle stopping content - deactivates the active source
  const handleStop = () => {
    if (wirelessActive) {
      toggleWireless();
    }
    if (byodActive) {
      toggleBYOD();
    }
    // Trigger Crestron stop join
    triggerStop();
  };

  const sources = [
    {
      name: 'Wireless',
      icon: Wifi,
      active: wirelessActive,
      toggle: () => handleSourceSelect(toggleWireless, wirelessActive),
      description: 'AirPlay / Miracast'
    },
    {
      name: 'Lectern', // Note: Renamed from BYOD for consistency/clarity, uses BYOD join
      icon: Monitor,
      active: byodActive,
      toggle: () => handleSourceSelect(toggleBYOD, byodActive),
      description: 'HDMI Connection'
    }
  ];

  const activeSource = sources.find(source => source.active);
  const isAnyActive = !!activeSource;

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700">Content Share (Zoom Active)</div>
      
      {/* The Content Source Buttons (Start) */}
      <div className="grid grid-cols-2 gap-3">
        {sources.map((source) => {
          const IconComponent = source.icon;
          return (
            <button
              key={source.name}
              onClick={source.toggle}
              className={`flex flex-col items-center justify-center space-y-2 h-20 rounded-lg border-2 transition-all font-medium ${
                source.active
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-primary hover:bg-gray-50'
              }`}
              // Disable if another source is active and this one is not the active one
              disabled={isAnyActive && !source.active} 
            >
              <IconComponent size={24} />
              <span className="text-sm">{source.name}</span>
            </button>
          );
        })}
      </div>

      {/* Stop Button / Status */}
      {activeSource ? (
        // Display Stop button when a content source is active
        <Button
          variant="danger"
          size="sm"
          onClick={handleStop}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Square size={16} />
          <span>Stop {activeSource.name} Share</span>
        </Button>
      ) : (
        // Display prompt when no content source is active
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="status-indicator offline mx-auto mb-2"></div>
          <div className="text-sm text-gray-600 font-medium">Select a Content Source</div>
          <div className="text-xs text-gray-500 mt-1">
            Choose one above to start sharing to the Zoom meeting.
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentShare;