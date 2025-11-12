import { cn } from "@utils/classnames";
import { memo } from "react";

type InformationCardProps = {
  className?: string;
  title: string;
  value?: string;
  rightContent?: React.ReactNode;
  valueClassName?: string;
};

const InformationCard: React.FC<InformationCardProps> = ({
  className,
  title,
  value,
  rightContent,
  valueClassName,
}) => {
  return (
    <div
      className={cn("flex items-center gap-2 opacity-60 text-sm", className)}
    >
      <h1 className="">{title}</h1>
      {rightContent ? (
        rightContent
      ) : (
        <p className={cn("font-medium", valueClassName)}>{value}</p>
      )}
    </div>
  );
};

export default memo(InformationCard);
