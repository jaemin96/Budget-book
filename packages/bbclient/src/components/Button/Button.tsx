import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/Button.module.scss";
import { ButtonMode, ButtonSize, ButtonType } from "./types/buttonTypes";

interface ButtonProps extends BaseProps<HTMLButtonElement> {
  buttonMode?: ButtonMode;
  size?: ButtonSize;
  type?: ButtonType;
}

export const Button = ({
  style,
  onClick,
  className,
  buttonMode = "default",
  size = "small",
  type = "submit",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        {
          // buttonModes
          [styles[`button--${buttonMode}`]]: true,

          // sizes
          [styles[`button--${size}`]]: true,
        },
        className
      )}
      type={type}
      style={style}
      onClick={onClick}
      {...props}
    >
      {props.children}
    </button>
  );
};
