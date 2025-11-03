import Modal from './MainModal';
import img from "../../assets/tick.png"

const SuccesConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode
}> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      animationDuration={300}
    >
      <div className="text-center py-6">
        {/* check Icon */}
        <div className="flex justify-center mb-6">
            <img src={img} alt="" className='w-[96px] h-[96px]'/>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>

        {/* Description */}
        {description}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border-2 border-[#7417C6] text-[#7417C6] rounded-2xl hover:bg-purple-50 transition-colors font-semibold text-lg"
          >
            Request Vendors
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 cursor-pointer py-4 bg-[#17B26A] text-white rounded-2xl hover:bg-green-600 transition-colors font-semibold text-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccesConfirmationModal