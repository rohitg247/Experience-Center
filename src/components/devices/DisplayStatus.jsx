import {
  Monitor,
  Wifi,
  Video,
  Minus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDigitalJoin } from "../../hooks/useJoin";
import { DIGITAL_JOINS } from "../../crestron/joins";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";

// Import images
import wirelessImage from "../../assets/images/wireless.jpg";
import lecternImage from "../../assets/images/lectern.jpg";
import blankImage from "../../assets/images/blank.png";
import zoomImage from "../../assets/images/zoom.png";

const DisplayStatus = ({ activeSource }) => {
  // Display toggles
  const [boardroomDisplayOn, toggleBoardroomDisplay] = useDigitalJoin(
    DIGITAL_JOINS.BOARDROOM_DISPLAY
  );
  const [trainingDisplayOn, toggleTrainingDisplay] = useDigitalJoin(
    DIGITAL_JOINS.TRAINING_DISPLAY
  );

  // Map source names to images and icons
  const sourceConfig = {
    wireless: {
      image: wirelessImage,
      name: "Wireless",
      icon: Wifi,
    },
    lectern: {
      image: lecternImage,
      name: "Lectern",
      icon: Monitor,
    },
    zoom: {
      image: zoomImage,
      name: "Zoom Meeting",
      icon: Video,
    },
    blank: {
      image: blankImage,
      name: "Blank",
      icon: Minus,
    },
  };

  // Get current source configuration
  const currentSource = activeSource ? sourceConfig[activeSource] : null;

  const displays = [
    {
      name: "Training Room Display",
      active: trainingDisplayOn,
      toggle: toggleTrainingDisplay,
    },
    {
      name: "Boardroom Display",
      active: boardroomDisplayOn,
      toggle: toggleBoardroomDisplay,
    },
  ];

  return (
    <Card variant="device" className="device-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Monitor size={20} />
          <span>Display Status</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Display Areas */}
        <div className="space-y-4">
          {displays.map((display) => {
            const isActive = display.active;
            const StatusIcon = isActive ? CheckCircle : XCircle;

            return (
              <div
                key={display.name}
                onClick={display.toggle}
                className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  isActive
                    ? "bg-white ring-2 ring-green-400 shadow-md"
                    : "bg-gray-100 hover:border-gray-400"
                }`}
              >
                {/* Display Header */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  {/* The display name remains on the left */}
                  <span className="text-sm font-semibold text-gray-700">
                    {display.name}
                  </span>

                  {/* The StatusIcon moves all the way to the right side */}
                  <StatusIcon
                    size={16}
                    className={isActive ? "text-green-600" : "text-gray-400"}
                  />
                </div>

                {/* Display Screen Area */}
                <div className="p-3">
                  <div
                    className={`relative rounded-lg overflow-hidden ${
                      isActive && currentSource
                        ? "bg-black aspect-video"
                        : "bg-gray-900 aspect-video"
                    }`}
                    style={{
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    {isActive && currentSource ? (
                      <>
                        <img
                          src={currentSource.image}
                          alt={currentSource.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Source Label Overlay */}
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center space-x-2">
                          <currentSource.icon
                            size={14}
                            className="text-blue-400"
                          />
                          <span className="text-xs font-medium text-white">
                            {currentSource.name}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Monitor size={32} className="text-gray-600 mb-2" />
                        <span className="text-xs text-gray-500">
                          {isActive ? "No Source Selected" : "Display Off"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Displays Counter */}
        {/* <div className="border-t border-gray-200 pt-3 text-center">
          <div className="text-sm text-gray-600">
            Active Displays: {displays.filter((d) => d.active).length} of{" "}
            {displays.length}
          </div>
          {currentSource && (
            <div className="text-xs text-gray-500 mt-1">
              Current Source: {currentSource.name}
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};

export default DisplayStatus;
