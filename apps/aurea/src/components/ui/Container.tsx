import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Page-width wrapper: 1440px max with the fluid side gutter. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cx("mx-auto w-full max-w-page px-gutter", className)}>{children}</Tag>;
}
