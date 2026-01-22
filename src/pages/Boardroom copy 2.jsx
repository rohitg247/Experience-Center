// src/pages/Boardroom.jsx

import { useState } from "react";
import { Users, Video, Mic, MicOff, ThermometerSun, Blinds } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import essential devices
import SpeakerControl from "../components/devices/SpeakerControl";
import SourceSelection from "../components/devices/SourceSelection";
import DisplayStatus from "../components/devices/DisplayStatus"; // Keeping this commented out as per your code

import RoomArrangements from "../components/devices/RoomArrangements";

// Import UI components
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";

// Crestron Integration Hooks/Joins
import { useDigitalJoin } from "../hooks/useJoin";
import { DIGITAL_JOINS } from "../crestron/joins";

// --- CONFIGURATION ---
import BoardroomLayoutImage from "../assets/images/Actis_Brand.jpg";

// Fixed height for visual consistency with other cards
const FIXED_CARD_HEIGHT = "min-h-[350px]";

// Boardroom specific styling based on the 'Townhall' mode
const BOARDROOM_ACCENT_COLOR =
  "ring-blue-500/50 shadow-blue-200/50 ring-offset-2";
const BOARDROOM_NAME = "Executive Boardroom";
const BOARDROOM_DETAILS = "Conference Table • 12 Seats • Single Display";

/* --- EXPORTED HEADER CONTENT COMPONENT (No changes) --- */
export const BoardroomHeader = ({ navigate, handleZoomMeeting, openDrapesModal, openClimateModal }) => {
  // Get the boardroom mic state and toggle function
  // const [boardroomMic, toggleBoardroomMic] = useDigitalJoin(
  //   DIGITAL_JOINS.BOARDROOM_MIC
  // );
  // const isMicOn = boardroomMic;

  return (
    <div className="flex items-center justify-between w-full max-w-[800px] py-1">
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        <Users size={24} className="text-primary" />
        <div>
          <h1 className="text-xl font-bold text-primary">Boardroom</h1>
          {/* <p className="text-sm text-gray-600">
            Executive conference room controls
          </p> */}
        </div>
      </div>
      {/* Buttons Section */}
      <div className="flex space-x-3">

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

        {/* Mic Toggle Button in the Header */}
        {/* <Button
          variant={isMicOn ? "danger" : "secondary"}
          size="sm"
          onClick={toggleBoardroomMic} // Directly toggle the mic state
          className="flex items-center justify-center space-x-2"
        >
          {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
          <span>Mic</span>
        </Button> */}

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

        {/* Meeting Button */}
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

const Boardroom = () => {
  const navigate = useNavigate();
  const handleZoomMeeting = () => {
    navigate("/zoom-meeting");
  };

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-white to-blue-200">
      {/* Main Controls Grid - NO SCROLL + TouchPanel scaling */}
      <div className="h-full overflow-hidden p-4 lg:p-6 touchPanel:p-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 touchPanel:gap-8 max-w-7xl mx-auto">
          
          {/* Speaker Control - GRAY BG + TouchPanel scaling */}
          <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 touchPanel:p-8 shadow-lg min-h-[75vh] lg:min-h-[80vh] touchPanel:min-h-[80vh] flex flex-col">
            <SpeakerControl />
          </div>

          {/* Source Selection - GRAY BG + TouchPanel scaling */}
          <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 touchPanel:p-8 shadow-lg min-h-[75vh] lg:min-h-[80vh] touchPanel:min-h-[80vh] flex flex-col">
            <SourceSelection room="boardroom" />
          </div>

          {/* Room Arrangements - GRAY BG + TouchPanel scaling */}
          <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 touchPanel:p-8 shadow-lg min-h-[75vh] lg:min-h-[80vh] touchPanel:min-h-[80vh] flex flex-col">
            <RoomArrangements room="boardroom" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Boardroom;