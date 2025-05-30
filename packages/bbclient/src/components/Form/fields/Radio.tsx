import { useContext, useEffect } from "react";
import { RadioGroupContext } from "./RadioGroup";
import styles from "../fields/styles/radio.module.scss";
import classNames from "classnames";

export const Radio: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, children, className, style }) => {
  const {
    name,
    value: selectedValue,
    onChange,
  } = useContext(RadioGroupContext);

  const checked = selectedValue === value;

  return (
    <label className={classNames(styles.radio, className)} style={style}>
      <span
        className={classNames(styles.radio__myRadio, {
          [styles["radio__myRadio--checked"]]: checked,
        })}
      />
      <span
        className={classNames(styles.radio__label, {
          [styles["radio__label--checked"]]: checked,
        })}
      >
        {children}
      </span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
      />
    </label>
  );
};
