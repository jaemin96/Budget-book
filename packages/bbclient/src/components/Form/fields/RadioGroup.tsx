import { createContext, useContext } from "react";
import classNames from "classnames";
import styles from "../fields/styles/radio.module.scss";

export const RadioGroupContext = createContext<{
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}>({});

export const RadioGroup: React.FC<{
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}> = ({ name, value, onChange, children }) => {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div role="radio" className={classNames(styles.radioGroup)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
