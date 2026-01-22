import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";
import { useAnalogJoin, useDigitalJoin } from "../../hooks/useJoin";
import { ANALOG_JOINS, DIGITAL_JOINS } from "../../crestron/joins";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const AudioControl = ({ isModalContent = false, openExternalModal, room }) => { 
  // --- SPEAKER LOGIC (Updated to match working SpeakerControl) ---
  const [speakerOn, toggleSpeaker] = useDigitalJoin(
    DIGITAL_JOINS.SPEAKER_POWER || 999
  );
  const [volume, setVolume] = useAnalogJoin(ANALOG_JOINS.SPEAKER_VOLUME, 50); // 50% default

  const DEFAULT_VOLUME_PERCENT = 65;

  const volumePercent = volume; // Already 0-100 from hook

  const handleVolumeChange = (change) => {
    const newPercent = Math.max(0, Math.min(100, volumePercent + change));
    setVolume(newPercent); // Direct percentage
  };

  const handleResetToDefault = () => {
    setVolume(DEFAULT_VOLUME_PERCENT);
  };

  const getVolumeColorData = () => {
    if (!speakerOn) return { textColorClass: "text-gray-400", strokeColor: "#9ca3af" };
    if (volumePercent === 0) return { textColorClass: "text-gray-500", strokeColor: "#9ca3af" };
    if (volumePercent < 70) return { textColorClass: "text-green-500", strokeColor: "#10b981" };
    if (volumePercent < 90) return { textColorClass: "text-orange-500", strokeColor: "#f97316" };
    return { textColorClass: "text-red-500", strokeColor: "#ef4444" };
  };

  const { textColorClass, strokeColor } = getVolumeColorData();

  const getVolumeIcon = (size = 20) => {
    const colorClass = (!speakerOn || volumePercent === 0) ? 'text-gray-400' : textColorClass;
    if (!speakerOn || volumePercent === 0) return <VolumeX size={size} className={colorClass} />;
    return <Volume2 size={size} className={colorClass} />;
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharrayValue = speakerOn ? (volumePercent / 100) * circumference : 0;

  // --- MIC LOGIC (Unchanged) ---
  const [boardroomMic, toggleBoardroomMic] = useDigitalJoin(
    DIGITAL_JOINS.BOARDROOM_MIC
  );
  const [trainingMic, toggleTrainingMic] = useDigitalJoin(
    DIGITAL_JOINS.TRAINING_ROOM_MIC
  );
  const [combinedMic, toggleCombinedMic] = useDigitalJoin(
    DIGITAL_JOINS.MIC_COMBINED_CONTROL
  );
  const [wirelessMic, toggleWirelessMic] = useDigitalJoin(
    DIGITAL_JOINS.WIRELESS_MIC
  );

  const handleAllMicToggle = () => {
    const newState = !combinedMic;
    toggleCombinedMic();
    if (boardroomMic !== newState) toggleBoardroomMic();
    if (trainingMic !== newState) toggleTrainingMic();
    if (wirelessMic !== newState) toggleWirelessMic();
  };

  useEffect(() => {
    const allMicsOn = boardroomMic && trainingMic && wirelessMic;

    if (allMicsOn && !combinedMic) {
      toggleCombinedMic();
    } else if (!allMicsOn && combinedMic) {
      toggleCombinedMic();
    }
  }, [boardroomMic, trainingMic, wirelessMic, combinedMic, toggleCombinedMic]);

  const MicButton = ({ label, isOn, onClick }) => (
    <Button
      variant={isOn ? "danger" : "secondary"}
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center justify-center space-x-2 py-3"
    >
      {isOn ? <Mic size={16} /> : <MicOff size={16} />}
      <span>{label}</span>
    </Button>
  );

  // --- ROOM-SPECIFIC MIC BUTTONS (Unchanged) ---
  let microphoneButtons = [];

  if (room === 'training') {
    microphoneButtons.push(
      <MicButton key="tr" label="Mic TR" isOn={trainingMic} onClick={toggleTrainingMic} />
    );
  } else if (room === 'boardroom') {
    // ✅ BOARDROOM: NO MIC BUTTONS
    microphoneButtons = [];
  } else {
    microphoneButtons.push(
      <MicButton key="br" label="Mic BR" isOn={boardroomMic} onClick={toggleBoardroomMic} />,
      <MicButton key="tr" label="Mic TR" isOn={trainingMic} onClick={toggleTrainingMic} />,
      <MicButton key="all" label="All Mic" isOn={combinedMic} onClick={handleAllMicToggle} />,
      <MicButton key="wireless" label="Wireless" isOn={wirelessMic} onClick={toggleWirelessMic} />
    );
  }

  const content = (
    <CardContent className="space-y-6 pt-4">
      {/* Speaker Section - Updated working logic */}
      <div className="flex flex-col items-center space-y-4 w-full">
        <div
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleSpeaker();
          }}
        >
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r={radius}
              stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
              fill="none" strokeDasharray={`${strokeDasharrayValue} ${circumference}`}
              style={{ transition: "stroke-dasharray 0.3s" }}
            />
          </svg>
          <div className="flex flex-col items-center justify-center h-full w-full">
            {getVolumeIcon(40)}
            <div className={`text-3xl font-light ${textColorClass}`} style={{ minWidth: "3.5ch", textAlign: "center" }}>
              {speakerOn ? `${volumePercent}%` : "OFF"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
          <div className="flex items-center space-x-4 w-full justify-center">
            {/* Volume Down - icon variant */}
            <Button
              variant="icon"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVolumeChange(-5);
              }}
              disabled={volumePercent <= 0 || !speakerOn}
              className="flex-shrink-0"
            >
              <Minus size={20} />
            </Button>
            
            <span className="text-lg font-semibold text-gray-700 flex-shrink-0">Volume</span>
            
            {/* Volume Up - icon variant */}
            <Button
              variant="icon"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVolumeChange(5);
              }}
              disabled={volumePercent >= 100 || !speakerOn}
              className="flex-shrink-0"
            >
              <Plus size={20} />
            </Button>
          </div>
          
          {/* Reset Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleResetToDefault();
            }}
            disabled={!speakerOn}
            className="w-full pt-2"
          >
            <RotateCcw size={20} />
            <span>Reset to Default</span>
          </Button>
        </div>
      </div>

      {/* Microphone Section */}
      {microphoneButtons.length > 0 && (
        <div className={`grid gap-4 ${microphoneButtons.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {microphoneButtons}
        </div>
      )}
    </CardContent>
  );

  // Modal content
  if (isModalContent) {
    return <div className="space-y-4">{content.props.children}</div>;
  }

  return (
    <Card
      variant="device"
      className={`${openExternalModal ? "cursor-pointer" : ""}`}
      onClick={() => openExternalModal && openExternalModal("audio")}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 size={20} />
          <span>Audio Control</span>
        </CardTitle>
      </CardHeader>
      {content}
    </Card>
  );
};

export default AudioControl;
