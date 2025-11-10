import { cn } from "@utils/classnames";
import { Document, VideoSquare } from "iconsax-reactjs";
import { ImageIcon } from "lucide-react";
import React, { forwardRef, memo } from "react";

interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  parentClassName?: string;
  children?: React.ReactNode;
  files: File[];
}

export const UploadIconContainer: React.FC<React.PropsWithChildren> = memo(
  ({ children }) => {
    return (
      <div className="flex flex-col items-center justify-center text-center border border-black/10 rounded-full size-10">
        {children}
      </div>
    );
  }
);

export const UploadInnerChildrenContainer: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = memo(({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {icon}
      <div className="inline-flex flex-col items-center gap-2 justify-center text-center text-sm text-text">
        <p className="font-bold">{title}</p>
        <p className="opacity-60">{value}</p>
      </div>
    </div>
  );
});

export const SelectedFileItem: React.FC<{ file: File }> = memo(({ file }) => {
  const { size, type, name } = file;
  const isImage = type.startsWith("image");
  const isVideo = type.startsWith("video");
  const isDocument = type.startsWith("application");
  return (
    <div className="w-full items-center flex flex-row gap-6 bg-white">
      <div
        className={cn(
          "size-10",
          !isImage &&
            "border border-black/10 rounded-full p-2 items-center justify-center flex flex-col"
        )}
      >
        {isImage && (
          <img
            src={URL.createObjectURL(file)}
            alt={name}
            className="size-full object-cover"
          />
        )}
        {isVideo && <VideoSquare className="size-6 text-text" />}
        {isDocument && <Document className="size-6 text-text" />}
      </div>
      <div className="flex flex-col gap-2 items-start">
        <p className="text-sm font-bold">{name}</p>
        <p className="text-sm opacity-60">{size}</p>
      </div>
    </div>
  );
});

export const SelectedFilesContainer: React.FC<{
  files: File[];
}> = memo(({ files }) => {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {files.map((file) => (
        <SelectedFileItem key={file.name} file={file} />
      ))}
    </div>
  );
});

const UploadInputField = forwardRef<HTMLInputElement, UploadProps>(
  (
    {
      label,
      value,
      onChange,
      className,
      parentClassName,
      children,
      files,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full space-y-3", parentClassName)}>
        {label && (
          <label className="block text-gray-600 text-sm mb-2 font-medium">
            {label}
          </label>
        )}
        <div className="border border-dashed rounded-2xl p-5 h-[clamp(100px,30vh,30rem)] border-black/10 bg-[#f7f7f7] relative">
          <div className="flex flex-col gap-3 items-center justify-center size-full rounded-lg border border-dashed border-[#7417C6] bg-[#7417C6]/10 relative">
            {children || (
              <div className="flex flex-col gap-2 items-center justify-center text-center">
                <UploadInnerChildrenContainer
                  title="Images"
                  value="JPG, PNG"
                  icon={
                    <UploadIconContainer>
                      <ImageIcon className="size-4 text-text" />
                    </UploadIconContainer>
                  }
                />
              </div>
            )}
            <input
              ref={ref}
              title="Upload files"
              placeholder="Upload files"
              type="file"
              multiple
              onChange={onChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              {...props}
            />
          </div>
          <SelectedFilesContainer files={files} />
        </div>
      </div>
    );
  }
);

UploadInputField.displayName = "UploadInputField";

export default memo(UploadInputField);
