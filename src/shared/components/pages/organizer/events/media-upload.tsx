import React, { useState, ChangeEvent, DragEvent, useImperativeHandle, forwardRef } from "react";
import { Image, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@tanstack/react-router";
import Modal from "../../../accessories/main-modal";
import ImageEditor, { ImageEditData } from "../../../accessories/image-editor";
import upload1 from "@assets/uploads/upload1.png";
import upload2 from "@assets/uploads/upload2.png";
import upload3 from "@assets/uploads/upload3.png";
import upload4 from "@assets/uploads/upload4.png";
import upload5 from "@assets/uploads/upload5.png";
import upload6 from "@assets/uploads/upload6.png";
import upload7 from "@assets/uploads/upload7.png";
import upload8 from "@assets/uploads/upload8.png";
import { useUploadMedia } from "@/shared/api/services/events/events.hooks";
import { useToastStore } from "@/shared/stores/toast-store";

interface Theme {
  id: number;
  image: string;
}

interface CroppedImage {
  url: string;
  edit: ImageEditData;
}

interface MediaUploadProps {
  eventId?: string | null; // Event ID for API calls
  onMediaUploaded?: (url: string) => void; // Callback when media is uploaded
}

export interface MediaUploadHandle {
  uploadMedia: () => Promise<boolean>; // Returns true if upload succeeds, false otherwise
  isUploading: boolean;
  hasImage: boolean;
}

const MediaUpload = forwardRef<MediaUploadHandle, MediaUploadProps>(
  ({ eventId: propEventId, onMediaUploaded }, ref) => {
  const search = useSearch({ from: "/_organizer/organizer/events/create" });
  // Use eventId from props, fallback to query params
  const eventId = propEventId || (search as { eventId?: string })?.eventId || null;
  
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cropped, setCropped] = useState<CroppedImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadMediaMutation = useUploadMedia();
  const showToast = useToastStore((state) => state.showToast);

  // Hidden file input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const themes: Theme[] = [
    { id: 1, image: upload1 },
    { id: 2, image: upload2 },
    { id: 3, image: upload3 },
    { id: 4, image: upload4 },
    { id: 5, image: upload5 },
    { id: 6, image: upload6 },
    { id: 7, image: upload7 },
    { id: 8, image: upload8 },
    { id: 9, image: upload1 },
  ];

  /**
   * Convert image URL (from theme) to File object
   */
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /**
   * Validate file size (max 10MB)
   */
  const validateFileSize = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast("File size must be less than 10MB", "error");
      return false;
    }
    return true;
  };

  /**
   * Validate file type
   */
  const validateFileType = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("File must be an image (JPEG, PNG, GIF, or WebP)", "error");
      return false;
    }
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Validate file size
      if (!validateFileSize(file)) {
        return;
      }
      // Validate file type
      if (!validateFileType(file)) {
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setUploadedImage(url);
        setCropped(null);
        setSelectedTheme(null);
        // Don't upload yet - wait for Next button
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (!validateFileSize(file)) {
        return;
      }
      // Validate file type
      if (!validateFileType(file)) {
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setUploadedImage(url);
        setCropped(null);
        setSelectedTheme(null);
        // Don't upload yet - wait for Next button
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeClick = async (theme: Theme) => {
    setSelectedTheme(theme.id);
    setUploadedImage(theme.image);
    setCropped(null);
    // Convert theme image to File object
    try {
      const file = await urlToFile(theme.image, `theme-${theme.id}.png`);
      // Validate file size (theme images should be small, but check anyway)
      if (!validateFileSize(file)) {
        return;
      }
      setSelectedFile(file);
      // Don't upload yet - wait for Next button
    } catch (error) {
      console.error("Failed to convert theme image to file:", error);
      showToast("Failed to process theme image", "error");
    }
  };

  const handleChangeImage = () => {
    if (uploadedImage || cropped?.url) {
      setIsModalOpen(true);
    }
  };

  /**
   * Upload media to the API
   * Called when user clicks Next button
   */
  const uploadMedia = async (): Promise<boolean> => {
    if (!eventId) {
      showToast("Event ID is required to upload media", "error");
      return false;
    }

    // Check if there's an image to upload
    if (!selectedFile) {
      // Allow proceeding without an image (optional)
      return true;
    }

    // Validate file size again
    if (!validateFileSize(selectedFile)) {
      return false;
    }

    // Validate file type again
    if (!validateFileType(selectedFile)) {
      return false;
    }

    // Get the final file (either selected file or cropped image)
    let fileToUpload = selectedFile;

    // If there's a cropped image, convert it to a file
    if (cropped?.url) {
      try {
        fileToUpload = await dataURLtoFile(cropped.url, "event-media.png");
        // Validate cropped file size
        if (!validateFileSize(fileToUpload)) {
          return false;
        }
      } catch (error) {
        console.error("Failed to process cropped image:", error);
        showToast("Failed to process image", "error");
        return false;
      }
    }

    setIsUploading(true);
    try {
      const response = await uploadMediaMutation.mutateAsync({
        eventId,
        file: fileToUpload,
      });

      // Handle response structure: ApiResponse<UploadMediaResponse>
      // UploadMediaResponse has: { status, message, data: { url, assetId, provider } }
      // ApiResponse wraps it: { status, message, data: UploadMediaResponse }
      // So the URL is at: response.data.data.url
      let mediaUrl: string | undefined;
      
      if (response?.data?.data?.url) {
        // Standard structure: ApiResponse<UploadMediaResponse>
        mediaUrl = response.data.data.url;
      } else if ((response?.data as any)?.url) {
        // Fallback: if response.data is UploadMediaResponse directly
        mediaUrl = (response.data as any).url;
      }

      if (response?.status && mediaUrl) {
        onMediaUploaded?.(mediaUrl);
        // Success toast is handled by the hook
        return true;
      }
      
      // Even if URL is not found but status is true, consider it successful
      if (response?.status) {
        return true;
      }
      
      return false;
    } catch (error) {
      // Error toast is handled by the hook
      console.error("Failed to upload media:", error);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    uploadMedia,
    isUploading,
    hasImage: !!uploadedImage || !!cropped?.url,
  }));


  /**
   * Convert data URL to File
   */
  const dataURLtoFile = (dataurl: string, filename: string): Promise<File> => {
    return new Promise((resolve) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new File([u8arr], filename, { type: mime }));
    });
  };

  const handleSaveImage = (croppedUrl: string, editData: ImageEditData) => {
    setCropped({ url: croppedUrl, edit: editData });
    setIsModalOpen(false);
    // Don't upload yet - wait for Next button
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const hasImage = !!uploadedImage || !!cropped?.url;

  const borderStyle =
    "border-4 border-dashed border-purple-300 hover:border-purple-400";

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT: Upload / Preview ── */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Uploaded Image
          </h2>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              ${borderStyle}
              rounded-3xl bg-purple-50 flex flex-col items-center justify-center
              transition-all duration-300 relative overflow-hidden
              ${hasImage ? "w-[339px] h-[300px] mx-auto" : "min-h-[400px] w-full"}
            `}
          >
            {/* Placeholder */}
            {!hasImage && (
              <motion.div
                key="placeholder"
                className="flex flex-col items-center pointer-events-none"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Image className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl font-medium text-gray-800 mb-2">Images</p>
                <p className="text-gray-500">Drag and drop an image</p>
              </motion.div>
            )}

            {/* Cropped or Original Image Preview */}
            <AnimatePresence mode="wait">
              {hasImage && (
                <motion.div
                  key={cropped?.url || uploadedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={cropped?.url || uploadedImage!}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-3">
            {/* Edit Image Button */}
            {hasImage && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleChangeImage}
                className="w-full py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Image className="w-5 h-5" />
                Edit Image
              </motion.button>
            )}

            {/* Manual Upload Button (only when image exists) */}
            {hasImage && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={triggerFileUpload}
                className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload from Device
              </motion.button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Theme Picker ── */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose From Theme
          </h2>
          <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-2xl">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                onClick={() => handleThemeClick(theme)}
                className={`
                  aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all
                  ${selectedTheme === theme.id ? "ring-4 ring-purple-500 ring-offset-2" : ""}
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={theme.image}
                  alt={`Theme ${theme.id}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── IMAGE EDITOR MODAL ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Image Editor"
        size="xl"
        animationDuration={400}
      >
        {(uploadedImage || cropped?.url) && (
          <ImageEditor
            imageUrl={uploadedImage || cropped!.url}
            initialEdit={cropped?.edit}
            onSave={handleSaveImage}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
});

MediaUpload.displayName = "MediaUpload";

export default MediaUpload;