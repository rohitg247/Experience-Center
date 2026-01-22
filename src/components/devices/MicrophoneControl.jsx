// src/components/devices/MicrophoneControl.jsx

import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { useDigitalJoin } from "../../hooks/useJoin";
import { DIGITAL_JOINS } from "../../crestron/joins";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";

/**
 * MicrophoneControl component (Grid Button Version)
 * - 4 mic buttons: Boardroom, Training, All (Combined), Wireless
 * - All Mic toggles all others together
 * - Grid layout: 2x2
 */
const MicrophoneControl = ({
  room = "both",
  isModalContent = false,
  openExternalModal,
}) => {
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

  /** Handle All Mic toggle — controls BR, TR, and Wireless */
  const handleAllMicToggle = () => {
    const newState = !combinedMic;
    toggleCombinedMic();

    // Ensure all mics follow the combined state
    if (boardroomMic !== newState) toggleBoardroomMic();
    if (trainingMic !== newState) toggleTrainingMic();
    if (wirelessMic !== newState) toggleWirelessMic();
  };

  /** Keep All Mic in sync with others */
  useEffect(() => {
    const allOn = boardroomMic && trainingMic && wirelessMic;
    const allOff = !boardroomMic && !trainingMic && !wirelessMic;

    if (allOn && !combinedMic) toggleCombinedMic();
    if (allOff && combinedMic) toggleCombinedMic();
  }, [boardroomMic, trainingMic, wirelessMic, combinedMic, toggleCombinedMic]);

  /** Helper to render a Mic button */
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

  const content = (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Top row */}
        <MicButton
          label="Mic BR"
          isOn={boardroomMic}
          onClick={toggleBoardroomMic}
        />
        <MicButton
          label="Mic TR"
          isOn={trainingMic}
          onClick={toggleTrainingMic}
        />

        {/* Bottom row */}
        <MicButton
          label="All Mic"
          isOn={combinedMic}
          onClick={handleAllMicToggle}
        />
        <MicButton
          label="Wireless Mic"
          isOn={wirelessMic}
          onClick={toggleWirelessMic}
        />
      </div>

      <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
        Active:{" "}
        {[boardroomMic, trainingMic, combinedMic, wirelessMic].filter(Boolean)
          .length}{" "}
        of 4 microphones
      </div>
    </CardContent>
  );

  // If used inside a modal, return only content
  if (isModalContent) return <div className="space-y-4">{content.props.children}</div>;

  // Default full card layout
  return (
    <Card
      className={`device-card ${openExternalModal ? "cursor-pointer" : ""}`}
      onClick={() => openExternalModal && openExternalModal("mic")}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic size={20} />
          <span>Microphone Control</span>
        </CardTitle>
      </CardHeader>
      {content}
    </Card>
  );
};

export default MicrophoneControl;
