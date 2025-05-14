"use client";

import { BaseProps } from "@/common/types";
import classNames from "classnames";
import styles from "../styles/sidebar.module.scss";

export interface SidebarProps extends BaseProps<HTMLElement> {}

export const Sidebar = ({ className, ...props }: SidebarProps) => {
  return (
    <div {...props} className={classNames(styles.className)}>
      Sidebar
    </div>
  );
};
