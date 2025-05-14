"use client";

import React from "react";
import { FormItemProps } from "./types/formTypes";
import styles from "./styles/form.module.scss";
import classNames from "classnames";

const FormItem = ({
  label,
  children,
  direction = "vertical",
}: FormItemProps) => {
  const directionClass = styles[`form-item-${direction}`];

  return (
    <div className={classNames(styles["form-item"], directionClass)}>
      {label && <label className={styles["form-label"]}>{label}</label>}
      <div className={styles["form-control"]}>{children}</div>
    </div>
  );
};

export default FormItem;
