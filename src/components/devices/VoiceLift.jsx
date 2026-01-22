// src/components/devices/VoiceLiftControl.jsx

import { MicVocal } from 'lucide-react';
import { useDigitalJoin } from '../../hooks/useJoin';
import { DIGITAL_JOINS } from '../../crestron/joins'; 
import Button from '../ui/Button'; // Import the Button component

const VOICE_LIFT_TOGGLE_JOIN = DIGITAL_JOINS.VOICE_LIFT_TOGGLE || 80;

const VoiceLiftControl = () => { 
  // isActive is the current state (ON/OFF). triggerToggle is the action.
  const [isActive, triggerToggle] = useDigitalJoin(VOICE_LIFT_TOGGLE_JOIN, false); 
  
  // Determine the button's appearance and text based on the isActive state
  const buttonVariant = isActive ? "success" : "secondary"; // Use new 'success' or default 'secondary'
//   const buttonText = isActive ? "ON" : "OFF"; // Text to display in the button
  
  return (
    // Container for the Title and the Button
    // ADDED: -mt-1 to move the entire component up slightly
    <div className="flex flex-col items-center space-y-1"> 
      
      {/* 1. Title ABOVE the Button */}
{/*       <div className="text-sm font-semibold text-primary">
        Voice Lift
      </div> */}
      
      {/* 2. Button for Toggling */}
      <Button
        // The onClick will trigger the digital join to change the state
        onClick={triggerToggle} 
        variant={buttonVariant} 
        size="sm"
        className="flex items-center space-x-2" // Ensure button is a standard width and centers content
      >
        {/* Button Content: Icon + ON/OFF Text */}
            <MicVocal size={16} />
            <span>Voice Lift</span>

      </Button>
    </div>
  );
};

export default VoiceLiftControl;