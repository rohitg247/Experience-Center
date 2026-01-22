import { useState } from 'react';
import { GraduationCap, Video, Mic, MicOff, ThermometerSun, Blinds } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDigitalJoin } from '../hooks/useJoin';
import { DIGITAL_JOINS } from '../crestron/joins';
// import SpeakerControl from '../components/devices/SpeakerControl';
import SourceSelection from '../components/devices/SourceSelection';
import AudioControl from '../components/devices/AudioControl';
import LightingControl from '../components/devices/LightingControl';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TrainingRoomLayoutImage from '../assets/images/Actis_Brand.jpg';

import RoomArrangements from '../components/devices/RoomArrangements';

/* --- EXPORTED HEADER CONTENT COMPONENT --- */
export const TrainingRoomHeader = ({ navigate, handleZoomMeeting, openDrapesModal, openClimateModal }) => {
  // const [trainingMic, toggleTrainingMic] = useDigitalJoin(DIGITAL_JOINS.TRAINING_ROOM_MIC);
  // const isMicOn = trainingMic;

  return (
    <div className="flex items-center justify-between w-full max-w-[800px] py-1">
      <div className="flex items-center space-x-3">
        <GraduationCap size={24} className="text-primary" />
        <div>
          <h1 className="text-xl font-bold text-primary">Training Room</h1>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={openClimateModal}
          className="flex items-center space-x-2"
        >
          <ThermometerSun size={16} />
          <span>Climate</span>
        </Button>

        {/* <Button
          variant={isMicOn ? "danger" : "secondary"}
          size="sm"
          onClick={toggleTrainingMic}
          className="flex items-center justify-center space-x-2"
        >
          {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
          <span>Mic</span>
        </Button> */}
          {/* <span>Mic {isMicOn ? "On" : "Muted"}</span> */}

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

const TrainingRoom = () => {
  const navigate = useNavigate();
  const [activeSource, setActiveSource] = useState(null);

  const handleZoomMeeting = () => {
    navigate('/zoom-meeting');
  };

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-indigo-50 to-orange-50">
      <div className="h-full overflow-hidden p-4 lg:p-6 touchPanel:p-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 touchPanel:gap-8 max-w-7xl mx-auto">
          
          {/* AudioControl - SINGLE CARD (height from TrainingRoom) */}
          <div className="h-[75vh] lg:h-[80vh] touchPanel:h-[84vh] flex flex-col">
            <AudioControl room="training" />
          </div>

          {/* SourceSelection - SINGLE CARD (height from TrainingRoom) */}
          <div className="h-[75vh] lg:h-[80vh] touchPanel:h-[84vh] flex flex-col">
            <SourceSelection 
              room="training"
              onSourceChange={setActiveSource}
            />
          </div>

          {/* RoomArrangements - SINGLE CARD (height from TrainingRoom) */}
          <div className="h-[75vh] lg:h-[80vh] touchPanel:h-[84vh] flex flex-col">
            <RoomArrangements room="training" />
          </div>

        </div>
      </div>
    </div>
  );
};


export default TrainingRoom;