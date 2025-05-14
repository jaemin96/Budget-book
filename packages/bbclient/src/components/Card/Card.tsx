import { ReactNode } from "react";
import styles from "./styles/card.module.scss";
import classNames from "classnames";

interface CardComposition {
  Header: React.FC<{ title: string; buttons?: ReactNode }>;
  Body: React.FC<{ children: ReactNode }>;
}

const Card: React.FC<{ children: ReactNode }> & CardComposition = ({
  children,
}) => {
  return <div className={classNames(styles.card)}>{children}</div>;
};

Card.Header = ({ title, buttons }) => (
  <div className={classNames(styles.header)}>
    <div className={classNames(styles.titleWrapper)}>{title}</div>
    {buttons && (
      <div className={classNames(styles.buttonWrapper)}>{buttons}</div>
    )}
  </div>
);
Card.Body = ({ children }) => (
  <div className={classNames(styles.main)}>{children}</div>
);

export default Card;
