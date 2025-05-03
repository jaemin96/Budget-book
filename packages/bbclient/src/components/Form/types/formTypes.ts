import { Direction } from "@/common/types";

export interface FormItemProps {
  label?: string;
  name?: string;
  direction?: Direction;
  children: React.ReactNode;
}
