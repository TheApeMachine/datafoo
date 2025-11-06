import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/ui";

const flexVariants = cva("flex w-full h-full", {
	defaultVariants: {
		direction: "row",
		align: "start",
		justify: "start",
		wrap: "nowrap",
		gap: "none",
		inline: false,
	},
	variants: {
		direction: {
			row: "flex-row",
			column: "flex-col",
			"row-reverse": "flex-row-reverse",
			"column-reverse": "flex-col-reverse",
		},
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		wrap: {
			nowrap: "flex-nowrap",
			wrap: "flex-wrap",
			"wrap-reverse": "flex-wrap-reverse",
		},
		gap: {
			none: "gap-0",
			sm: "gap-2",
			md: "gap-4",
			lg: "gap-6",
			xl: "gap-8",
		},
		inline: {
			true: "inline-flex",
			false: "flex",
		},
	},
});

/**
 * Flex component - A flexible flexbox container with configurable direction, alignment, and spacing.
 *
 * Provides a powerful flexbox system with control over direction, alignment, justification,
 * wrapping behavior, and gap spacing.
 *
 * @example
 * // Basic row layout with centered items
 * <Flex direction="row" align="center" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 *
 * @example
 * // Column layout with space between items
 * <Flex direction="column" justify="between" gap="lg">
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Flex>
 *
 * @example
 * // Responsive wrapping layout
 * <Flex wrap="wrap" gap="md" justify="center">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Flex>
 *
 * @param {Object} props - Component props
 * @param {'row' | 'column' | 'row-reverse' | 'column-reverse'} [props.direction='row'] - Flex direction
 * @param {'start' | 'center' | 'end' | 'stretch' | 'baseline'} [props.align='start'] - Align items (cross-axis)
 * @param {'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'} [props.justify='start'] - Justify content (main-axis)
 * @param {'nowrap' | 'wrap' | 'wrap-reverse'} [props.wrap='nowrap'] - Flex wrap behavior
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl'} [props.gap='none'] - Gap spacing between items
 * @param {string} [props.className] - Additional CSS classes
 */
export const Flex = ({
	direction,
	align,
	justify,
	wrap,
	gap,
	inline,
	className,
	...props
}: ComponentProps<"div"> & VariantProps<typeof flexVariants>) => {
	return (
		<div
			className={cn(
				flexVariants({ direction, align, justify, wrap, gap, inline }),
				className,
			)}
			{...props}
		/>
	);
};

const rowVariants = cva("flex flex-row w-full", {
	defaultVariants: {
		align: "start",
		justify: "start",
		wrap: "nowrap",
		gap: "none",
		inline: false,
	},
	variants: {
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		wrap: {
			nowrap: "flex-nowrap",
			wrap: "flex-wrap",
			"wrap-reverse": "flex-wrap-reverse",
		},
		gap: {
			none: "gap-0",
			sm: "gap-2",
			md: "gap-4",
			lg: "gap-6",
			xl: "gap-8",
		},
		inline: {
			true: "inline-flex",
			false: "flex",
		},
	},
});

/**
 * Flex.Row component - A horizontal flexbox container (convenience wrapper for Flex with direction="row").
 *
 * Provides a simpler API for common horizontal layouts without needing to specify direction.
 *
 * @example
 * // Horizontal navigation with centered items
 * <Flex.Row align="center" gap="md">
 *   <Logo />
 *   <NavLinks />
 *   <UserMenu />
 * </Flex.Row>
 *
 * @example
 * // Button group with space between
 * <Flex.Row justify="between" gap="sm">
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </Flex.Row>
 *
 * @param {Object} props - Component props
 * @param {'start' | 'center' | 'end' | 'stretch' | 'baseline'} [props.align='start'] - Align items vertically
 * @param {'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'} [props.justify='start'] - Justify content horizontally
 * @param {'nowrap' | 'wrap' | 'wrap-reverse'} [props.wrap='nowrap'] - Flex wrap behavior
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl'} [props.gap='none'] - Gap spacing between items
 * @param {string} [props.className] - Additional CSS classes
 */
Flex.Row = ({
	align,
	justify,
	wrap,
	gap,
	inline,
	className,
	...props
}: ComponentProps<"div"> & VariantProps<typeof rowVariants>) => {
	return (
		<div
			className={cn(
				rowVariants({ align, justify, wrap, gap, inline }),
				className,
			)}
			{...props}
		/>
	);
};

const columnVariants = cva("flex flex-col w-full", {
	defaultVariants: {
		align: "start",
		justify: "start",
		gap: "none",
		inline: false,
	},
	variants: {
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		gap: {
			none: "gap-0",
			sm: "gap-2",
			md: "gap-4",
			lg: "gap-6",
			xl: "gap-8",
		},
		inline: {
			true: "inline-flex",
			false: "flex",
		},
	},
});

/**
 * Flex.Column component - A vertical flexbox container (convenience wrapper for Flex with direction="column").
 *
 * Provides a simpler API for common vertical layouts without needing to specify direction.
 *
 * @example
 * // Vertical card layout
 * <Flex.Column gap="md">
 *   <CardHeader />
 *   <CardContent />
 *   <CardFooter />
 * </Flex.Column>
 *
 * @example
 * // Centered modal content
 * <Flex.Column align="center" justify="center" gap="lg">
 *   <Icon />
 *   <Title />
 *   <Description />
 *   <Actions />
 * </Flex.Column>
 *
 * @param {Object} props - Component props
 * @param {'start' | 'center' | 'end' | 'stretch'} [props.align='start'] - Align items horizontally
 * @param {'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'} [props.justify='start'] - Justify content vertically
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl'} [props.gap='none'] - Gap spacing between items
 * @param {string} [props.className] - Additional CSS classes
 */
Flex.Column = ({
	align,
	justify,
	gap,
	className,
	inline,
	...props
}: ComponentProps<"div"> & VariantProps<typeof columnVariants>) => {
	return (
		<div
			className={cn(columnVariants({ align, justify, gap, inline }), className)}
			{...props}
		/>
	);
};
