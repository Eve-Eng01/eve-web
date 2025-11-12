import { cn } from "@utils/classnames";
import React from "react";

const Image: React.FC<{
  src: string;
  alt: string;
  className?: string;
  parentClassName?: string;
}> = ({ src, alt, className, parentClassName }) => {
  return (
    <div className={cn("relative", parentClassName)}>
      <img
        src={src}
        alt={alt}
        className={cn("size-full object-cover object-center", className)}
      />
    </div>
  );
};

export default Image;
