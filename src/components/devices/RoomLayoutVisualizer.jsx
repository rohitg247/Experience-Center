import { Monitor, Square, Users, Divide, Maximize } from 'lucide-react';

/**
 * Sub-component to visualize the current room layout using vector graphics 
 * (Lucide icons and Tailwind shapes).
 * It accepts a mode key ('Boardroom', 'Training', or 'Combined') and renders 
 * the corresponding floor plan representation.
 */
const RoomLayoutVisualizer = ({ mode }) => {
    // --- Configuration for Room Elements ---
    const layoutConfig = {
        'Boardroom': {
            layout: (
                // Boardroom layout (corresponds to 'Townhall' button)
                <div className="flex justify-center items-center h-full space-x-2">
                    {/* Boardroom Table/Display */}
                    <div className="w-1/4 h-2/3 bg-gray-300 rounded-sm flex items-center justify-center border border-gray-400">
                        <Monitor size={14} className="text-gray-600" />
                    </div>
                    {/* Boardroom Seats (Simplified) */}
                    <div className="flex flex-col justify-around h-2/3">
                        <Square size={6} className="text-blue-400 fill-blue-400" />
                        <Square size={6} className="text-blue-400 fill-blue-400" />
                        <Square size={6} className="text-blue-400 fill-blue-400" />
                    </div>
                </div>
            )
        },
        'Training': {
            layout: (
                // Training Room layout (corresponds to 'Combined Training Room' button)
                <div className="flex justify-center items-center h-full space-x-3">
                    {/* Training Seats (Simplified rows) */}
                    <div className="flex flex-col space-y-1">
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                        <Square size={8} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    {/* Training Display */}
                    <div className="w-1/4 h-2/3 bg-gray-300 rounded-sm flex items-center justify-center border border-gray-400">
                        <Monitor size={14} className="text-gray-600" />
                    </div>
                </div>
            )
        },
        'Combined': {
            layout: (
                // Combined BDR+TR layout (corresponds to 'Combined BR+TR' button)
                <div className="flex justify-center items-center h-full relative p-1">
                    {/* Boardroom Side */}
                    <div className="flex items-center space-x-1 w-1/2 h-full justify-end pr-1">
                        <div className="w-1/3 h-full bg-gray-300 rounded-sm flex items-center justify-center border border-gray-400">
                            <Monitor size={12} className="text-gray-600" />
                        </div>
                        <div className="flex flex-col justify-around h-3/4">
                            <Square size={6} className="text-blue-400 fill-blue-400" />
                            <Square size={6} className="text-blue-400 fill-blue-400" />
                        </div>
                    </div>
                    {/* Divider Line (Symbolic of wall retraction point) */}
                    <Divide size={20} className="absolute text-gray-400 rotate-90" />
                    {/* Training Side */}
                    <div className="flex items-center space-x-1 w-1/2 h-full justify-start pl-1">
                        <div className="flex flex-col justify-around h-3/4">
                            <Square size={6} className="text-yellow-400 fill-yellow-400" />
                            <Square size={6} className="text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="w-1/3 h-full bg-gray-300 rounded-sm flex items-center justify-center border border-gray-400">
                            <Monitor size={12} className="text-gray-600" />
                        </div>
                    </div>
                </div>
            )
        }
    };

    const config = layoutConfig[mode] || layoutConfig['Combined'];

    return (
        <div className="flex flex-col items-center">
            {/* Visualization Box - Compact height for aspect ratio */}
            <div className="w-full h-[100px] bg-white rounded-lg shadow-inner border border-gray-200">
                {config.layout}
            </div>
        </div>
    );
};

export default RoomLayoutVisualizer;
