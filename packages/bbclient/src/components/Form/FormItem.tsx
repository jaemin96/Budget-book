import React from "react";
import { FormItemProps } from "./types/formTypes";

const FormItem = ({ label, children }: FormItemProps) => {
  return (
    <div className="form-item">
      {label && <label className="form-label">{label}</label>}
      <div className="form-control">{children}</div>
    </div>
  );
};

export default FormItem;
