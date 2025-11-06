import type { ReactNode } from "react";
import { cn } from "@/lib/ui";

interface TextProps {
	children?: ReactNode;
	center?: boolean;
	className?: string;
}

export const Text = {
	Title: ({ children, center, className }: TextProps) => {
		return (
			<h1
				className={cn("text-2xl font-bold", center && "text-center", className)}
			>
				{children}
			</h1>
		);
	},
	Subtitle: ({ children, center, className }: TextProps) => {
		return (
			<h2
				className={cn("text-xl font-bold", center && "text-center", className)}
			>
				{children}
			</h2>
		);
	},
	Heading3: ({ children, center, className }: TextProps) => {
		return (
			<h3
				className={cn("text-lg font-bold", center && "text-center", className)}
			>
				{children}
			</h3>
		);
	},
	Heading4: ({ children, center, className }: TextProps) => {
		return (
			<h4
				className={cn("text-md font-bold", center && "text-center", className)}
			>
				{children}
			</h4>
		);
	},
	Heading5: ({ children, center, className }: TextProps) => {
		return (
			<h5
				className={cn("text-sm font-bold", center && "text-center", className)}
			>
				{children}
			</h5>
		);
	},
	Heading6: ({ children, center, className }: TextProps) => {
		return (
			<h6
				className={cn("text-xs font-bold", center && "text-center", className)}
			>
				{children}
			</h6>
		);
	},
	Paragraph: ({ children, center, className }: TextProps) => {
		return (
			<p className={cn("text-base", center && "text-center", className)}>
				{children}
			</p>
		);
	},
	Small: ({ children, center, className }: TextProps) => {
		return (
			<small className={cn("text-sm", center && "text-center", className)}>
				{children}
			</small>
		);
	},
	Sub: ({ children, center, className }: TextProps) => {
		return (
			<sub className={cn("text-sm", center && "text-center", className)}>
				{children}
			</sub>
		);
	},
	Sup: ({ children, center, className }: TextProps) => {
		return (
			<sup className={cn("text-sm", center && "text-center", className)}>
				{children}
			</sup>
		);
	},
	Caption: ({ children, center, className }: TextProps) => {
		return (
			<caption className={cn("text-xs", center && "text-center", className)}>
				{children}
			</caption>
		);
	},
};
