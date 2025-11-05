import { Calendar } from "iconsax-reactjs";
import { Users } from "lucide-react";
import { CustomButton } from "../../../button/button";
import { useNavigate } from "@tanstack/react-router";

const ScheduledEvent = () => {
  const navigate = useNavigate();
  const handleContinue = () => {
    navigate({ to: "/status/success" });
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-64 h-48 mb-8">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
          <div className="relative">
            <Calendar className="w-20 h-20 text-blue-400" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Scheduled Events
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        You haven't scheduled any upcoming events. Once you do, they'll appear
        here for easy access.
      </p>
      <div className="w-[267px]">
        <CustomButton title="SCHEDULE EVENT" onClick={handleContinue} />
      </div>
    </div>
  );
};

export default ScheduledEvent;
