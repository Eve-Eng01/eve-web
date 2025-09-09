import { createFileRoute } from '@tanstack/react-router';
import { useState, FC } from 'react';
import { X } from 'lucide-react';
import Modal from '../../Accessories/MainModal';
import { ArrowLeft, ArrowRight } from 'iconsax-reactjs';

interface UploadFormComponentProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    externalLink: string;
    images: File[];
  }) => void;
}

export const UploadFormComponent: FC<UploadFormComponentProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
      setUploadedImages((prev) => [...prev, ...files]);
    }
  };

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
      setUploadedImages((prev) => [...prev, ...files]);
    }
  };

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (index >= uploadedImages.length - 1 && index > 0) {
      setCurrentImageIndex(index - 1);
    }
  };

  // Navigate to previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? uploadedImages.length - 1 : prev - 1));
  };

  // Navigate to next image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === uploadedImages.length - 1 ? 0 : prev + 1));
  };

  // Reset form
  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setExternalLink('');
    setUploadedImages([]);
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleDone = () => {
    onSubmit({
      title,
      description,
      externalLink,
      images: uploadedImages,
    });
    // Reset form after submission
    handleCancel();
  };

  return (
    <div className="space-y-6">
      {/* Header Text */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Image</h3>
        <p className="text-gray-600">
          Upload photos, You can also include links to your portfolio or social pages to help clients learn more about what you offer.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-colors h-[276px] flex justify-center items-center ${
          dragActive ? 'border-[#7417C6] bg-purple-50' : 'border-[#7417C6] bg-purple-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          {/* Carousel for uploaded images */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <div className="flex space-x-2 overflow-x-auto py-2">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-[130px] w-[120px] object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(index)}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="inline-flex items-center px-6 py-3 border-2 border-[#7417C6] text-[#7417C6] bg-white rounded-full font-medium hover:bg-[#7417C6] hover:text-white transition-colors">
            Upload Images
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
        className="bg-[transparent]"
      >
        {uploadedImages.length > 0 && (
          <div className="relative">
            <img
              src={URL.createObjectURL(uploadedImages[currentImageIndex])}
              alt={uploadedImages[currentImageIndex].name}
              className="w-full h-[674px] border-4 border-[#7417C6] rounded-[56px]"
            />
            {/* Navigation Arrows */}
            {uploadedImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute -left-5 top-1/2 border-2 border-[#7417C6] transform -translate-y-1/2 bg-white bg-opacity-50 p-5 rounded-[12px] hover:bg-opacity-75"
                  aria-label="Previous image"
                >
                  <ArrowLeft size="22" color="#7417C6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute -right-5 top-1/2 border-2 border-[#7417C6] transform -translate-y-1/2 bg-white bg-opacity-50 p-5 rounded-[12px] hover:bg-opacity-75"
                  aria-label="Next image"
                >
                  <ArrowRight size="22" color="#7417C6" />
                </button>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
          placeholder="Enter project title"
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Description
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none"
            rows={4}
            maxLength={1000}
            placeholder="Describe your project..."
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {description.length}/1000
          </div>
        </div>
      </div>

      {/* External Link Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add External Link
        </label>
        <input
          type="url"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          className="w-full px-4 py-3 border text-[#7417C6] border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
          placeholder="https://your-portfolio-link.com"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-6 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          className="px-6 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// Route Component
function RouteComponent() {
  return <UploadFormComponent onSubmit={() => {}} />;
}

// Tanstack Router Route
export const Route = createFileRoute('/Onboarding/SubServices/UploadFormModal')({
  component: RouteComponent,
});