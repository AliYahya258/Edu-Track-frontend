import { cn } from "@/utils/cn";

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-700", className)}
            {...props}
        />
    );
};

export { Skeleton };
