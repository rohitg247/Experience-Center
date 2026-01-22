import { Thermometer, Power, CloudSnow, Fan } from "lucide-react";
import { useDigitalJoin, useAnalogJoin } from "../../hooks/useJoin";
import { DIGITAL_JOINS, ANALOG_JOINS } from "../../crestron/joins";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";

const ClimateControl = ({ room = "boardroom" }) => {
  const powerJoin =
    room === "boardroom"
      ? DIGITAL_JOINS.BOARDROOM_AC_POWER
      : DIGITAL_JOINS.TRAINING_ROOM_AC_POWER;

  const tempJoin =
    room === "boardroom"
      ? ANALOG_JOINS.BOARDROOM_TEMP
      : ANALOG_JOINS.TRAINING_ROOM_TEMP;

  const [acPower, toggleAC] = useDigitalJoin(powerJoin);
  const [temperature, setTemperature] = useAnalogJoin(tempJoin, 50); // 50% = 23°C default

  // Map 0-100% to 16-30°C temperature range
  const currentTemp = Math.round(16 + (temperature / 100) * 14);

  const handleTempChange = (newTemp) => {
    // Map 16-30°C to 0-100%
    const percentValue = ((newTemp - 16) / 14) * 100;
    setTemperature(percentValue);
  };

  const increaseTemp = () => handleTempChange(Math.min(currentTemp + 1, 30));
  const decreaseTemp = () => handleTempChange(Math.max(currentTemp - 1, 16));

  // Inside your component
  const getGlowColor = (temp) => {
    // Map 16°C -> blue (#5DCBF7)
    // Map 30°C -> orange (#FFA500)
    const ratio = (temp - 16) / (30 - 16); // 0 -> 1
    const r = Math.round(93 + (255 - 93) * ratio); // R channel 93->255
    const g = Math.round(203 + (165 - 203) * ratio); // G 203->165
    const b = Math.round(247 + (0 - 247) * ratio); // B 247->0
    return `rgba(${r},${g},${b},0.6)`;
  };

  // --- Unified (Training-Style) Layout ---
  return (
    <Card
      className="device-card p-4 flex flex-col items-center cursor-pointer relative h-[350px]"
      onClick={() => toggleAC()} // entire card clickable
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer size={20} />
          <span>Aircon</span>
          <span className="text-sm font-normal text-gray-500 capitalize">
            ({room})
          </span>
          <div
            className={`status-indicator ${acPower ? "online" : "offline"}`}
          ></div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4 w-full relative ">
        {/* Thermostat Circle */}
        <div
          className={`relative flex items-center justify-center w-40 h-40 rounded-full transition-all duration-500 ${
            acPower ? "glow-circle" : ""
          }`}
          style={{
            boxShadow: acPower
              ? `0 0 20px 5px ${getGlowColor(
                  currentTemp
                )}, 0 0 40px 10px ${getGlowColor(currentTemp)}`
              : "none",
          }}
        >
          <div className="flex flex-col items-center justify-center h-36 w-36 rounded-full bg-gray-100 relative">
            <h3 className="text-blue-500 font-light">Cooling</h3>
            <h1 className="text-5xl font-thin">{currentTemp}</h1>
          </div>
        </div>

        {/* Temperature Controls */}
        {acPower ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decreaseTemp();
              }}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold text-lg"
            >
              -
            </button>
            <span className="text-lg font-semibold">{currentTemp}°C</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                increaseTemp();
              }}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold text-lg"
            >
              +
            </button>
          </div>
        ) : (
          <div className="text-center py-3 text-gray-500">
            <p className="text-sm">AC is turned off</p>
          </div>
        )}

        {/* Bottom Icon Row */}
        <div className="flex justify-between w-full mt-2 px-6">
          <CloudSnow size={24} className="text-blue-300" />
          <Power size={24} className="text-gray-600" />
          <Fan
            size={24}
            className={`text-blue-400 ${acPower ? "animate-spin-slow" : ""}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClimateControl;
