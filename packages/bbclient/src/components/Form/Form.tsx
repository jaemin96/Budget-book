import React, { forwardRef } from "react";
import FormItem from "./FormItem";
import { FormItemProps } from "./types/formTypes";

type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

interface FormComponent
  extends React.ForwardRefExoticComponent<
    FormProps & React.RefAttributes<HTMLFormElement>
  > {
  Item: React.FC<FormItemProps>;
}

const BaseForm = forwardRef<HTMLFormElement, FormProps>(
  ({ children, ...props }, ref) => {
    return (
      <form ref={ref} {...props}>
        {children}
      </form>
    );
  }
);

const Form = BaseForm as FormComponent;
Form.Item = FormItem;

export default Form;
