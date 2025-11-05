import React, { memo } from "react";
import { cn } from "../../utils/classnames";

type EmptyContentProps = {
  title: string;
  description: string;
  image: string;
};

const EmptyContent: React.FC<EmptyContentProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div className="w-full p-10 items-center gap-6 flex flex-col justify-center text-center bg-[#F4F4F4]">
      <img
        src={image}
        alt={"Unable to load image"}
        className={cn(
          "size-30 object-contain object-center",
          !image && "bg-black/10"
        )}
      />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title || "No data yet"}</h2>
        <p className="text-black/60 text-sm max-w-md">
          {description || "There is no data to display yet"}
        </p>
      </div>
    </div>
  );
};

export default memo(EmptyContent);
