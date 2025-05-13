import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "./styles/header.module.scss";

export interface HeaderProps extends BaseProps<HTMLElement> {}

export const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <div {...props} className={classNames(styles.className)}>
      Header
    </div>
  );
};
