"use client";

import { LoaderCircle } from "lucide-react";
import classNames from "classnames";
import styles from "./styles/loading.module.scss";

interface LoadingSpinnerProps {}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <>
      <div className={classNames(styles.spinner)}>
        <LoaderCircle strokeWidth={3} />
      </div>
    </>
  );
};

export default LoadingSpinner;
