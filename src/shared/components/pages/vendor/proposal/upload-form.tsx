import {
  UploadIconContainer,
  UploadInnerChildrenContainer,
} from "@components/accessories/upload-input-field";
import { cn } from "@utils/classnames";
import { FileText, ImageIcon } from "lucide-react";
import React, { forwardRef, memo } from "react";

interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  parentClassName?: string;
}

const UploadForm = forwardRef<HTMLInputElement, UploadProps>(
  ({ label, value, onChange, className, parentClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full space-y-3", parentClassName)}>
        {label && (
          <label className="block text-gray-600 text-sm mb-2 font-medium">
            {label}
          </label>
        )}
        <div className="border border-dashed rounded-2xl p-5 h-[clamp(100px,30vh,30rem)] border-black/10 bg-[#f7f7f7] relative">
          <div className="flex flex-col gap-3 items-center justify-center size-full rounded-lg border border-dashed border-[#7417C6] bg-[#7417C6]/10">
            <div className="flex flex-row gap-4 items-center justify-center text-center opacity-60">
              <UploadInnerChildrenContainer
                title="Images"
                value="JPG, PNG"
                icon={
                  <UploadIconContainer>
                    <ImageIcon className="size-4 text-text" />
                  </UploadIconContainer>
                }
              />
              <UploadInnerChildrenContainer
                title="Documents"
                value="PDF, DOCX"
                icon={
                  <UploadIconContainer>
                    <FileText className="size-4 text-text" />
                  </UploadIconContainer>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

UploadForm.displayName = "UploadInputField";

export default memo(UploadForm);
