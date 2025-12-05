import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@assets/evaLogo.png";
import { CustomButton } from "@components/accessories/button";
import Modal from "@components/accessories/main-modal";
import { UploadFormComponent } from "@components/accessories/upload-form-component";

export interface ServiceOneProps {
  continue: () => void;
  back: () => void;
}

export const Route = createFileRoute("/_organizer/organizer/onboarding/sub-services/one")({
  component: ServiceOne,
});

interface UploadedFile {
  id: number;
  title: string; // Title from the form
  description: string; // Description from the form
  externalLink: string; // External link from the form
  images: File[]; // Array of image files
  thumbnail: string; // Thumbnail of the first image
  type: string; // Type is always "image"
  count: number; // Number of images
  size: string; // Total size of all images
}

export function ServiceOne({
  continue: handleContinue,
  back: handleGoBack,
}: ServiceOneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleViewFile = (fileId: number) => {
    /* eslint-disable */ console.log("View file:", fileId);
  };

  const handleFormSubmit = (formData: {
    title: string;
    description: string;
    externalLink: string;
    images: File[];
  }) => {
    const { title, description, externalLink, images } = formData;
    if (images.length === 0) return; // Do not add if no images

    // Calculate total size in MB and format as string
    const totalSizeInMB = (
      images.reduce((acc, file) => acc + file.size, 0) /
      (1024 * 1024)
    ).toFixed(2);
    const thumbnail = URL.createObjectURL(images[0]); // Use first image for thumbnail

    const newFile: UploadedFile = {
      id: uploadedFiles.length + 1,
      title,
      description,
      externalLink,
      images,
      thumbnail,
      type: "image",
      count: images.length,
      size: `${totalSizeInMB}MB`,
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <div className="mx-auto text-center">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src={logo} alt="" className="w-[60px] h-[60px]" />
          </div>
          <h2 className="text-black header">Showcase Your Work</h2>
          <p className="text-black para">
            Upload photos, videos, or documents of your past work, equipment, or
            venues. You can also include links to your portfolio or social pages
            to help clients learn more about what you offer.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          {/* File Type Categories */}
          <div className="border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50 p-8 mb-6">
            <div className="flex justify-center items-center gap-8 mb-4">
              {/* Images */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  Images
                </span>
                <span className="text-xs text-gray-500">JPG, PNG</span>
              </div>

              {/* Documents */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  Documents
                </span>
                <span className="text-xs text-gray-500">PDF, DOCX</span>
              </div>

              {/* Videos */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  Videos
                </span>
                <span className="text-xs text-gray-500">MP4, MOV</span>
              </div>
            </div>
            {/* File Input */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {uploadedFiles.map((file: UploadedFile) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* File Thumbnail (First Image) */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={file.thumbnail}
                        alt={file.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File Info */}
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {file.title || "Untitled Product"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        You've uploaded {file.count} {file.type} • {file.size}
                      </p>
                      {file.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {file.description.slice(0, 100)}
                        </p>
                      )}
                      {file.externalLink && (
                        <a
                          href={file.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 hover:underline"
                        >
                          {file.externalLink}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleViewFile(file.id)}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CustomButton title="Continue" onClick={handleContinue} />
          <button onClick={handleGoBack} className="goBack">
            Go back
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Your Image"
        size="lg"
        animationDuration={400}
        className="max-w-2xl"
      >
        <UploadFormComponent onSubmit={handleFormSubmit} />
      </Modal>
    </>
  );
}
