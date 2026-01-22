// src/components/devices/DrapesControl.jsx

import { Blinds, ChevronUp, ChevronDown, Square } from 'lucide-react';
import { useDigitalJoin, useAnalogJoin } from '../../hooks/useJoin';
import { DIGITAL_JOINS, ANALOG_JOINS } from '../../crestron/joins';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const DrapesControl = ({ isModalContent = false }) => { 
  
  // Digital controls
  const [drapesUp, triggerUp] = useDigitalJoin(DIGITAL_JOINS.DRAPES_UP);
  const [drapesDown, triggerDown] = useDigitalJoin(DIGITAL_JOINS.DRAPES_DOWN);
  const [drapesStop, triggerStop] = useDigitalJoin(DIGITAL_JOINS.DRAPES_STOP);
  
  // Analog position controls for display
  const [allPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_ALL, 0);
  const [leftPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_LEFT, 0);
  const [centerPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_CENTER, 0);
  const [rightPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_RIGHT, 0);

  // Convert analog values to percentages
  const positions = {
    all: Math.round((allPosition / 65535) * 100),
    left: Math.round((leftPosition / 65535) * 100),
    center: Math.round((centerPosition / 65535) * 100),
    right: Math.round((rightPosition / 65535) * 100)
  };

  // Individual section digital controls (you'll need to add these to your joins.js)
  const [, triggerLeftUp] = useDigitalJoin(DIGITAL_JOINS.DRAPES_LEFT_UP || 71);
  const [, triggerLeftStop] = useDigitalJoin(DIGITAL_JOINS.DRAPES_LEFT_STOP || 72);
  const [, triggerLeftDown] = useDigitalJoin(DIGITAL_JOINS.DRAPES_LEFT_DOWN || 73);
  
  const [, triggerCenterUp] = useDigitalJoin(DIGITAL_JOINS.DRAPES_CENTER_UP || 74);
  const [, triggerCenterStop] = useDigitalJoin(DIGITAL_JOINS.DRAPES_CENTER_STOP || 75);
  const [, triggerCenterDown] = useDigitalJoin(DIGITAL_JOINS.DRAPES_CENTER_DOWN || 76);
  
  const [, triggerRightUp] = useDigitalJoin(DIGITAL_JOINS.DRAPES_RIGHT_UP || 77);
  const [, triggerRightStop] = useDigitalJoin(DIGITAL_JOINS.DRAPES_RIGHT_STOP || 78);
  const [, triggerRightDown] = useDigitalJoin(DIGITAL_JOINS.DRAPES_RIGHT_DOWN || 79);

  const drapesSections = [
    {
      name: 'All Shades',
      key: 'all',
      position: positions.all,
      controls: {
        up: triggerUp,
        stop: triggerStop,
        down: triggerDown
      }
    },
    {
      name: 'Left',
      key: 'left',
      position: positions.left,
      controls: {
        up: triggerLeftUp,
        stop: triggerLeftStop,
        down: triggerLeftDown
      }
    },
    {
      name: 'Center',
      key: 'center',
      position: positions.center,
      controls: {
        up: triggerCenterUp,
        stop: triggerCenterStop,
        down: triggerCenterDown
      }
    },
    {
      name: 'Right',
      key: 'right',
      position: positions.right,
      controls: {
        up: triggerRightUp,
        stop: triggerRightStop,
        down: triggerRightDown
      }
    }
  ];

  // Modal Content
  const modalContent = (
    <div className="space-y-6">
      {/* Individual Shade Controls */}
      <div className="grid grid-cols-4 gap-4">
        {drapesSections.map((section) => (
          <div key={section.key} className="flex flex-col space-y-3">
            {/* Section Header */}
            <div className="text-center pb-2 border-b border-gray-200">
              <h4 className="font-semibold text-primary text-sm">{section.name}</h4>
              {/* <span className="text-xs text-gray-600">{section.position}% Open</span> */}
            </div>
            
            {/* Control Buttons - Vertical Stack */}
            <div className="flex flex-col space-y-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={section.controls.up}
                className="flex flex-col items-center justify-center py-3 h-auto"
              >
                <ChevronUp size={20} />
                <span className="text-xs mt-1">Up</span>
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={section.controls.stop}
                className="flex flex-col items-center justify-center py-3 h-auto"
              >
                <Square size={20} />
                <span className="text-xs mt-1">Stop</span>
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={section.controls.down}
                className="flex flex-col items-center justify-center py-3 h-auto"
              >
                <ChevronDown size={20} />
                <span className="text-xs mt-1">Down</span>
              </Button>
            </div>

            {/* Position Indicator */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${section.position}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // If used inside modal
  if (isModalContent) {
    return (
      <div className="space-y-4">
        {/* <h2 className="text-2xl font-bold mb-4">Drapes Control</h2> */}
        {modalContent}
      </div>
    );
  }

  // If used on main grid - Quick Controls Card
  return (
    <Card className="device-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Blinds size={20} />
          <span >Drapes Control</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerUp}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <ChevronUp size={16} />
            <span className="text-xs">Up</span>
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerStop}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Square size={16} />
            <span className="text-xs">Stop</span>
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerDown}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <ChevronDown size={16} />
            <span className="text-xs">Down</span>
          </Button>
        </div>

        {/* Position Summary */}
        <div className="text-center">
          <div className="text-sm text-gray-600">Current Position</div>
          <div className="text-lg font-semibold text-primary">{positions.all}% Open</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${positions.all}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Tap Drapes button in navbar for individual controls
        </div>
      </CardContent>
    </Card>
  );
};

export default DrapesControl;