import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-secondary text-fg-primary hover:bg-tertiary",
				outline:
					"border border-primary bg-transparent text-fg-primary hover:bg-secondary",
				ghost: "bg-transparent text-fg-primary hover:bg-tertiary",
				link: "bg-transparent text-accent underline-offset-4 hover:underline",
			},
			size: {
				xs: "text-xs px-2 py-1 rounded-md",
				sm: "text-sm px-3 py-1.5 rounded-md",
				md: "text-base px-4 py-2 rounded-md",
				lg: "text-lg px-6 py-3 rounded-lg",
				xl: "text-xl px-8 py-4 rounded-lg",
			},
			color: {
				primary: "bg-success text-fg-primary hover:bg-tertiary",
				secondary: "bg-secondary text-fg-primary hover:bg-tertiary",
				success: "bg-success text-fg-inverse hover:bg-success/90",
				warning: "bg-warning text-fg-primary hover:bg-tertiary",
				error: "bg-error text-fg-primary hover:bg-tertiary",
				info: "bg-info text-fg-primary hover:bg-tertiary",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			color: "primary",
		},
	},
);

interface ButtonProps {
	type?: "button" | "submit" | "reset";
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
	disabled?: boolean;
	onClick?: () => void;
	children?: ReactNode;
	className?: string;
	icon?: ReactNode;
}

export const Button = ({
	type = "button",
	variant = "default",
	size = "md",
	color = "primary",
	disabled,
	onClick,
	children,
	className,
	icon,
	...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => {
	return (
		<button
			type={type}
			className={`${buttonVariants({ variant, size, color })} ${className || ""}`}
			disabled={disabled}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};
