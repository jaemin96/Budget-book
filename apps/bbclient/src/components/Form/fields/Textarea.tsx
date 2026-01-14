"use client";

import styles from "./styles/textarea.module.scss";
import classNames from "classnames";

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ name, value, className, ...props }) => {
  return (
    <>
      <textarea
        name={name}
        value={value}
        className={classNames(styles.textarea, className)}
        spellCheck="false"
        {...props}
      />
    </>
  );
};

export default Textarea;
