"use client";

import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/input.module.scss";

interface InputProps extends BaseProps {
  value?: any;
  name?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  name,
  type = "text",
  className,
  ...props
}) => {
  return (
    <>
      <input
        className={classNames(styles.input)}
        type={type}
        name={name}
        value={value}
        {...props}
      />
    </>
  );
};

export default Input;
