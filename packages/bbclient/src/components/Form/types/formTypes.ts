import { BaseProps, Direction } from "@/common/types";

export interface FormItemProps extends BaseProps<HTMLElement> {
  label?: string;
  name?: string;
  direction?: Direction;
}
