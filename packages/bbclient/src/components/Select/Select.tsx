"use client";

import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/select.module.scss";

interface SelectProps extends BaseProps {
  value?: any;
  name?: string;
  type?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  name,
  className,
  ...props
}) => {
  return (
    <>
      <select
        name={name}
        value={value}
        style={{ width: "100%", height: "2.75rem" }}
      ></select>
    </>
  );
};

export default Select;
