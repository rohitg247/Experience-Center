// src/pages/CombinedRoom.jsx

import { useState, useCallback } from "react";
import {
  Layers,
  Video,
  Mic,
  Blinds,
  Users,
  GraduationCap,
  MicOff,
  ThermometerSun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDigitalJoin } from "../hooks/useJoin";
import { DIGITAL_JOINS } from "../crestron/joins";

// Import all required components for the page body
import RoomArrangements from "../components/devices/RoomArrangements";
import SpeakerControl from "../components/devices/SpeakerControl";
import SourceSelection from "../components/devices/SourceSelection";
// import ContentShare from "../components/devices/ContentShare";
import DisplayStatus from "../components/devices/DisplayStatus";

import VoiceLiftControl from "../components/devices/VoiceLift";
// import Card, {
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "../components/ui/Card";
import Button from "../components/ui/Button";
// import ClimateLightingModal from "../components/modals/ClimateLightingModal";
// import Modal from "../components/ui/Modal";
// import MicrophoneControl from "../components/devices/MicrophoneControl";
// import DrapesControl from "../components/devices/DrapesControl";
import AudioControl from "../components/devices/AudioControl";
// import ClimateControl from "../components/devices/ClimateControl";
// import LightingControl from "../components/devices/LightingControl";

/* --- EXPORTED HEADER CONTENT COMPONENT (MODIFIED) --- */
// This component will be imported by App.jsx
export const CombinedRoomHeader = ({
  navigate,
  handleZoomMeeting,
  openDrapesModal,
  openClimateModal,
}) => {

  return (
    <div className="flex items-center justify-between w-full max-w-[800px] py-1">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <Layers size={24} className="text-primary" />
        <div>
          <h1 className="text-xl font-bold text-primary">Combined Room</h1>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-3">

        <VoiceLiftControl />
        {/* Climate Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={openClimateModal}
          className="flex items-center space-x-2"
        >
          <ThermometerSun size={16} />
          <span>Climate</span>
        </Button>

    
        {/* Drapes Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={openDrapesModal}
          className="flex items-center space-x-2"
        >
          <Blinds size={16} />
          <span>Drapes</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleZoomMeeting}
          className="flex items-center space-x-2"
        >
          <Video size={18} />
          <span>Meeting</span>
        </Button>
      </div>
    </div>
  );
};
/* --- END EXPORTED HEADER CONTENT COMPONENT --- */

const CombinedRoom = () => {
  const navigate = useNavigate();

  const [activeSource, setActiveSource] = useState(null);

  return (
    // <div className="h-full overflow-hidden bg-gray-50">
      <div className="h-full overflow-hidden bg-gradient-to-br from-white to-blue-200">
      {/* Main Controls Grid */}
      <div className="h-full overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          {/* Row 1 - Controls */}
          {/* <ClimateLightingModal /> */}
          {/* <SpeakerControl /> */}
          <AudioControl />
          <SourceSelection
            onSourceChange={setActiveSource} // Pass callback to receive source changes
          />
          {/* show when zoom meeting is active */}
          {/* <ContentShare /> */}
          <DisplayStatus
            activeSource={activeSource} // Pass active source to display
          />
          <RoomArrangements room="combined" />

        </div>
      </div>
    </div>
  );
};

export default CombinedRoom;
