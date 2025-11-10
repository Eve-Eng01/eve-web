import React, { memo } from "react";

type VideoItemProps = {
  video: string;
  thumbnail: string;
};

export type VideoListProps = {
  videos: VideoItemProps[];
};

const VideoList: React.FC<VideoListProps> = ({ videos = [] }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div
          key={video?.video}
          className="w-full aspect-video relative bg-black/10"
        >
          <img
            src={video?.thumbnail}
            alt="Video"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
};

export default memo(VideoList);
