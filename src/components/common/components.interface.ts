import { FunctionComponent, ReactNode } from "react";

export type ChildrenProps = { children: ReactNode | ReactNode[] };

export type ComponentWithChildren = FunctionComponent<ChildrenProps>;

