"use client";

import classNames from "classnames";
import styles from "./styles/skeleton.module.scss";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className,
}) => {
  const style: React.CSSProperties = {};

  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }

  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <div
      className={classNames(
        styles.skeleton,
        styles[variant],
        className
      )}
      style={style}
    />
  );
};

export default Skeleton;
