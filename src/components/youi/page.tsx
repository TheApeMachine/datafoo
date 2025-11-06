import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/ui";
import { ScrollArea } from "./scroll-area";

const pageVariants = cva("grid w-screen h-screen overflow-hidden", {
	defaultVariants: {
		layout: "default",
	},
	variants: {
		layout: {
			default: `
					grid-cols-[auto_1fr_auto]
					grid-rows-[auto_1fr_auto]
					[grid-template-areas:'header_header_header'_'nav_main_aside'_'footer_footer_footer']
				`,
			"no-nav": `
					grid-cols-[1fr_auto]
					grid-rows-[auto_1fr_auto]
					[grid-template-areas:'header_header'_'main_aside'_'footer_footer']
				`,
			"no-aside": `
					grid-cols-[auto_1fr]
					grid-rows-[auto_1fr_auto]
					[grid-template-areas:'header_header'_'nav_main'_'footer_footer']
				`,
			"content-only": `
					grid-cols-[1fr]
					grid-rows-[auto_1fr_auto]
					[grid-template-areas:'header'_'main'_'footer']
				`,
		},
	},
});

/**
 * Page component - A semantic page layout container using CSS Grid with template areas.
 *
 * Uses CSS Grid with grid-template-areas to create a structured page layout with header,
 * navigation sidebar (left), main content (center), aside panel (right), and footer.
 *
 * The layout automatically aligns child components to the correct grid areas:
 * - Header spans full width at top
 * - Nav, Main, Aside in the middle row
 * - Footer spans full width at bottom
 *
 * Includes semantic sub-components: Header, Main, Footer, Nav (left sidebar), and Aside (right panel).
 *
 * @example
 * // Complete page layout with all sections
 * <Page>
 *   <Page.Header>Site Header</Page.Header>
 *   <Page.Nav>Sidebar Navigation</Page.Nav>
 *   <Page.Main>Main Content</Page.Main>
 *   <Page.Aside>Flyout Panel</Page.Aside>
 *   <Page.Footer>Site Footer</Page.Footer>
 * </Page>
 *
 * @example
 * // Content-only layout (no nav or aside)
 * <Page layout="content-only">
 *   <Page.Header>Header</Page.Header>
 *   <Page.Main>Content</Page.Main>
 *   <Page.Footer>Footer</Page.Footer>
 * </Page>
 *
 * @param {Object} props - Component props
 * @param {'default' | 'no-nav' | 'no-aside' | 'content-only'} [props.layout='default'] - Page layout variant
 * @param {string} [props.className] - Additional CSS classes
 */
export const Page = ({
	layout,
	className,
	...props
}: ComponentProps<"div"> & VariantProps<typeof pageVariants>) => {
	return (
		<div
			className={cn("root", pageVariants({ layout }), className)}
			{...props}
		/>
	);
};

const headerVariants = cva("[grid-area:header] flex w-full", {
	defaultVariants: {
		sticky: false,
		padding: "default",
	},
	variants: {
		sticky: {
			true: "sticky top-0 z-10",
			false: "",
		},
		padding: {
			sm: "p-2",
			md: "p-4",
			default: "p-0",
			lg: "p-6",
		},
	},
});

/**
 * Page.Header component - Semantic header section for page layouts.
 *
 * Typically used for site headers, navigation bars, or page titles.
 * Can be made sticky to remain visible while scrolling.
 *
 * @example
 * // Basic header
 * <Page.Header>
 *   <h1>My Application</h1>
 * </Page.Header>
 *
 * @example
 * // Sticky header with custom styling
 * <Page.Header sticky className="bg-white shadow-md">
 *   <Navigation />
 * </Page.Header>
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.sticky=false] - Whether header sticks to top on scroll
 * @param {'sm' | 'md' | 'default' | 'lg'} [props.padding='default'] - Header padding
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Header = ({
	sticky,
	padding,
	className,
	...props
}: ComponentProps<"header"> & VariantProps<typeof headerVariants>) => {
	return (
		<header
			className={cn(headerVariants({ sticky, padding }), className)}
			{...props}
		/>
	);
};

const mainVariants = cva(
	"[grid-area:main] relative flex flex-col w-full h-full overflow-hidden",
	{
		defaultVariants: {
			padding: "default",
			content: "top-left",
			scroll: false,
		},
		variants: {
			padding: {
				sm: "p-2",
				md: "p-4",
				default: "p-0",
				lg: "p-6",
			},
			content: {
				"top-left": "items-start justify-start",
				"top-right": "items-start justify-end",
				"bottom-left": "items-end justify-start",
				"bottom-right": "items-end justify-end",
				center: "items-center justify-center",
			},
			scroll: {
				true: "",
				false: "",
			},
		},
	},
);

/**
 * Page.Main component - Semantic main content area for page layouts.
 *
 * Represents the primary content area of the page. Uses a ScrollArea for custom
 * scrollbars while maintaining native scroll behavior.
 *
 * @example
 * // Main content with default padding
 * <Page.Main>
 *   <Article />
 * </Page.Main>
 *
 * @example
 * // Main content with custom padding
 * <Page.Main padding="lg">
 *   <Content />
 * </Page.Main>
 *
 * @param {Object} props - Component props
 * @param {'none' | 'sm' | 'default' | 'lg' | 'xl'} [props.padding='default'] - Content padding
 * @param {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'} [props.content='top-left'] - Content alignment
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Main = ({
	padding,
	content,
	className,
	scroll = false,
	children,
	...props
}: ComponentProps<"main"> & VariantProps<typeof mainVariants>) => {
	const wrapper = (children: ReactNode) => {
		if (scroll) {
			return <ScrollArea content={content}>{children}</ScrollArea>;
		}
		return children;
	};

	return (
		<main
			className={cn(mainVariants({ padding, content }), className)}
			{...props}
		>
			{wrapper(children)}
		</main>
	);
};

const footerVariants = cva(
	"[grid-area:footer] flex w-full items-center justify-center",
	{
		defaultVariants: {
			sticky: false,
			padding: "default",
		},
		variants: {
			sticky: {
				true: "sticky bottom-0 z-10",
				false: "",
			},
			padding: {
				sm: "p-2",
				md: "p-4",
				default: "p-0",
				lg: "p-6",
			},
		},
	},
);

/**
 * Page.Footer component - Semantic footer section for page layouts.
 *
 * Typically used for site footers, copyright information, or page actions.
 * Can be made sticky to remain visible at the bottom.
 *
 * @example
 * // Basic footer
 * <Page.Footer>
 *   <p>© 2025 My Company</p>
 * </Page.Footer>
 *
 * @example
 * // Sticky footer with actions
 * <Page.Footer sticky className="bg-white border-t">
 *   <ActionButtons />
 * </Page.Footer>
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.sticky=false] - Whether footer sticks to bottom
 * @param {'sm' | 'md' | 'default' | 'lg'} [props.padding='default'] - Footer padding
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Footer = ({
	sticky,
	padding,
	className,
	...props
}: ComponentProps<"footer"> & VariantProps<typeof footerVariants>) => {
	return (
		<footer
			className={cn(footerVariants({ sticky, padding }), className)}
			{...props}
		/>
	);
};

const navVariants = cva("[grid-area:nav] flex h-full", {
	defaultVariants: {
		padding: "default",
		collapsible: false,
	},
	variants: {
		padding: {
			sm: "p-2",
			md: "p-4",
			default: "p-0",
			lg: "p-6",
		},
		collapsible: {
			true: "md:p-6 p-0 md:flex hidden",
			false: "",
		},
	},
});

/**
 * Page.Nav component - Semantic navigation sidebar (left side).
 *
 * Positioned in the "nav" grid area (left sidebar). Typically used for primary
 * navigation, menu items, or table of contents. Can be made collapsible on mobile devices.
 * Uses a ScrollArea for custom scrollbars.
 *
 * @example
 * // Basic sidebar navigation
 * <Page.Nav>
 *   <NavigationMenu />
 * </Page.Nav>
 *
 * @example
 * // Collapsible navigation (hidden on mobile)
 * <Page.Nav collapsible className="bg-gray-50">
 *   <MenuItems />
 * </Page.Nav>
 *
 * @param {Object} props - Component props
 * @param {'sm' | 'md' | 'default' | 'lg'} [props.padding='default'] - Sidebar padding
 * @param {boolean} [props.collapsible=false] - Hide on mobile, show on desktop
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Nav = ({
	padding,
	collapsible,
	className,
	children,
	...props
}: ComponentProps<"nav"> & VariantProps<typeof navVariants>) => {
	return (
		<nav
			className={cn(navVariants({ padding, collapsible }), className)}
			{...props}
		>
			{children}
		</nav>
	);
};

const asideVariants = cva("[grid-area:aside] flex h-full", {
	defaultVariants: {
		padding: "default",
		collapsible: false,
	},
	variants: {
		padding: {
			sm: "p-2",
			md: "p-4",
			default: "p-0",
			lg: "p-6",
		},
		collapsible: {
			true: "lg:p-6 p-0 lg:flex hidden",
			false: "",
		},
	},
});

/**
 * Page.Aside component - Semantic aside/flyout panel (right side).
 *
 * Positioned in the "aside" grid area (right panel). Typically used for secondary
 * content, related information, or contextual actions. Can be made collapsible on smaller screens.
 * Uses a ScrollArea for custom scrollbars.
 *
 * @example
 * // Basic aside panel
 * <Page.Aside>
 *   <RelatedContent />
 * </Page.Aside>
 *
 * @example
 * // Collapsible aside (hidden on tablet and below)
 * <Page.Aside collapsible className="bg-gray-50 border-l">
 *   <TableOfContents />
 * </Page.Aside>
 *
 * @param {Object} props - Component props
 * @param {'sm' | 'md' | 'default' | 'lg'} [props.padding='default'] - Aside padding
 * @param {boolean} [props.collapsible=false] - Hide on tablet/mobile, show on desktop
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Aside = ({
	padding,
	collapsible,
	className,
	children,
	...props
}: ComponentProps<"aside"> & VariantProps<typeof asideVariants>) => {
	return (
		<aside
			className={cn(asideVariants({ padding, collapsible }), className)}
			{...props}
		>
			<ScrollArea className="h-full w-full">{children}</ScrollArea>
		</aside>
	);
};

// Layer context for managing 3D layer positions
interface LayerContextType {
	registerLayer: (id: string) => number;
	unregisterLayer: (id: string) => void;
	currentOffset: number;
}

const LayerContext = createContext<LayerContextType | null>(null);

interface LayerProviderProps {
	children: ReactNode;
}

/**
 * LayerProvider - Manages the 3D layer system with keyboard navigation.
 *
 * Wraps Page.Layer components to enable 3D stacking with keyboard controls.
 * - Up Arrow: Move all layers +100px on z-axis (bring next layer forward)
 * - Down Arrow: Move all layers -100px on z-axis (bring previous layer forward)
 *
 * @example
 * <Page.LayerProvider>
 *   <Page.Layer>Front Layer</Page.Layer>
 *   <Page.Layer>Middle Layer</Page.Layer>
 *   <Page.Layer>Back Layer</Page.Layer>
 * </Page.LayerProvider>
 */
Page.LayerProvider = ({ children }: LayerProviderProps) => {
	const [currentOffset, setCurrentOffset] = useState(0);
	const layersRef = useRef<Set<string>>(new Set());
	const layerCountRef = useRef(0);
	const offset = useRef(1000);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setCurrentOffset((prev) => {
					console.log("ArrowUp", prev + offset.current);
					return prev + offset.current;
				});
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setCurrentOffset((prev) => {
					console.log("ArrowDown", prev - offset.current);
					return prev - offset.current;
				});
			}
		};

		window.addEventListener("keyup", handleKeyDown);
		return () => window.removeEventListener("keyup", handleKeyDown);
	}, []); // No dependencies - set up once

	const registerLayer = (id: string): number => {
		if (!layersRef.current.has(id)) {
			layersRef.current.add(id);
			const index = layerCountRef.current;
			layerCountRef.current++;
			return index;
		}
		return Array.from(layersRef.current).indexOf(id);
	};

	const unregisterLayer = (id: string) => {
		layersRef.current.delete(id);
	};

	return (
		<LayerContext.Provider
			value={{ registerLayer, unregisterLayer, currentOffset }}
		>
			<div
				className="absolute inset-0 w-full h-full"
				style={{
					perspective: "1000px",
					perspectiveOrigin: "50% 50%",
					transformStyle: "preserve-3d",
				}}
			>
				{children}
			</div>
		</LayerContext.Provider>
	);
};

interface LayerProps {
	children: ReactNode;
	className?: string;
}

/**
 * Page.Layer - A 3D layer component that stacks with other layers.
 *
 * Each layer is positioned absolutely and fills its container. Layers are stacked
 * on top of each other with 100px z-axis spacing. Use arrow keys to navigate:
 * - Up Arrow: Bring next layer to front
 * - Down Arrow: Bring previous layer to front
 *
 * Must be wrapped in Page.LayerProvider to function.
 *
 * @example
 * <Page.LayerProvider>
 *   <Page.Layer className="bg-blue-500">
 *     <h1>First Layer</h1>
 *   </Page.Layer>
 *   <Page.Layer className="bg-red-500">
 *     <h1>Second Layer</h1>
 *   </Page.Layer>
 * </Page.LayerProvider>
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Layer content
 * @param {string} [props.className] - Additional CSS classes
 */
Page.Layer = ({ children, className }: LayerProps) => {
	const context = useContext(LayerContext);
	const [layerIndex, setLayerIndex] = useState<number | null>(null);
	const layerIdRef = useRef(`layer-${Math.random().toString(36).substr(2, 9)}`);

	useEffect(() => {
		if (context) {
			const index = context.registerLayer(layerIdRef.current);
			setLayerIndex(index);

			return () => {
				context.unregisterLayer(layerIdRef.current);
			};
		}
	}, [context]);

	if (!context) {
		console.warn("Page.Layer must be used within Page.LayerProvider");
		return <section className={className}>{children}</section>;
	}

	if (layerIndex === null) {
		return null;
	}

	// Each layer starts at its own position (0, -1000, -2000...) plus the global offset
	const zPosition = layerIndex * context.currentOffset;
	console.log("zPosition", zPosition);

	// Calculate scale and opacity based on z-position for depth effect
	const distanceFromFront = Math.abs(zPosition);
	const scale = Math.max(0.8, 1 - distanceFromFront / 5000);
	const opacity =
		zPosition === 0 ? 1 : Math.max(0.3, 1 - distanceFromFront / 2000);
	const blur = zPosition === 0 ? 0 : Math.min(5, distanceFromFront / 400);

	return (
		<motion.section
			className={cn(
				"absolute inset-0 w-full h-full overflow-hidden",
				className,
			)}
			animate={{
				scale,
				opacity,
				filter: `blur(${blur}px)`,
				z: zPosition,
			}}
			transition={{
				type: "spring",
				stiffness: 100,
				damping: 25,
				mass: 1,
			}}
			style={{
				transformStyle: "preserve-3d",
				pointerEvents: zPosition === 0 ? "auto" : "none",
			}}
		>
			<div className="absolute top-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-xs z-50">
				Layer {layerIndex} | Z: {zPosition}px
			</div>
			{children}
		</motion.section>
	);
};
