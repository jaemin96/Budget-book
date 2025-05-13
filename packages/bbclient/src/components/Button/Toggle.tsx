import { useState } from "react";
import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/Button.module.scss";
import { ButtonType } from "./types/buttonTypes";

interface ToggleProps extends BaseProps<HTMLButtonElement> {
  isToggled?: boolean;
  type?: ButtonType;
}

export const Toggle = ({
  isToggled = false,
  type = "button",
  ...props
}: ToggleProps) => {
  const [visible, setVisible] = useState(isToggled);

  const handleVisible = () => {
    setVisible(!visible);
  };

  return (
    <button
      role="switch"
      type={type}
      aria-checked={visible}
      onClick={handleVisible}
      className={classNames(styles.toggle, {
        [styles["toggle--on"]]: visible,
        [styles["toggle--off"]]: !visible,
      })}
      data-testid="toggle"
      {...props}
    >
      <span className="toggle__thumb" />
    </button>
  );
};
