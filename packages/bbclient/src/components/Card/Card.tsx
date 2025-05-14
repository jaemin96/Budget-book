import { BaseProps } from "@/common/types";
import styles from "./styles/card.module.scss";
import classNames from "classnames";

interface CardProps extends BaseProps {
  title?: string;
  buttons?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  buttons,
  className,
  children,
  ...props
}) => {
  return (
    <>
      <div className={classNames(styles.card)} {...props}>
        <div className={classNames(styles.header)}>
          {title && <h2 className={classNames(styles.title)}>{title}</h2>}
          {buttons && (
            <div className={classNames(styles[`button-wrapper`])}>
              {buttons}
            </div>
          )}
        </div>
        <div className={classNames(styles.main)}>{children}</div>
        {/* optional) footer - 추후 기획 생기면 추가 */}
        {false && <div className={classNames(styles.footer)}></div>}
      </div>
    </>
  );
};

export default Card;
