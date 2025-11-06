import { useEffect, useRef, useState, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const dockVariants = cva(
	"flex gap-6 p-6 overflow-auto backdrop-blur-md rounded-3xl scroll-smooth snap-x snap-mandatory scrollbar-thin items-center",
	{
		variants: {
			variant: {
				default: "bg-secondary/50 shadow-lg border border-primary/20",
				glass: "bg-tertiary/30 shadow-xl border border-primary/10",
				solid: "bg-secondary shadow-md border border-primary",
			},
			orientation: {
				horizontal: "flex-row max-h-[calc(56px+3rem)] min-w-[344px] max-w-[calc(100%-2rem)] resize-x",
				vertical: "flex-col min-h-[340px] max-h-[calc(100vh-2rem)] resize-y max-w-[calc(56px+3rem)]",
			},
		},
		defaultVariants: {
			variant: "default",
			orientation: "horizontal",
		},
	},
);

const dockItemVariants = cva(
	"grid place-items-center rounded-lg flex-shrink-0 transition-all duration-200 snap-center",
	{
		variants: {
			size: {
				sm: "w-10 h-10",
				md: "w-14 h-14",
				lg: "w-16 h-16",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export interface DockItemProps {
	icon: ReactNode;
	href?: string;
	onClick?: () => void;
	label?: string;
}

export interface DockProps extends VariantProps<typeof dockVariants> {
	items: DockItemProps[];
	size?: "sm" | "md" | "lg";
	enableBlur?: boolean;
	enableParallax?: boolean;
	className?: string;
}

export const Dock = ({
	items,
	size = "md",
	variant = "default",
	orientation = "horizontal",
	enableBlur = false,
	enableParallax = false,
	className,
}: DockProps) => {
	const dockRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const nav = navRef.current;
		if (!nav) return;

		const items = nav.querySelectorAll("a, button");

		// Check if CSS scroll-driven animations are supported
		const supportsScrollTimeline = CSS.supports("animation-timeline: scroll()");

		if (!supportsScrollTimeline) {
			// Fallback: Use IntersectionObserver for scroll effects
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const target = entry.target as HTMLElement;
						const ratio = entry.intersectionRatio;

						if (enableBlur) {
							const blurAmount = Math.max(0, 1 - ratio * 2);
							target.style.setProperty("--blur", String(blurAmount));
						}

						if (enableParallax) {
							const scale = Math.min(1, ratio * 2);
							const svg = target.querySelector("svg");
							if (svg) {
								(svg as HTMLElement).style.setProperty("--parallax", String(scale));
							}
						}

						const scaleValue = 0.25 + (ratio * 0.75);
						target.style.setProperty("--scale", String(scaleValue));
					});
				},
				{
					root: nav,
					threshold: Array.from({ length: 100 }, (_, i) => i / 100),
				}
			);

			items.forEach((item) => observer.observe(item));

			return () => {
				items.forEach((item) => observer.unobserve(item));
			};
		}
	}, [enableBlur, enableParallax, orientation]);

	const containerClasses = `${dockVariants({ variant, orientation })} ${className || ""}`;
	const isVertical = orientation === "vertical";

	return (
		<div ref={dockRef} className={containerClasses}>
			<nav
				ref={navRef}
				className="flex gap-6 overflow-auto scroll-smooth w-full h-full items-center"
				style={{
					flexDirection: isVertical ? "column" : "row",
					scrollSnapType: isVertical ? "y mandatory" : "x mandatory",
				}}
			>
				{items.map((item, index) => {
					const ItemWrapper = item.href ? "a" : "button";
					const itemProps = item.href
						? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
						: { onClick: item.onClick, type: "button" as const };

					return (
						<ItemWrapper
							key={index}
							{...itemProps}
							className={`${dockItemVariants({ size })} bg-gradient-to-b from-fg-primary/10 to-transparent bg-tertiary shadow-[0_-1px_rgba(0,0,0,0.5)_inset,0_2px_4px_rgba(0,0,0,0.5),0_1px_rgba(255,255,255,0.5)_inset] hover:scale-110 active:scale-95`}
							style={{
								scale: "var(--scale, 1)",
								filter: enableBlur ? "blur(calc(var(--blur, 0) * 24px))" : undefined,
							}}
							title={item.label}
							aria-label={item.label}
						>
							<div
								className="w-[65%] h-[65%] text-fg-primary fill-current"
								style={{
									scale: enableParallax ? "var(--parallax, 1)" : undefined,
								}}
							>
								{item.icon}
							</div>
						</ItemWrapper>
					);
				})}
			</nav>
		</div>
	);
};

// CSS to be added to the global styles or theme
export const dockStyles = `
@supports (animation-timeline: scroll()) {
	.dock-item {
		animation-name: scale-in, scale-out;
		animation-fill-mode: both;
		animation-timing-function: ease-in-out;
		animation-direction: normal, reverse;
		animation-timeline: view(inline);
		animation-range: entry 0% entry 150%, exit -50% exit 100%;
	}

	.dock-vertical .dock-item {
		animation-timeline: view();
	}

	@keyframes scale-in {
		0% { scale: 0.25; }
	}

	@keyframes scale-out {
		100% { scale: 1; }
	}

	.dock-blur .dock-item {
		animation-name: blur-in, blur-out;
	}

	@keyframes blur-in {
		0% {
			scale: 0.25;
			filter: blur(24px);
		}
	}

	@keyframes blur-out {
		100% {
			scale: 1;
			filter: blur(0);
		}
	}

	.dock-parallax .dock-item svg {
		scale: 1;
		animation-name: icon-in, icon-out;
		animation-fill-mode: both;
		animation-timing-function: ease-in;
		animation-direction: normal, reverse;
		animation-timeline: view(inline);
		animation-range: entry -50% entry 250%, exit -150% exit 150%;
	}

	@keyframes icon-in {
		0% { scale: 0; }
	}

	@keyframes icon-out {
		100% { scale: 1; }
	}
}
`;

