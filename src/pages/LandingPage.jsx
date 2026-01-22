import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, Power } from "lucide-react";
import Button from "../components/ui/Button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [roomMode, setRoomMode] = useState("combined");
  const prevDigitalJoin20 = useRef(undefined);

  const landingTexts = {
    boardroom: {
      title: "Board Room",
      subtitle: "Advanced AV management for boardroom facilities",
    },
    training: {
      title: "Training Room",
      subtitle: "Seamless collaboration for training sessions",
    },
    combined: {
      title: "Combined Room",
      subtitle: "Unified control for integrated room environments",
    },
  };

  useEffect(() => {
    const CrComLibInstance = window.CrComLib;

    if (!CrComLibInstance?.subscribeState) {
      console.log('⏳ Waiting for CrComLib to be ready...');
      return;
    }

    try {
      console.log('📡 Setting up join subscriptions for Landing Page');

      // Subscribe to Digital Join 20 (Room Mode Toggle)
      const digitalSub = CrComLibInstance.subscribeState('b', '20', (value) => {
        console.log('🔄 Digital Join 20 received:', value);

        if (value !== prevDigitalJoin20.current) {
          setRoomMode((prevMode) => {
            const newMode = prevMode === "combined" ? "boardroom" : "combined";
            console.log(`✅ Room mode toggled: ${prevMode} → ${newMode}`);
            return newMode;
          });
          prevDigitalJoin20.current = value;
        }
      });

      // Subscribe to Serial Join 20 (Alert Messages)
      const serialSub = CrComLibInstance.subscribeState('s', '20', (text) => {
        console.log('📨 Serial Join 20 received:', text);

        if (text?.trim()) {
          alert(text);
        }
      });

      console.log('✅ Landing Page subscriptions set up successfully');

      // ✅ Cleanup now has access to subscription IDs via closure
      return () => {
        console.log('🧹 Cleaning up Landing Page subscriptions...');
        try {
          if (digitalSub) {
            CrComLibInstance.unsubscribeState('b', '20', digitalSub);
            console.log('✅ Unsubscribed from digital join 20');
          }
          if (serialSub) {
            CrComLibInstance.unsubscribeState('s', '20', serialSub);
            console.log('✅ Unsubscribed from serial join 20');
          }
        } catch (error) {
          console.error('❌ Error unsubscribing:', error);
        }
      };

    } catch (error) {
      console.error('❌ Error setting up subscriptions:', error);
    }
  }, []);

  const handleEnterSystem = () => {
    setIsEntering(true);

    const routeMap = {
      boardroom: "/boardroom",
      training: "/training-room",
      combined: "/combined-room",
    };

    setTimeout(() => {
      navigate(routeMap[roomMode]);
    }, 800);
  };

  const handleMockJoin = () => {
    const join = prompt(
      "Enter join number:\n1 = Boardroom\n2 = Training Room\n3 = Combined Room"
    );

    switch (join) {
      case "1":
        setRoomMode("boardroom");
        alert("Switched to Boardroom landing page");
        break;
      case "2":
        setRoomMode("training");
        alert("Switched to Training Room landing page");
        break;
      case "3":
        setRoomMode("combined");
        alert("Switched to Combined Room landing page");
        break;
      default:
        alert("Invalid join number");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Landing Content */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen px-6 transition-all duration-800 ${
          isEntering ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="max-w-4xl w-full text-center animate-fadeIn">
          {/* Logo */}
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Building2 className="w-16 h-16 text-white" />
          </div>

          {/* Dynamic Title */}
          <h1 className="text-6xl font-bold text-white mb-6 animate-slideUp">
            {landingTexts[roomMode].title}
          </h1>

          <p className="text-2xl text-blue-100 max-w-3xl mx-auto mb-12 animate-slideUp">
            {landingTexts[roomMode].subtitle}
          </p>

          {/* Enter Button */}
          <div className="animate-slideUp">
            <Button
              variant="outline"
              size="lg"
              onClick={handleEnterSystem}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:text-primary text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
              disabled={isEntering}
            >
              <div className="flex items-center gap-4">
                <Power className="w-6 h-6" />
                <span>Enter Control System</span>
                <ArrowRight
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isEntering ? "translate-x-2" : ""
                  }`}
                />
              </div>
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="mt-12 flex items-center justify-center gap-3 text-blue-200 animate-slideUp">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-lg">System ready for control</span>
          </div>

          {/* Debug Info */}
          <div className="mt-6 text-blue-200/60 text-sm">
            <p>Current Mode: <strong>{roomMode}</strong></p>
          </div>
        </div>
      </div>

      {/* Mock Join Input Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <Button variant="ghost" size="sm" onClick={handleMockJoin}>
          Mock Join Input
        </Button>
      </div>

      {/* Loading Overlay */}
      {isEntering && (
        <div className="fixed inset-0 z-20 bg-primary/90 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Initializing system...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;