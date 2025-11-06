import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/ui";

const gridVariants = cva("grid gap-4 w-full h-full", {
	defaultVariants: {
		cols: "auto",
		variant: "default",
	},
	variants: {
		cols: {
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
			auto: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
		},
		variant: {
			default: "grid-flow-row",
			dense: "grid-flow-row-dense",
		},
	},
});

/**
 * Grid component - A responsive CSS Grid container with configurable columns and flow behavior.
 *
 * Provides an easy-to-use grid system with responsive column layouts. All column options are
 * mobile-first, starting with 1 column on mobile and expanding based on screen size.
 *
 * @example
 * // Auto responsive grid (1 → 2 → 3 columns)
 * <Grid>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * @example
 * // Fixed 4-column responsive grid with dense packing
 * <Grid cols={4} variant="dense">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * @example
 * // With spanning elements
 * <Grid cols={3}>
 *   <Grid.Span span={2}>Wide item</Grid.Span>
 *   <div>Regular item</div>
 *   <Grid.Span span="full">Full width item</Grid.Span>
 * </Grid>
 *
 * @example
 * // Custom gap and styling
 * <Grid cols={2} className="gap-8 p-4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Grid>
 *
 * @param {Object} props - Component props
 * @param {1 | 2 | 3 | 4 | 'auto'} [props.cols='auto'] - Number of responsive columns
 * @param {'default' | 'dense'} [props.variant='default'] - Grid flow behavior (dense fills gaps intelligently)
 * @param {string} [props.className] - Additional CSS classes
 */
export const Grid = ({
	cols,
	variant,
	className,
	...props
}: ComponentProps<"div"> & VariantProps<typeof gridVariants>) => {
	return (
		<div
			className={cn(gridVariants({ cols, variant }), className)}
			{...props}
		/>
	);
};

const spanVariants = cva("", {
	defaultVariants: {
		span: 1,
	},
	variants: {
		span: {
			1: "col-span-1",
			2: "col-span-1 md:col-span-2",
			3: "col-span-1 md:col-span-2 lg:col-span-3",
			full: "col-span-full",
		},
	},
});

/**
 * Grid.Span component - A grid item that can span multiple columns.
 *
 * Use this component within a Grid to create items that span multiple columns.
 * Span values are responsive, starting at 1 column on mobile and expanding based on screen size.
 *
 * @example
 * // Item that spans 2 columns on tablet and up
 * <Grid.Span span={2}>
 *   <Card />
 * </Grid.Span>
 *
 * @example
 * // Item that spans full width
 * <Grid.Span span="full">
 *   <Banner />
 * </Grid.Span>
 *
 * @param {Object} props - Component props
 * @param {1 | 2 | 3 | 'full'} [props.span=1] - Number of columns to span (responsive)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Child elements
 */
Grid.Span = ({
	span,
	className,
	children,
	...props
}: ComponentProps<"div"> & VariantProps<typeof spanVariants>) => {
	return (
		<div className={cn(spanVariants({ span }), className)} {...props}>
			{children}
		</div>
	);
};
