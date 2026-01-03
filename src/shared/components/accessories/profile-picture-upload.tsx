import React, { useState, ChangeEvent, DragEvent, useCallback, useMemo } from "react";
import { Camera, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./main-modal";
import ImageEditor, { ImageEditData } from "./image-editor";
import { useUploadProfilePicture } from "@/shared/api/services/profile";
import { useToastStore } from "@/shared/stores/toast-store";

interface CroppedImage {
  url: string;
  edit: ImageEditData;
}

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  onImageUploaded?: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  size = "lg",
}) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(currentImageUrl || null);
    const [cropped, setCropped] = useState<CroppedImage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const uploadProfilePictureMutation = useUploadProfilePicture();
    const showToast = useToastStore((state) => state.showToast);

    // Hidden file input ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const fileReaderRef = React.useRef<FileReader | null>(null);

    // Memoize size configuration
    const config = useMemo(() => {
      const sizeConfig = {
        sm: { container: "w-[80px] h-[80px]", badge: "w-5 h-5", icon: "w-3 h-3" },
        md: { container: "w-[120px] h-[120px]", badge: "w-7 h-7", icon: "w-4 h-4" },
        lg: { container: "w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]", badge: "w-8 h-8 sm:w-9 sm:h-9", icon: "w-4 h-4 sm:w-5 sm:h-5" },
      };
      return sizeConfig[size];
    }, [size]);

    /**
     * Validate file size (max 10MB)
     */
    const validateFileSize = useCallback((file: File): boolean => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showToast("File size must be less than 10MB", "error");
        return false;
      }
      return true;
    }, [showToast]);

    /**
     * Validate file type
     */
    const validateFileType = useCallback((file: File): boolean => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        showToast("File must be an image (JPEG, PNG, GIF, or WebP)", "error");
        return false;
      }
      return true;
    }, [showToast]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }, []);

    const processFile = useCallback((file: File) => {
      // Abort previous file reading if any
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }

      setSelectedFile(file);
      const reader = new FileReader();
      fileReaderRef.current = reader;

      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setUploadedImage(url);
        setCropped(null);
        setIsModalOpen(true);
        fileReaderRef.current = null;
      };

      reader.onerror = () => {
        showToast("Failed to read image file", "error");
        fileReaderRef.current = null;
      };

      reader.readAsDataURL(file);
    }, [showToast]);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        if (!validateFileSize(file)) return;
        if (!validateFileType(file)) return;
        processFile(file);
      }
    }, [validateFileSize, validateFileType, processFile]);

    const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!validateFileSize(file)) return;
        if (!validateFileType(file)) return;
        processFile(file);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }, [validateFileSize, validateFileType, processFile]);

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        // Abort any ongoing file reading
        if (fileReaderRef.current) {
          fileReaderRef.current.abort();
        }
      };
    }, []);

    /**
     * Convert data URL to File (optimized)
     */
    const dataURLtoFile = useCallback((dataurl: string, filename: string): Promise<File> => {
      return new Promise((resolve, reject) => {
        try {
          const arr = dataurl.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
          const bstr = atob(arr[1]);
          const n = bstr.length;
          const u8arr = new Uint8Array(n);
          
          for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
          }
          
          resolve(new File([u8arr], filename, { type: mime }));
        } catch (error) {
          reject(error);
        }
      });
    }, []);

    const handleSaveImage = useCallback(async (croppedUrl: string, editData: ImageEditData) => {
      // Upload the image immediately
      setIsUploading(true);
      try {
        // Convert the cropped data URL to a file
        const fileToUpload = await dataURLtoFile(croppedUrl, "profile-picture.png");
        
        if (!validateFileSize(fileToUpload)) {
          setIsUploading(false);
          return;
        }

        // Upload the file - mutation handles success/error toasts internally
        const response = await uploadProfilePictureMutation.mutateAsync(fileToUpload);

        // Check if upload was successful
        if (response?.status) {
          // Notify parent component of the new URL if available
          if (response.data?.url) {
            onImageUploaded?.(response.data.url);
          }
          
          // Save the cropped image data for display
          setCropped({ url: croppedUrl, edit: editData });
          
          // Clear the selected file since it's now uploaded
          setSelectedFile(null);
          setUploadedImage(null);
          
          // Small delay to show success state before closing
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Close modal after successful upload
          setIsModalOpen(false);
        }
        // If response.status is false, the mutation's onError will handle the toast
      } catch (error) {
        // Error is already handled by the mutation's onError callback
        console.error("Failed to upload profile picture:", error);
        // Keep modal open on error so user can try again
      } finally {
        setIsUploading(false);
      }
    }, [dataURLtoFile, validateFileSize, uploadProfilePictureMutation, onImageUploaded]);

    const triggerFileUpload = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    // Memoize display image calculation
    const displayImage = useMemo(() => {
      return cropped?.url || uploadedImage || currentImageUrl;
    }, [cropped?.url, uploadedImage, currentImageUrl]);

    return (
      <>
        <div className="relative shrink-0">
          <div
            className={`${config.container} rounded-full border border-[rgba(0,0,0,0.08)] bg-white p-1.5 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-[rgba(0,0,0,0.08)] bg-gray-100 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {displayImage ? (
                  <motion.img
                    key={displayImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    src={displayImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <User className="w-1/2 h-1/2 text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Camera Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileUpload();
            }}
            className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 ${config.badge} bg-purple-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-purple-700 transition-colors shadow-lg`}
            aria-label="Upload profile picture"
          >
            <Camera className={`${config.icon} text-white`} />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* IMAGE EDITOR MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => !isUploading && setIsModalOpen(false)}
          title="Edit Profile Picture"
          size="xl"
          animationDuration={400}
          closeOnOverlayClick={!isUploading}
          closeOnEscape={!isUploading}
        >
          <div className="relative">
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="animate-spin h-10 w-10 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-purple-600 font-medium">Uploading your image...</span>
                </div>
              </div>
            )}
            {(uploadedImage || cropped?.url) && (
              <ImageEditor
                imageUrl={uploadedImage || cropped!.url}
                initialEdit={cropped?.edit}
                onSave={handleSaveImage}
                onCancel={() => !isUploading && setIsModalOpen(false)}
                isLoading={isUploading}
              />
            )}
          </div>
        </Modal>
      </>
    );
};

export default ProfilePictureUpload;

