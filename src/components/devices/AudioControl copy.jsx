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

/**
 * AudioControl component
 * Merges SpeakerControl and MicrophoneControl into a single card.
 * - Top section: Speaker volume control with a circular display.
 * - Bottom section: 4-button grid for microphone controls.
 * - The entire card can be clickable to open a modal if the
 * `openExternalModal` prop is provided.
 */

const AudioControl = ({ isModalContent = false, openExternalModal, room }) => { 
  // --- STATE AND LOGIC FROM SpeakerControl ---

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
    const colorClass = !speakerOn || volumePercent === 0 ? "text-gray-400" : textColorClass;
    if (!speakerOn || volumePercent === 0) return <VolumeX size={size} className={colorClass} />;
    return <Volume2 size={size} className={colorClass} />;
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharrayValue = speakerOn ? (volumePercent / 100) * circumference : 0;

  // --- STATE AND LOGIC FROM MicrophoneControl ---

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

//   useEffect(() => {
//     const allOn = boardroomMic && trainingMic && wirelessMic;
//     const allOff = !boardroomMic && !trainingMic && !wirelessMic;
//     if (allOn && !combinedMic) toggleCombinedMic();
//     if (allOff && combinedMic) toggleCombinedMic();
//   }, [boardroomMic, trainingMic, wirelessMic, combinedMic, toggleCombinedMic]);

useEffect(() => {
    // Check if all individual mics are currently ON
    const allMicsOn = boardroomMic && trainingMic && wirelessMic;

    // Logic to manage combinedMic:
    // 1. If all mics are ON, combinedMic MUST be ON.
    // 2. If NOT all mics are ON, combinedMic MUST be OFF.

    if (allMicsOn && !combinedMic) {
        // All mics are on, but combinedMic is off -> Turn combinedMic ON
        toggleCombinedMic();
    } else if (!allMicsOn && combinedMic) {
        // Not all mics are on (meaning one or more are off), but combinedMic is on -> Turn combinedMic OFF
        toggleCombinedMic();
    }

    // Dependency array should include all state variables read within the effect,
    // and the toggle function if it's not guaranteed stable (though often it is).
}, [boardroomMic, trainingMic, wirelessMic, combinedMic, toggleCombinedMic]);
  const MicButton = ({ label, isOn, onClick }) => (
    <Button
      variant={isOn ? "danger" : "secondary"}
      size="sm"
      onClick={onClick}
      className="flex items-center justify-center space-x-2 py-3"
    >
      {isOn ? <Mic size={16} /> : <MicOff size={16} />}
      <span>{label}</span>
    </Button>
  );

    // --- NEW LOGIC: Conditional Microphone Buttons ---
  const microphoneButtons = [];

  if (room === 'training') {
    // Only show Training Mic (TR)
    microphoneButtons.push(
      <MicButton key="tr" label="Mic TR" isOn={trainingMic} onClick={toggleTrainingMic} />
    );

      } else if (room === 'boardroom') {
    // Only show Boardroom Mic (BR)
    microphoneButtons.push(
      <MicButton key="br" label="Mic BR" isOn={boardroomMic} onClick={toggleBoardroomMic} />
    );
      } else {
    // Default or Combined Room: show all 4 mics
    microphoneButtons.push(
      <MicButton key="br" label="Mic BR" isOn={boardroomMic} onClick={toggleBoardroomMic} />,
      <MicButton key="tr" label="Mic TR" isOn={trainingMic} onClick={toggleTrainingMic} />,
      <MicButton key="all" label="All Mic" isOn={combinedMic} onClick={handleAllMicToggle} />,
      <MicButton key="wireless" label="Wireless" isOn={wirelessMic} onClick={toggleWirelessMic} />
    );
  }

  // --- COMBINED RENDER LOGIC ---

  const content = (
    <CardContent className="space-y-6 pt-4">
      {/* Speaker Section */}
      <div className="flex flex-col items-center space-y-4 w-full">
        <div
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening modal when toggling speaker
            toggleSpeaker();
          }}
        >
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${strokeDasharrayValue} ${circumference}`}
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
            <button
              onClick={(e) => { e.stopPropagation(); handleVolumeChange(-5); }}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold text-lg disabled:opacity-50"
              disabled={volumePercent <= 0 || !speakerOn}
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-semibold text-gray-700">Volume</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleVolumeChange(5); }}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold text-lg disabled:opacity-50"
              disabled={volumePercent >= 100 || !speakerOn}
            >
              <Plus size={20} />
            </button>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleResetToDefault(); }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={!speakerOn}
          >
            <RotateCcw size={16} />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      {/* <div className="border-t border-gray-200">

      </div> */}

      {/* Microphone Section */}
      <div>
        {/* <h3 className="text-center text-sm font-medium text-gray-600 mb-3">
          Microphone Control
        </h3> */}
        {/* <div className="grid grid-cols-2 gap-4"> */}
                    <div className={`grid gap-4 ${microphoneButtons.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {microphoneButtons} 

          {/* <MicButton label="Mic BR" isOn={boardroomMic} onClick={toggleBoardroomMic} />
          <MicButton label="Mic TR" isOn={trainingMic} onClick={toggleTrainingMic} />
          <MicButton label="All Mic" isOn={combinedMic} onClick={handleAllMicToggle} />
          <MicButton label="Wireless" isOn={wirelessMic} onClick={toggleWirelessMic} /> */}
        {/* </div> */}
        </div>
      </div>
    </CardContent>
  );

  // If used inside a modal, return only content
  if (isModalContent) {
    return <div className="space-y-4">{content.props.children}</div>;
  }

  // Default full card layout
  return (
    <Card
      className={`device-card ${openExternalModal ? "cursor-pointer" : ""}`}
      onClick={() => openExternalModal && openExternalModal("audio")}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {/* Using Volume2 as the primary icon for the combined component */}
          <Volume2 size={20} />
          <span>Audio Control</span>
        </CardTitle>
      </CardHeader>
      {content}
    </Card>
  );
};

export default AudioControl;