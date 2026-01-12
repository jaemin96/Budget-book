"use client";

import classNames from "classnames";
import styles from "./styles/input.module.scss";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ value, name, type = "text", className, ...props }) => {
  return (
    <>
      <input
        className={classNames(styles.input)}
        type={type}
        name={name}
        value={value}
        spellCheck="false"
        {...props}
      />
    </>
  );
};

export default Input;
