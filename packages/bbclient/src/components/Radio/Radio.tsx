"use client";

import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/radio.module.scss";

interface RadioProps extends BaseProps {
  value?: any;
  name?: string;
  type?: string;
}

const Radio: React.FC<RadioProps> = ({ value, name, className, ...props }) => {
  return (
    <>
      <label>
        <input type="radio" name={name} value={value} />
      </label>
    </>
  );
};

export default Radio;
