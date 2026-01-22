import React from "react";
import ClimateControl from "../devices/ClimateControl";
import LightingControl from "../devices/LightingControl";

const ClimateLightingModal = ({ room = "both", isModalContent = false }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Side - Climate Controls (Air Conditioning) */}
      <div className="flex-1 overflow-y-auto">
        {room === "both" ? (
          // Show both Boardroom + Training Room
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <ClimateControl room="boardroom" />
            </div>
            <div className="flex-1">
              <ClimateControl room="training" />
            </div>
          </div>
        ) : (
          // Show only one based on context
          <ClimateControl room={room} />
        )}
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gray-200"></div>
      <div className="block lg:hidden h-px bg-gray-200"></div>

      {/* Right Side - Lighting Controls */}
      <div className="flex-1 overflow-y-auto h-full flex flex-col">
        <LightingControl />
      </div>
    </div>
  );
};

export default ClimateLightingModal;
