import { ScrollArea as ScrollAreaPrimitive } from "@base-ui-components/react";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { cn } from "@/lib/ui";

/**
 * ScrollArea component - A native scroll container with custom scrollbars.
 *
 * Built on Base UI's Scroll Area primitive with Tailwind styling. Provides custom
 * scrollbars that match your design system while maintaining native scroll behavior.
 *
 * Based on Base UI's Scroll Area: https://base-ui.com/react/components/scroll-area
 *
 * @example
 * // Basic scroll area
 * <ScrollArea className="h-96">
 *   <p>Long content...</p>
 * </ScrollArea>
 *
 * @example
 * // With custom scrollbar styling
 * <ScrollArea className="h-screen" scrollbarClassName="bg-gray-200">
 *   <YourContent />
 * </ScrollArea>
 */
interface ScrollAreaProps
	extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
	/**
	 * Additional className for the scrollbar
	 */
	scrollbarClassName?: string;
	/**
	 * Additional className for the thumb (draggable part)
	 */
	thumbClassName?: string;
	/**
	 * Whether to show horizontal scrollbar
	 */
	horizontal?: boolean;
}

const ScrollArea = forwardRef<
	ComponentRef<typeof ScrollAreaPrimitive.Root>,
	ScrollAreaProps
>(
	(
		{
			className,
			content,
			scrollbarClassName,
			thumbClassName,
			horizontal = false,
			children,
			...props
		},
		ref,
	) => (
		<ScrollAreaPrimitive.Root
			ref={ref}
			className={cn("w-full h-full", className)}
			{...props}
			style={{
				backgroundColor: "var(--color-bg-primary)",
			}}
		>
			<ScrollAreaPrimitive.Viewport className="w-full h-full overscroll-contain rounded-md">
				<ScrollAreaPrimitive.Content className={cn(content)}>
					{children}
				</ScrollAreaPrimitive.Content>
			</ScrollAreaPrimitive.Viewport>

			{/* Vertical Scrollbar */}
			<ScrollAreaPrimitive.Scrollbar
				orientation="vertical"
				className={cn(
					"m-2 flex w-1 justify-center rounded-sm opacity-0 transition-opacity delay-300 pointer-events-none data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-75 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-75 data-scrolling:pointer-events-auto",
					scrollbarClassName,
				)}
				style={{
					backgroundColor: "var(--color-border-secondary)",
				}}
			>
				<ScrollAreaPrimitive.Thumb
					className={cn("w-full rounded-sm", thumbClassName)}
					style={{
						backgroundColor: "var(--color-fg-tertiary)",
					}}
				/>
			</ScrollAreaPrimitive.Scrollbar>

			{/* Horizontal Scrollbar (optional) */}
			{horizontal && (
				<ScrollAreaPrimitive.Scrollbar
					orientation="horizontal"
					className={cn(
						"m-2 flex h-1 justify-center rounded-sm opacity-0 transition-opacity delay-300 pointer-events-none data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-75 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-75 data-scrolling:pointer-events-auto",
						scrollbarClassName,
					)}
					style={{
						backgroundColor: "var(--color-border-secondary)",
					}}
				>
					<ScrollAreaPrimitive.Thumb
						className={cn("w-full rounded-sm", thumbClassName)}
						style={{
							backgroundColor: "var(--color-fg-tertiary)",
						}}
					/>
				</ScrollAreaPrimitive.Scrollbar>
			)}

			{/* Corner (shown when both scrollbars are visible) */}
			{horizontal && <ScrollAreaPrimitive.Corner className="bg-transparent" />}
		</ScrollAreaPrimitive.Root>
	),
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
