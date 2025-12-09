import { createFileRoute, useNavigate } from "@tanstack/react-router";
import check from "@assets/onBoarding/checks.png";
import bottom from "@assets/onBoarding/bottom.png";
import { DecorativeBottomImage } from "@components/accessories/decorative-bottom-image";

export const Route = createFileRoute("/status/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const handleContinue = () => {
    // Handle navigation to next screen
    /* eslint-disable */ console.log("Continuing to next screen...");
    navigate({ to: "/organizer" });
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 md:space-y-6 transition-transform duration-700 ease-in-out w-full max-w-2xl mx-auto">
        {/* Success Icon */}
        <div 
          className="flex items-center justify-center mb-6 sm:mb-8 md:mb-12"
          style={{ 
            width: 'clamp(72px, 8vw + 48px, 96px)',
            height: 'clamp(80px, 9vw + 53px, 107px)'
          }}
        >
          <img src={check} alt="Success checkmark" className="w-full h-full object-contain" />
        </div>

        {/* Success Message */}
        <div className="space-y-2 sm:space-y-2.5 md:space-y-3 w-full">
          <h2 
            className="font-bold text-gray-900 leading-tight px-2 sm:px-4"
            style={{ fontSize: 'clamp(24px, 2.5vw + 18px, 36px)' }}
          >
            Your profile has been successfully created.
          </h2>
          <div 
            className="space-y-1 sm:space-y-1.5 md:space-y-2 text-gray-600 px-2 sm:px-4"
            style={{ fontSize: 'clamp(14px, 1.5vw + 10px, 16px)' }}
          >
            <p>Tip: Keep your portfolio updated and respond quickly</p>
            <p>to new booking requests to increase your visibility.</p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full max-w-md bg-[#7417C6] hover:bg-[#5f1399] active:bg-[#4d1077] text-white font-medium py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl transition-colors duration-200 mt-6 sm:mt-7 md:mt-8"
          style={{ fontSize: 'clamp(16px, 1.5vw + 12px, 18px)' }}
        >
          Go to Dashboard
        </button>
      </div>
    <DecorativeBottomImage />
    </div>
  );
}
  