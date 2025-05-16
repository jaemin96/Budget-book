import { ReactNode } from "react";
import styles from "./styles/card.module.scss";
import classNames from "classnames";
import { Disc, LucideIcon } from "lucide-react";
import { Direction } from "@/common/types";
interface CardComposition {
  Header: React.FC<{
    icon?: LucideIcon;
    title: string;
    buttons?: ReactNode;
    direction?: Direction;
  }>;
  Body: React.FC<{ children: ReactNode }>;
}

const Card: React.FC<{ children: ReactNode }> & CardComposition = ({
  children,
}) => {
  return <div className={classNames(styles.card)}>{children}</div>;
};

Card.Header = ({
  icon: Icon = Disc,
  title,
  buttons,
  direction = "horizontal",
}) => (
  <div className={classNames(styles.header, styles[`header--${direction}`])}>
    <div className={classNames(styles.titleWrapper)}>
      <Icon className={classNames(styles.icon)} />
      <span className={classNames(styles.title)}>{title}</span>
    </div>
    {buttons && (
      <div className={classNames(styles.buttonWrapper)}>{buttons}</div>
    )}
  </div>
);

Card.Body = ({ children }) => (
  <div className={classNames(styles.main)}>{children}</div>
);

export default Card;
