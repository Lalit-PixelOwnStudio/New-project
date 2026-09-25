import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import s from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "m" | "s" | "l";

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

const cls = ({ variant = "primary", size = "m", wide, className }: Common) =>
  [s.button, s[variant], s[size], wide ? s.wide : "", className ?? ""].filter(Boolean).join(" ");

export function Button({ variant, size, wide, className, children, ...rest }: Common & Omit<ComponentProps<"button">, "children">) {
  return (
    <button className={cls({ variant, size, wide, className, children })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, wide, className, children, ...rest }: Common & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link className={cls({ variant, size, wide, className, children })} {...rest}>
      {children}
    </Link>
  );
}
