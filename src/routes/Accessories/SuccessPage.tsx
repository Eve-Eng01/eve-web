import { createFileRoute, useNavigate } from '@tanstack/react-router'
import check from "../../assets/onBoarding/checks.png";
import bottom from "../../assets/onBoarding/bottom.png";

export const Route = createFileRoute('/Accessories/SuccessPage')({
  component: RouteComponent,
})

function RouteComponent() {

    const navigate = useNavigate();
    const handleContinue = () => {
      // Handle navigation to next screen
      console.log("Continuing to next screen...");
      navigate({ to: "/Authentication/SignIn" });
    };

  return (
    <div className='relative min-h-screen bg-white flex flex-col items-center justify-center'>
        <div
            className={` flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-700 ease-in-out`}
        >
            {/* Success Icon */}
            <div className="w-[96px] h-[107px] flex items-center justify-center mb-[50px]">
                <img src={check} alt="" />
            </div>

            {/* Success Message */}
            <div className="space-y-3">
            <h2 className="text-[32px] font-bold text-gray-900">Your profile has been successfully created.</h2>
                <div className="space-y-2 text-gray-600">
                    <p>Tip: Keep your portfolio updated and respond quickly</p>
                    <p>to new booking requests to increase your visibility.</p>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                className="w-full max-w-md bg-[#7417C6] hover:bg-[#5f1399] text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 mt-8"
            >
            Go to Dashboard
            </button>
        </div>
        <div className="absolute bottom-0 overflow-hidden pointer-events-none">
            <div className="">
                <img src={bottom} alt="" className="w-full img" />
            </div>
        </div>
    </div>

  )
}
