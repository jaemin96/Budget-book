"use client";

import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/select.module.scss";

interface SelectProps extends BaseProps {
  value?: string | number;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

interface SelectOptionProps {
  value: string | number;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> & { Option: typeof SelectOption } = ({
  value,
  name,
  className,
  onChange,
  children,
  ...rest
}) => {
  return (
    <>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={classNames(styles.select, className)}
        {...rest}
      >
        {children}
      </select>
    </>
  );
};

const SelectOption: React.FC<SelectOptionProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

Select.Option = SelectOption;
export default Select;
