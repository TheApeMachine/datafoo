import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useEffectEvent,
	useMemo,
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

type Position3D = { x: number; y: number; z: number };

export type LayerConfig = {
	id: string;
	position: Position3D;
	section: Record<string, unknown>;
};

type LayerContextValue = {
	ptr: LayerConfig | null;
	next: LayerConfig | null;
	insertMode: boolean;
	onComplete: () => void;
};

const LayerContext = createContext<LayerContextValue | null>(null);

Page.LayerProvider = ({ children }: { children: ReactNode }) => {
	const [ptr, setPtr] = useState<LayerConfig | null>({
		id: "root",
		position: { x: 0, y: 0, z: 0 },
		section: {},
	});
	const [next, setNext] = useState<LayerConfig | null>(null);
	const [insertMode, setInsertMode] = useState(false);

	const layersRef = useRef<Map<string, LayerConfig>>(new Map());

	// Initialize the root layer
	useEffect(() => {
		const rootKey = "0,0,0";
		if (!layersRef.current.has(rootKey)) {
			layersRef.current.set(rootKey, {
				id: "root",
				position: { x: 0, y: 0, z: 0 },
				section: {},
			});
		}
	}, []);

	const onComplete = useCallback(() => {
		setPtr(next);
		setNext(null);
	}, [next]);

	const addLayer = useCallback((position: Position3D) => {
		const key = `${position.x},${position.y},${position.z}`;
		if (!layersRef.current.has(key)) {
			layersRef.current.set(key, {
				id: key,
				position,
				section: {},
			});
		}
	}, []);

	const moveTo = useEffectEvent((event: KeyboardEvent) => {
		let newPosition: Position3D | null = null;

		switch (event.key) {
			case "+":
				setInsertMode(true);
				return;
			case "ArrowUp":
				newPosition = {
					x: ptr?.position?.x ?? 0,
					y: (ptr?.position?.y ?? 0) - 1,
					z: ptr?.position?.z ?? 0,
				};
				break;
			case "ArrowDown":
				newPosition = {
					x: ptr?.position?.x ?? 0,
					y: (ptr?.position?.y ?? 0) + 1,
					z: ptr?.position?.z ?? 0,
				};
				break;
			case "ArrowLeft":
				newPosition = {
					x: (ptr?.position?.x ?? 0) - 1,
					y: ptr?.position?.y ?? 0,
					z: ptr?.position?.z ?? 0,
				};
				break;
			case "ArrowRight":
				newPosition = {
					x: (ptr?.position?.x ?? 0) + 1,
					y: ptr?.position?.y ?? 0,
					z: ptr?.position?.z ?? 0,
				};
				break;
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				newPosition = {
					x: ptr?.position?.x ?? 0,
					y: ptr?.position?.y ?? 0,
					z: Number(event.key),
				};
				break;
			default:
				return;
		}

		if (newPosition) {
			// Add layer if in insert mode
			if (insertMode) {
				addLayer(newPosition);
				setInsertMode(false); // Exit insert mode after adding
			}

			// Navigate to layer if it exists
			const key = `${newPosition.x},${newPosition.y},${newPosition.z}`;
			const layer = layersRef.current.get(key);
			if (layer) {
				setNext(layer);
			}
		}
	});

	useEffect(() => {
		window.addEventListener("keydown", moveTo);
		return () => window.removeEventListener("keydown", moveTo);
	}, [moveTo]);

	const value = useMemo(
		() => ({
			ptr,
			next,
			insertMode,
			onComplete,
		}),
		[ptr, next, insertMode, onComplete],
	);

	return (
		<LayerContext.Provider value={value}>{children}</LayerContext.Provider>
	);
};

Page.Layer = () => {
	const context = useContext(LayerContext);
	const { ptr, next, insertMode, onComplete } = context || {
		ptr: null,
		next: null,
		insertMode: false,
		onComplete: () => {},
	};

	const positions = [ptr?.position, next?.position];

	if (!context) return null;

	const GRID_UNIT = 100;

	const getLayerColor = (position: Position3D) => {
		const colors = [
			"bg-red-500/20",
			"bg-blue-500/20",
			"bg-green-500/20",
			"bg-yellow-500/20",
			"bg-purple-500/20",
			"bg-pink-500/20",
			"bg-indigo-500/20",
			"bg-teal-500/20",
			"bg-orange-500/20",
			"bg-cyan-500/20",
			"bg-lime-500/20",
			"bg-rose-500/20",
		];
		const hash =
			(position.x * 31 + position.y * 37 + position.z * 41) % colors.length;
		return colors[Math.abs(hash)];
	};

	const baseClasses = "w-full h-full absolute inset-0";
	const insertClasses = insertMode
		? "bg-orange-500 border-2 border-orange-300"
		: "bg-accent";
	const gridClasses =
		"absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#999999_1px,transparent_1px)] bg-size-[16px_16px]";

	// Calculate the offset to animate - move TO next if it exists
	const targetPosition = next?.position ??
		ptr?.position ?? { x: 0, y: 0, z: 0 };

	return (
		<motion.div
			className="w-full h-full absolute inset-0"
			animate={{
				x: `${-targetPosition.x * GRID_UNIT}vw`,
				y: `${-targetPosition.y * GRID_UNIT}vh`,
				z: -targetPosition.z * GRID_UNIT,
			}}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			onAnimationComplete={() => {
				if (next) {
					onComplete();
				}
			}}
		>
			{positions.map((position: Position3D | undefined) => {
				if (!position) return null;

				return (
					<div
						className={`${baseClasses} ${getLayerColor(position)} ${insertClasses} ${gridClasses}`}
						key={`layer-${position.x},${position.y},${position.z}`}
						style={{
							transform: `translate3d(${position.x * GRID_UNIT}vw, ${position.y * GRID_UNIT}vh, ${position.z * GRID_UNIT}px)`,
						}}
					>
						{position.x},{position.y},{position.z}
					</div>
				);
			})}
		</motion.div>
	);
};
