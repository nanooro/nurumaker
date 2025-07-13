import * as React from "react";
import clsx from "clsx";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          id={id}
          type={type}
          className={clsx(
            "peer w-full rounded-md border border-gray-300 bg-transparent px-3 pt-6 pb-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-3 top-1 text-muted-foreground text-sm transition-all peer-focus:text-sm peer-focus:text-foreground"
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
