import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/nav.module.scss";

export interface NavProps extends BaseProps<HTMLElement> {}

export const Nav = ({ className, ...props }: NavProps) => {
  return (
    <div {...props} className={classNames(styles.className)}>
      Nav
    </div>
  );
};
