import { Calendar } from 'iconsax-reactjs'
import { Users } from 'lucide-react'
import { CustomButton } from '../../../../components/Button/Button'
import { useNavigate } from '@tanstack/react-router';

const DraftedEvent = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
        navigate({ to: "/Accessories/SuccessPage" });
    };

  return (
    <div className="flex flex-col items-center justify-center py-12">
        <div className="w-64 h-48 mb-8">
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                <div className="relative">
                    <Calendar className="w-20 h-20 text-amber-400" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-4 h-4 text-amber-500" />
                    </div>
                </div>
            </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Draft Events
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-8">
            Save your event ideas as drafts and come back to finish them later.
        </p>
        <div className="w-[267px]">
            <CustomButton title="PASSED EVENT" onClick={handleContinue} />
        </div>
    </div>
  )
}

export default DraftedEvent