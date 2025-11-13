import Image from "@components/accessories/image";
import React, { memo } from "react";

type ImageListProps = {
  images: string[];
};

const ImageList: React.FC<ImageListProps> = ({ images = [] }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          src={image}
          alt="Image"
          parentClassName="aspect-square bg-black/10"
          className="w-full h-full object-cover object-center"
        />
      ))}
    </div>
  );
};

export default memo(ImageList);
