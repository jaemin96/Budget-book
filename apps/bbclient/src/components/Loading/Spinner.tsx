"use client";

import { LoaderCircle } from "lucide-react";
import classNames from "classnames";
import styles from "./styles/loading.module.scss";

interface LoadingSpinnerProps {
  color?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color,
  size = 20
}) => {
  return (
    <>
      <div className={classNames(styles.spinner)} style={{ color }}>
        <LoaderCircle strokeWidth={3} size={size} />
      </div>
    </>
  );
};

export default LoadingSpinner;
