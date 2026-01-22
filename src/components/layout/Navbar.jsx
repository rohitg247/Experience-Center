import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Power, ArrowLeft } from "lucide-react";
import Button from "../ui/Button";
import Logo from "../../assets/images/Actis_logo.jpg";
import { useSystemStatus } from "../../hooks/useJoin";

const Navbar = ({ onShutdown, centerContent, previousPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isSettingsPage = location.pathname === "/settings";

  return (
    <nav className="bg-white shadow-navbar-elegant border-b border-gray-300 px-6 touchPanel:px-8 py-3 touchPanel:py-4 flex items-center justify-between min-h-[72px] touchPanel:min-h-[120px] [&_*]:!transition-none">
      {/* Left Section - Logo / Title */}
      <div className="flex items-center space-x-4 justify-start flex-shrink-0">
        <img
          src={Logo}
          alt="Actis Logo"
          className="h-12 touchPanel:h-18 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        />
        {isHomePage && (
          <div className="text-xl touchPanel:text-2xl font-bold text-primary">
            Conference Control
          </div>
        )}
      </div>

      {/* Center Section */}
      <div className="flex-1 flex justify-center mx-4 touchPanel:mx-8">
        {centerContent}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 min-w-[250px] touchPanel:min-w-[350px] justify-end flex-shrink-0">
        {/* Settings or Back Button */}
        {!isSettingsPage ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className="p-2 touchPanel:p-4 hover:bg-gray-100 rounded-full"
          >
            <Settings size={20} className="touchPanel:w-6 touchPanel:h-6 flex-shrink-0" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (previousPage) navigate(previousPage);
            }}
            className="p-2 touchPanel:p-4 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} className="touchPanel:w-6 touchPanel:h-6 flex-shrink-0" />
          </Button>
        )}

        {/* Shutdown */}
        <Button
          variant="danger"
          size="sm"
          onClick={onShutdown}
          className="flex items-center space-x-2 touchPanel:space-x-3 touchPanel:py-4 touchPanel:px-8 touchPanel:text-lg whitespace-nowrap"
        >
          <Power size={16} className="touchPanel:w-6 touchPanel:h-6 flex-shrink-0" />
          <span className="font-medium touchPanel:text-xl">Shutdown</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
