import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "standout" | "subtle";
  text?: string;
  // This allows passing a component like: icon={TrashIcon}
  icon?: React.ElementType;
}

export default function Button({
  size = "md",
  variant = "standout",
  text,
  icon: Icon, // Rename to Uppercase so we can render it as <Icon />
  className,
  children,
  ...props
}: ButtonProps) {
  // Define icon sizes in one central place
  const iconSizes = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md  focus-visible:outline-2 outline-sub",
        !className?.includes("transition") && "transition-snappy",
        {
          "text-sub": props.disabled,
          "bg-sub-bg": variant === "standout",
          "hover:bg-black": variant === "standout" && !props.disabled,
          // For subtle variant, we only want the hover effect if it's not disabled
          "hover:bg-sub-bg": variant === "subtle" && !props.disabled,
          "active:scale-95": !props.disabled,

          // size classes
          "p-2 text-xs": size === "sm",
          "p-2.5 text-sm": size === "md",
          "p-4 text-base": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {/* 1. Render the Icon prop if it exists */}
      {Icon && <Icon className={iconSizes[size]} aria-hidden="true" />}

      {/* 2. Render the Text prop */}
      {text && <span>{text}</span>}

      {/* 3. Still allow children for edge cases */}
      {children}
    </button>
  );
}
