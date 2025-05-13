import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/footer.module.scss";

export interface FooterProps extends BaseProps<HTMLElement> {}

export const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <div {...props} className={classNames(styles.className)}>
      Footer
    </div>
  );
};
