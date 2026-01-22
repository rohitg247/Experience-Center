// src/pages/CombinedRoom.jsx

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all required components for the page body
import SpeakerControl from '../components/devices/SpeakerControl';
import SourceSelection from '../components/devices/SourceSelection';
import DisplayStatus from '../components/devices/DisplayStatus';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ClimateLightingModal from '../components/modals/ClimateLightingModal';
import MicDrapesModal from '../components/modals/MicDrapesModal'; // Import new modal


/* --- EXPORTED HEADER CONTENT COMPONENT (MODIFIED) --- */
// This component will be imported by App.jsx
export const CombinedRoomHeader = ({ 
    navigate, 
    handleZoomMeeting, 
    openMicDrapesModal, // Handler for new modal
    isMicOn // Status for mic button color/icon
}) => (
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
            {/* Microphone Button (Toggled Color/Icon) */}
            <Button
                variant={isMicOn ? "danger" : "secondary"} // Danger/Red if mic is on
                size="sm"
                onClick={() => openMicDrapesModal('mic')}
                className="flex items-center space-x-2"
            >
                {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                <span>Mic</span>
            </Button>

            {/* Drapes Button */}
            <Button
                variant="secondary"
                size="sm"
                onClick={() => openMicDrapesModal('drapes')}
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
/* --- END EXPORTED HEADER CONTENT COMPONENT --- */


const CombinedRoom = () => {
  const navigate = useNavigate();

  // STATE FOR NEW MIC/DRAPES MODAL
  const [isMicDrapesModalOpen, setIsMicDrapesModalOpen] = useState(false);
  const [activeMicDrapesTab, setActiveMicDrapesTab] = useState('mic');

  // MIC STATUS LOGIC: Button should toggle if ANY mic is on/off
  const [boardroomMic] = useDigitalJoin(DIGITAL_JOINS.BOARDROOM_MIC);
  const [trainingMic] = useDigitalJoin(DIGITAL_JOINS.TRAINING_ROOM_MIC);
  const isMicOn = boardroomMic || trainingMic; // true if EITHER is true (Mic icon)

  const openMicDrapesModal = useCallback((tab) => {
    setActiveMicDrapesTab(tab);
    setIsMicDrapesModalOpen(true);
  }, []);

  const closeMicDrapesModal = useCallback(() => {
    setIsMicDrapesModalOpen(false);
  }, []);


  const handleZoomMeeting = useCallback(() => {
    navigate('/zoom-meeting');
  }, [navigate]);

  const handleResetDefaults = () => {
    console.log('Resetting combined room to defaults...');
  };

  return (
    // The h-full ensures it takes the remaining height from the flex column layout in App.jsx
    <div className="h-full overflow-hidden bg-gray-50"> 
      
      {/* Main Controls Grid */}
      <div className="h-full overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          
          {/* Row 1 - Controls */}
          <ClimateLightingModal />
          <SpeakerControl />
          {/* REMOVED MicrophoneControl and DrapesControl from the grid */}
          <SourceSelection /> 
          
          {/* Row 2 - Environment & Status */}
          <DisplayStatus />
          
          {/* Room Management */}
          <Card className="device-card">
            {/* ... (CardContent remains the same) ... */}
          </Card>

          {/* Room Separation Controls */}
          <Card className="device-card">
            {/* ... (CardContent remains the same) ... */}
          </Card>

          {/* Meeting Controls */}
          <Card className="device-card">
            {/* ... (CardContent remains the same) ... */}
          </Card>

          {/* System Status */}
          <Card className="device-card">
            {/* ... (CardContent remains the same) ... */}
          </Card>
        </div>
      </div>

      {/* RENDER NEW MODAL HERE */}
      {isMicDrapesModalOpen && (
        <MicDrapesModal
          isOpen={isMicDrapesModalOpen}
          onClose={closeMicDrapesModal}
          initialTab={activeMicDrapesTab}
        />
      )}
    </div>
  );
};

export default CombinedRoom;