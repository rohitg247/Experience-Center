import { useState } from "react";
import { Layers, Users, GraduationCap } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import RoomLayoutVisualizer from "./RoomLayoutVisualizer";

import TrainingRoomLayoutImage from "../../assets/images/Actis_Brand.jpg";
import BoardroomLayoutImage from "../../assets/images/Actis_Brand.jpg";

// ---------------- ROOM MODES (for combined) ----------------
const ROOM_MODES = [
  {
    key: "TOWNHALL",
    name: "Townhall",
    icon: Users,
    statusColor: "ring-blue-500/50 shadow-blue-200/50 ring-offset-2",
    visualKey: "Boardroom",
  },
  {
    key: "TRAINING_COMBO",
    name: "Combined Training Room",
    icon: GraduationCap,
    statusColor: "ring-yellow-500/50 shadow-yellow-200/50 ring-offset-2",
    visualKey: "Training",
  },
  {
    key: "BR_TR_COMBO",
    name: "Combined BR+TR",
    icon: Layers,
    statusColor: "ring-green-500/50 shadow-green-200/50 ring-offset-2",
    visualKey: "Combined",
  },
];

// ---------------- ROOM LAYOUTS (for single rooms) ----------------
const ROOM_LAYOUTS = {
  training: {
    image: TrainingRoomLayoutImage,
    accent: "ring-orange-500/50 shadow-orange-200/50 ring-offset-2",
    name: "Training Room",
    details: "Classroom layout • 20 seats • Dual Display",
    icon: GraduationCap,
  },
  boardroom: {
    image: BoardroomLayoutImage,
    accent: "ring-blue-500/50 shadow-blue-200/50 ring-offset-2",
    name: "Boardroom",
    details: "Conference Table • 12 seats • Single Display",
    icon: Users,
  },
};

const RoomArrangements = ({ room = "combined" }) => {
  const [activeMode, setActiveMode] = useState("BR_TR_COMBO");
  const activeRoomData = ROOM_MODES.find((mode) => mode.key === activeMode);

  const sendJoinCommand = (modeKey) => {
    console.log(`[CRESTRON MOCK] Activating Mode: ${modeKey}`);
    setActiveMode(modeKey);
  };

  const fixedCardHeight = "min-h-[350px]";

  // ---------------- CONDITIONAL RENDER ----------------
  if (room === "combined") {
    // ----- COMBINED ROOM (Visualizer + buttons) -----
    return (
      <Card variant="device" className={`device-card p-0 overflow-hidden ${fixedCardHeight} h-full`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary text-lg font-semibold">
            <Layers size={20} className="text-primary" />
            <span>Room Configuration</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-3 flex flex-col space-y-6 h-full">
          {/* Visualizer */}
          {activeRoomData && (
            <div
              className={`p-2 rounded-xl transition-all duration-300 bg-white shadow-xl ring-2 ${activeRoomData.statusColor}`}
            >
              <RoomLayoutVisualizer mode={activeRoomData.visualKey} />
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-1">
            {ROOM_MODES.map((room) => {
              const isActive = room.key === activeMode;
              const IconComponent = room.icon;

              return (
                <Button
                  key={room.key}
                  variant={isActive ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => sendJoinCommand(room.key)}
                  className="flex items-center justify-between h-auto py-3 px-4"
                >
                  <span className="flex items-center space-x-2">
                    <IconComponent size={20} />
                    <span className="text-sm font-medium">{room.name}</span>
                  </span>
                  {/* {isActive && <Zap size={16} />} */}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ----- SINGLE ROOM (Training or Boardroom) -----
  const layout = ROOM_LAYOUTS[room];
  if (!layout) return null;

  const Icon = layout.icon;

  return (
    <Card variant="device" className={`device-card p-0 overflow-hidden ${fixedCardHeight} h-full`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary text-lg font-semibold">
          <Icon size={20} className="text-primary" />
          <span>Room Configuration</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3 flex flex-col space-y-6 h-full">
        <div
          className={`rounded-xl overflow-hidden shadow-xl ring-2 ${layout.accent}`}
        >
          <img
            src={layout.image}
            alt={layout.name}
            className="w-full object-cover"
          />
        </div>

        <div className="space-y-2 pt-1">
          <div
            className={`w-full h-[50px] flex flex-col justify-center items-center px-4 transition-all duration-300 rounded-xl relative
      bg-primary text-white font-semibold shadow-md border-2 border-primary`}
          >
            <span className="text-base">{layout.name}</span>
            <span className="text-xs font-normal opacity-90">
              {layout.details}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomArrangements;
