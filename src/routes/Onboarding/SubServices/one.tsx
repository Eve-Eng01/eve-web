import { createFileRoute } from '@tanstack/react-router';
import logo from '../../../assets/evaLogo.png';
import { CustomButton } from '../../Accessories/Button';
import { useState } from 'react';

// Define the props interface for ServiceOne
interface ServiceOneProps {
  continue: () => void;
  back: () => void;
}

export const Route = createFileRoute('/Onboarding/SubServices/one')({
  component: ServiceOne,
});

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  count: number;
  size: string;
  thumbnail: string;
}

export function ServiceOne({ continue: handleContinue, back: handleGoBack }: ServiceOneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDeleteFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleViewFile = (fileId: number) => {
    console.log('View file:', fileId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/quicktime',
    ];

    const newFiles: UploadedFile[] = Array.from(files)
      .filter((file) => allowedTypes.includes(file.type))
      .map((file, index) => {
        const fileType = file.type.split('/')[0]; // e.g., 'image', 'video', 'application'
        const type = fileType === 'application' ? 'document' : fileType;
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Convert bytes to MB
        const thumbnail = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : type === 'video'
          ? 'https://via.placeholder.com/150?text=Video' // Placeholder for videos
          : 'https://via.placeholder.com/150?text=Document'; // Placeholder for documents

        return {
          id: uploadedFiles.length + index + 1,
          name: file.name,
          type,
          count: 1, // Assuming single file upload per selection
          size: `${sizeInMB}MB`,
          thumbnail,
        };
      });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <div className="mx-auto text-center">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">Showcase Your Work</h2>
        <p className="text-black para">
          Upload photos, videos, or documents of your past work, equipment, or venues. You can also include links to your portfolio or social pages to help clients learn more about what you offer.
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
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-sm">Images</span>
              <span className="text-xs text-gray-500">JPG, PNG</span>
            </div>

            {/* Documents */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-sm">Documents</span>
              <span className="text-xs text-gray-500">PDF, DOCX</span>
            </div>

            {/* Videos */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-sm">Videos</span>
              <span className="text-xs text-gray-500">MP4, MOV</span>
            </div>
          </div>
          {/* File Input */}
          <div className="flex justify-center">
            <label className="cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Upload Files
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.docx,.mp4,.mov"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {uploadedFiles.map((file: UploadedFile) => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {/* File Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                  </div>

                  {/* File Info */}
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 text-sm">{file.name}</h3>
                    <p className="text-xs text-gray-500">
                      You've uploaded {file.count} {file.type} • {file.size}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
  );
}