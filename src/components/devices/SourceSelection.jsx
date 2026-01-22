import { useState, useEffect } from "react";
import {
  Wifi,
  Monitor,
  Video,
  Minus,
  Square,
  Lectern,
  Laptop,
} from "lucide-react";
import { useDigitalJoin } from "../../hooks/useJoin";
import { DIGITAL_JOINS } from "../../crestron/joins";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const SourceSelection = ({ onSourceChange, room = "combined-room" }) => {
  // Hook usage only for sending values; ignore feedback state for UI
  const [, , wirelessSetDigital] = useDigitalJoin(
    DIGITAL_JOINS.SOURCE_WIRELESS
  );
  const [, , byodSetDigital] = useDigitalJoin(DIGITAL_JOINS.SOURCE_BYOD);
  const [, , zoomSetDigital] = useDigitalJoin(DIGITAL_JOINS.SOURCE_ZOOM);
  const [, , blankSetDigital] = useDigitalJoin(DIGITAL_JOINS.SOURCE_BLANK);

  const [, , contentWirelessSetDigital] = useDigitalJoin(
    DIGITAL_JOINS.CONTENT_WIRELESS
  );
  const [, , contentByodSetDigital] = useDigitalJoin(
    DIGITAL_JOINS.CONTENT_BYOD
  );
  const [, , contentStopSetDigital] = useDigitalJoin(
    DIGITAL_JOINS.CONTENT_STOP
  );

  // Local active state for UI toggle
  const [activeSources, setActiveSources] = useState({
    wireless: false,
    lectern: false,
    zoom: false,
    blank: false,
  });

  const [activeContentSources, setActiveContentSources] = useState({
    wireless: false,
    lectern: false,
  });

  const [showContentShare, setShowContentShare] = useState(false);

  // Helper to handle press/release for source buttons
  const handleSourcePress = (key, setDigital) => {
    setDigital(true);
    if (key === "zoom" && (room === "boardroom" || room === "combined-room")) {
      setShowContentShare(true);
    }
  };
  const handleSourceRelease = (key) => {
    setActiveSources((prev) => {
      const isActive = prev[key];
      const newState = {};
      Object.keys(prev).forEach((k) => {
        newState[k] = k === key ? !isActive : false;
      });

      if (key === "zoom") {
        setShowContentShare(!isActive);
      }

      return newState;
    });
  };

  // Helper to handle press/release for content share buttons
  const handleContentPress = (key, setDigital) => {
    setDigital(true);
  };
  const handleContentRelease = (key) => {
    setActiveContentSources((prev) => {
      const isActive = prev[key];
      const newState = {};
      Object.keys(prev).forEach((k) => {
        newState[k] = k === key ? !isActive : false;
      });
      return newState;
    });
  };

  const handleStopContentShare = () => {
    if (activeContentSources.wireless) {
      contentWirelessSetDigital(false);
      setActiveContentSources((prev) => ({ ...prev, wireless: false }));
    }
    if (activeContentSources.lectern) {
      contentByodSetDigital(false);
      setActiveContentSources((prev) => ({ ...prev, lectern: false }));
    }
    contentStopSetDigital(true); // momentary true; your backend may reset it
  };

  // Arrays for mapping buttons
  const allSources = [
    {
      name: "Wireless",
      key: "wireless",
      icon: Wifi,
      active: activeSources.wireless,
      setDigital: wirelessSetDigital,
      description: "Wireless presentation",
    },
    {
      name: "Lectern",
      key: "lectern",
      icon: Lectern,
      active: activeSources.lectern,
      setDigital: byodSetDigital,
      description: "HDMI Connection",
    },
    {
      name: "Zoom",
      key: "zoom",
      icon: Video,
      active: activeSources.zoom,
      setDigital: zoomSetDigital,
      description: "Zoom meeting display",
    },
    {
      name: "Blank",
      key: "blank",
      icon: Minus,
      active: activeSources.blank,
      setDigital: blankSetDigital,
      description: "No display output",
    },
  ];

  const contentSources = [
    {
      name: "Wireless",
      key: "wireless",
      icon: Wifi,
      active: activeContentSources.wireless,
      setDigital: contentWirelessSetDigital,
      description: "AirPlay / Miracast",
    },
    {
      name: "Lectern",
      key: "lectern",
      icon: Monitor,
      active: activeContentSources.lectern,
      setDigital: contentByodSetDigital,
      description: "HDMI Connection",
    },
  ];

  // Filter sources as before
  const getFilteredSources = () => {
    switch (room) {
      case "boardroom":
        return allSources.filter((source) =>
          ["wireless", "zoom"].includes(source.key)
        );
      case "training":
        return allSources.filter((source) =>
          ["lectern", "blank"].includes(source.key)
        );
      case "combined-room":
      default:
        return allSources;
    }
  };

  const filteredSources = getFilteredSources();
  const activeSource = filteredSources.find((source) => source.active);
  const activeContentSource = contentSources.find((source) => source.active);

  const isContentShareSectionVisible =
    (room === "boardroom" || room === "combined-room") &&
    activeSources.zoom &&
    showContentShare;
  const shouldShowContentSelectionMessage =
    room !== "combined-room" && !activeContentSource;

  return (
    <Card variant="device" className="device-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Laptop size={20} />
          <span>Source Selection</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Source Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {filteredSources.map((source) => {
            const IconComponent = source.icon;
            return (
              <Button
                key={source.name}
                variant={source.active ? "primary" : "secondary"}
                size="sm"
                momentary={true}
                setDigital={source.setDigital}
                onMomentaryRelease={() => handleSourceRelease(source.key)}
                className="flex flex-col items-center space-y-2 h-auto py-4"
              >
                <IconComponent size={20} />
                <span className="text-xs font-medium">{source.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Content Share Section */}
        {isContentShareSectionVisible ? (
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Content Share (Zoom Active)
            </div>

            <div className="grid grid-cols-2 gap-3">
              {contentSources.map((source) => {
                const IconComponent = source.icon;
                return (
                  <Button
                    key={source.name}
                    variant={source.active ? "primary" : "secondary"}
                    size="sm"
                    momentary={true}
                    setDigital={source.setDigital}
                    onMomentaryRelease={() => handleContentRelease(source.key)}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <IconComponent size={20} />
                    <span className="text-xs font-medium">{source.name}</span>
                  </Button>
                );
              })}
            </div>

            {activeContentSource ? (
              <Button
                variant="danger"
                size="sm"
                onClick={handleStopContentShare}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Square size={16} />
                <span>Stop {activeContentSource.name} Share</span>
              </Button>
            ) : (
              shouldShowContentSelectionMessage && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="status-indicator offline mx-auto mb-2"></div>
                  <div className="text-sm text-gray-600 font-medium">
                    Select a Content Source
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Choose one above to start sharing to the Zoom meeting
                  </div>
                </div>
              )
            )}
          </div>
        ) : activeSource ? (
          // Active Source Display
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="status-indicator online"></div>
              <span className="font-semibold text-primary">Active Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <activeSource.icon size={20} className="text-primary" />
              <div>
                <div className="font-medium text-primary">
                  {activeSource.name}
                </div>
                <div className="text-xs text-primary-700">
                  {activeSource.description}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // No Source Selected
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="status-indicator offline mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">No source selected</div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Select a source to begin presentation
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SourceSelection;
