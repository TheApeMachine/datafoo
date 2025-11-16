import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import {
	createContext,
	type ReactNode,
	useCallback,
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
import type {
	Grid3DPosition,
	GridWorkspaceConfig,
	LayerConfig,
	LayerContextType,
	LayerGridCell,
	LayerMetadata,
	LayerState,
	NavigationDirection,
	NavigationHistoryEntry,
	TransitionConfig,
} from "./layer-types";

// Export the LayerContext so hooks can use it
export const LayerContext = createContext<LayerContextType | null>(null);

interface LayerProviderProps {
	children: ReactNode;
	/** Initial transition configuration */
	transitionConfig?: Partial<TransitionConfig>;
	/** Maximum history entries to keep */
	maxHistory?: number;
	/** Grid workspace configuration */
	gridConfig?: Partial<GridWorkspaceConfig>;
}

/**
 * LayerProvider - Manages the enhanced 3D layer system with comprehensive navigation.
 *
 * Wraps Page.Layer components to enable 3D stacking with multiple navigation methods:
 * - Arrow Up/Down: Navigate through layers
 * - Escape: Return to top layer
 * - Ctrl/Cmd + Arrow: Jump to first/last layer
 * - 1-9: Jump to specific layer index
 * - ?: Show keyboard shortcuts
 *
 * @example
 * <Page.LayerProvider>
 *   <Page.Layer title="Front Layer">Content</Page.Layer>
 *   <Page.Layer title="Back Layer">Content</Page.Layer>
 * </Page.LayerProvider>
 */
Page.LayerProvider = ({
	children,
	transitionConfig: initialTransitionConfig,
	maxHistory = 20,
	gridConfig: initialGridConfig,
}: LayerProviderProps) => {
	const [currentOffset, setCurrentOffset] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [currentY, setCurrentY] = useState(0);
	const [showKeyboardHints, setShowKeyboardHints] = useState(false);
	const [history, setHistory] = useState<NavigationHistoryEntry[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [transitionConfig, setTransitionConfigState] =
		useState<TransitionConfig>({
			type: "spring",
			stiffness: initialTransitionConfig?.stiffness ?? 100,
			damping: initialTransitionConfig?.damping ?? 25,
			mass: initialTransitionConfig?.mass ?? 1,
		});

	const [gridConfig] = useState<GridWorkspaceConfig>({
		spacing: {
			x: initialGridConfig?.spacing?.x ?? 1000,
			y: initialGridConfig?.spacing?.y ?? 1000,
			z: initialGridConfig?.spacing?.z ?? 1000,
		},
		infinite: initialGridConfig?.infinite ?? false,
		snapToGrid: initialGridConfig?.snapToGrid ?? true,
		bounds: initialGridConfig?.bounds,
	});

	const layersRef = useRef<Map<string, LayerMetadata>>(new Map());
	const layerOrderRef = useRef<string[]>([]);
	const offset = useRef(1000);
	const liveRegionRef = useRef<HTMLDivElement>(null);

	// Check for reduced motion preference
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => {
			setPrefersReducedMotion(e.matches);
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Register a layer with metadata
	const registerLayer = useCallback(
		(id: string, config: LayerConfig): number => {
			const existingLayer = layersRef.current.get(id);

			if (existingLayer) {
				return existingLayer.index;
			}

			const index = layerOrderRef.current.length;
			layerOrderRef.current.push(id);

			const x = config.x ?? 0;
			const y = config.y ?? 0;
			const z = config.z ?? 0;

			// Check if this is the first layer at (0,0,0)
			const isOrigin = x === 0 && y === 0 && z === 0;

			const metadata: LayerMetadata = {
				id,
				type: config.type ?? "custom",
				title: config.title,
				description: config.description,
				priority: config.priority,
				state: isOrigin ? "active" : "inactive",
				customData: config.customData,
				index,
				zPosition: -index * offset.current,
				x,
				y,
				z,
				adjacent: config.adjacent ?? {},
			};

			console.log(`Registered layer "${config.title}" at position (${x}, ${y}, ${z})`);
			layersRef.current.set(id, metadata);
			return index;
		},
		[],
	);

	// Unregister a layer
	const unregisterLayer = useCallback((id: string) => {
		layersRef.current.delete(id);
		const index = layerOrderRef.current.indexOf(id);
		if (index > -1) {
			layerOrderRef.current.splice(index, 1);
		}
	}, []);

	// Update layer metadata
	const updateLayer = useCallback(
		(id: string, updates: Partial<LayerConfig>) => {
			const layer = layersRef.current.get(id);
			if (layer) {
				layersRef.current.set(id, {
					...layer,
					...updates,
				});
			}
		},
		[],
	);

	// Get layer metadata
	const getLayer = useCallback((id: string) => {
		return layersRef.current.get(id);
	}, []);

	// Get all layers
	const getAllLayers = useCallback(() => {
		return Array.from(layersRef.current.values());
	}, []);

	// Get active layer
	const getActiveLayer = useCallback(() => {
		return Array.from(layersRef.current.values()).find(
			(layer) => layer.state === "active",
		);
	}, []);

	// Add to navigation history
	const addToHistory = useCallback(
		(layerId: string, index: number) => {
			setHistory((prev) => {
				const newHistory = prev.slice(0, historyIndex + 1);
				newHistory.push({
					layerId,
					timestamp: Date.now(),
					index,
				});
				// Limit history size
				if (newHistory.length > maxHistory) {
					newHistory.shift();
				}
				return newHistory;
			});
			setHistoryIndex((prev) => Math.min(prev + 1, maxHistory - 1));
		},
		[historyIndex, maxHistory],
	);

	// Navigate to specific layer (allows going beyond boundaries for continuous navigation)
	const navigateToIndex = useCallback(
		(targetIndex: number) => {
			const totalLayers = layerOrderRef.current.length;

			// Allow navigation beyond boundaries - layers will just be off-screen
			const newOffset = -targetIndex * offset.current;
			setCurrentOffset(newOffset);

			// Update layer states - find which layer is actually at z=0
			layersRef.current.forEach((layer) => {
				const layerZPos = -layer.index * offset.current + newOffset;
				const state: LayerState = layerZPos === 0 ? "active" : "inactive";
				layersRef.current.set(layer.id, { ...layer, state });
			});

			// Announce to screen reader if we're on a valid layer
			if (targetIndex >= 0 && targetIndex < totalLayers) {
				const targetLayer = layersRef.current.get(
					layerOrderRef.current[targetIndex],
				);
				if (liveRegionRef.current && targetLayer) {
					liveRegionRef.current.textContent = `Navigated to ${targetLayer.title}`;
				}
				// Add to history only for valid layers
				addToHistory(layerOrderRef.current[targetIndex], targetIndex);
			}
		},
		[addToHistory, offset],
	);

	// Navigate by layer ID
	const navigateToLayer = useCallback(
		(layerId: string) => {
			const index = layerOrderRef.current.indexOf(layerId);
			if (index > -1) {
				navigateToIndex(index);
			}
		},
		[navigateToIndex],
	);

	// Navigate to a specific grid position
	const navigateToGridPosition = useCallback(
		(position: Grid3DPosition) => {
			// Check if a layer exists at this position
			const layerAtPosition = Array.from(layersRef.current.values()).find(
				(layer) =>
					layer.x === position.x &&
					layer.y === position.y &&
					layer.z === position.z,
			);

			// Only navigate if a layer exists at the target position
			if (!layerAtPosition) {
				console.log(`No layer at position (${position.x}, ${position.y}, ${position.z})`);
				return;
			}

			// Update all three axes
			const newX = position.x * gridConfig.spacing.x;
			const newY = position.y * gridConfig.spacing.y;
			const newZ = position.z * gridConfig.spacing.z;

			setCurrentX(newX);
			setCurrentY(newY);
			setCurrentOffset(newZ);

			// Update layer states based on which layer is at position (0,0,0) in screen space
			layersRef.current.forEach((layer) => {
				const layerScreenX = layer.x * gridConfig.spacing.x - newX;
				const layerScreenY = layer.y * gridConfig.spacing.y - newY;
				const layerScreenZ = layer.z * gridConfig.spacing.z - newZ;

				const isAtOrigin = layerScreenX === 0 && layerScreenY === 0 && layerScreenZ === 0;
				const state: LayerState = isAtOrigin ? "active" : "inactive";
				layersRef.current.set(layer.id, { ...layer, state });
			});

			if (liveRegionRef.current) {
				liveRegionRef.current.textContent = `Navigated to ${layerAtPosition.title} at position (${position.x}, ${position.y}, ${position.z})`;
				addToHistory(layerAtPosition.id, layerAtPosition.index);
			}
		},
		[gridConfig, addToHistory],
	);

	// Navigate in a direction
	const navigate = useCallback(
		(direction: NavigationDirection) => {
			const currentXPos = currentX / gridConfig.spacing.x;
			const currentYPos = currentY / gridConfig.spacing.y;
			const currentZPos = currentOffset / gridConfig.spacing.z;

			let targetX = currentXPos;
			let targetY = currentYPos;
			let targetZ = currentZPos;

			switch (direction) {
				case "backward":
					// Move backward in Z (toward front)
					targetZ = currentZPos - 1;
					break;
				case "forward":
					// Move forward in Z (toward back)
					targetZ = currentZPos + 1;
					break;
				case "left":
					// Move left in X
					targetX = currentXPos - 1;
					break;
				case "right":
					// Move right in X
					targetX = currentXPos + 1;
					break;
				case "up":
					// Move up in Y
					targetY = currentYPos + 1;
					break;
				case "down":
					// Move down in Y
					targetY = currentYPos - 1;
					break;
				case "first":
					// Jump to origin
					targetZ = 0;
					targetX = 0;
					targetY = 0;
					break;
				case "last":
					// Not used in new system
					break;
			}

			// Check bounds if not infinite grid
			if (!gridConfig.infinite && gridConfig.bounds) {
				const bounds = gridConfig.bounds;
				if (
					targetX < bounds.minX ||
					targetX > bounds.maxX ||
					targetY < bounds.minY ||
					targetY > bounds.maxY ||
					targetZ < bounds.minZ ||
					targetZ > bounds.maxZ
				) {
					return; // Out of bounds, don't navigate
				}
			}

			// Navigate to the new position (will only move if layer exists)
			navigateToGridPosition({ x: targetX, y: targetY, z: targetZ });
		},
		[currentOffset, currentX, currentY, gridConfig, navigateToGridPosition],
	);

	// Go back in history
	const goBack = useCallback(() => {
		if (historyIndex > 0) {
			const prevEntry = history[historyIndex - 1];
			setHistoryIndex(historyIndex - 1);
			navigateToIndex(prevEntry.index);
		}
	}, [history, historyIndex, navigateToIndex]);

	// Go forward in history
	const goForward = useCallback(() => {
		if (historyIndex < history.length - 1) {
			const nextEntry = history[historyIndex + 1];
			setHistoryIndex(historyIndex + 1);
			navigateToIndex(nextEntry.index);
		}
	}, [history, historyIndex, navigateToIndex]);

	// Set transition config
	const setTransitionConfig = useCallback(
		(config: Partial<TransitionConfig>) => {
			setTransitionConfigState((prev) => ({ ...prev, ...config }));
		},
		[],
	);

	// Get layer at specific grid position
	const getLayerAtPosition = useCallback((position: Grid3DPosition) => {
		return Array.from(layersRef.current.values()).find(
			(layer) =>
				layer.x === position.x &&
				layer.y === position.y &&
				layer.z === position.z,
		);
	}, []);

	// Get all occupied grid positions
	const getOccupiedPositions = useCallback((): LayerGridCell[] => {
		return Array.from(layersRef.current.values()).map((layer) => ({
			position: { x: layer.x, y: layer.y, z: layer.z },
			layerId: layer.id,
			occupied: true,
		}));
	}, []);

	// Enhanced keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Show keyboard hints
			if (e.key === "?") {
				e.preventDefault();
				setShowKeyboardHints((prev) => !prev);
				return;
			}

			// Hide hints on any other key
			if (showKeyboardHints && e.key !== "?") {
				setShowKeyboardHints(false);
			}

			// Arrow navigation for X and Y axes
			if (e.key === "ArrowUp") {
				e.preventDefault();
				// Up = Y axis (move up)
				navigate("up");
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				// Down = Y axis (move down)
				navigate("down");
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				// Left = X axis (move left)
				navigate("left");
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				// Right = X axis (move right)
				navigate("right");
			}

			// Escape to return to origin
			else if (e.key === "Escape") {
				e.preventDefault();
				navigate("first");
			}

			// Number keys 0-9 for Z-axis navigation
			else if (e.key >= "0" && e.key <= "9") {
				e.preventDefault();
				const targetZ = Number.parseInt(e.key);
				const currentXPos = currentX / gridConfig.spacing.x;
				const currentYPos = currentY / gridConfig.spacing.y;
				navigateToGridPosition({ x: currentXPos, y: currentYPos, z: targetZ });
			}
		};

		window.addEventListener("keyup", handleKeyDown);
		return () => window.removeEventListener("keyup", handleKeyDown);
	}, [navigate, navigateToGridPosition, showKeyboardHints, currentX, currentY, gridConfig]);

	const contextValue: LayerContextType = {
		registerLayer,
		unregisterLayer,
		updateLayer,
		getLayer,
		getAllLayers,
		getActiveLayer,
		currentOffset,
		currentX,
		currentY,
		currentGridPosition: {
			x: currentX / gridConfig.spacing.x,
			y: currentY / gridConfig.spacing.y,
			z: currentOffset / gridConfig.spacing.z,
		},
		navigateToLayer,
		navigateToIndex,
		navigateToGridPosition,
		navigate,
		goBack,
		goForward,
		history,
		historyIndex,
		transitionConfig,
		setTransitionConfig,
		prefersReducedMotion,
		gridConfig,
		getLayerAtPosition,
		getOccupiedPositions,
	};

	return (
		<LayerContext.Provider value={contextValue}>
			<div
				className="absolute inset-0 w-full h-full"
				style={{
					perspective: "500px",
					perspectiveOrigin: "50% 50%",
					transformStyle: "preserve-3d",
				}}
			>
				{children}

				{/* Screen reader live region for layer announcements */}
				<div
					ref={liveRegionRef}
					className="sr-only"
					role="status"
					aria-live="polite"
					aria-atomic="true"
				/>

				{/* Keyboard hints overlay */}
				{showKeyboardHints && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
						onClick={() => setShowKeyboardHints(false)}
					>
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl mx-4">
							<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
								3D Grid Navigation Shortcuts
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
										X-Axis (Horizontal)
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between gap-2">
											<kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
												←/→
											</kbd>
											<span className="text-gray-700 dark:text-gray-300">
												Left/Right
											</span>
										</div>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
										Y-Axis (Vertical)
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between gap-2">
											<kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
												↑/↓
											</kbd>
											<span className="text-gray-700 dark:text-gray-300">
												Up/Down
											</span>
										</div>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
										Z-Axis (Depth)
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between gap-2">
											<kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
												0-9
											</kbd>
											<span className="text-gray-700 dark:text-gray-300">
												Jump to Z layer
											</span>
										</div>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
										Other
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between gap-2">
											<kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
												Esc
											</kbd>
											<span className="text-gray-700 dark:text-gray-300">
												Origin (0,0,0)
											</span>
										</div>
										<div className="flex justify-between gap-2">
											<kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
												?
											</kbd>
											<span className="text-gray-700 dark:text-gray-300">
												Toggle help
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</LayerContext.Provider>
	);
};

interface LayerProps extends LayerConfig {
	children: ReactNode;
	className?: string;
	/** Show debug information */
	showDebug?: boolean;
	/** Disable gestures */
	disableGestures?: boolean;
}

/**
 * Page.Layer - An enhanced 3D layer component with gesture support and accessibility.
 *
 * Each layer is positioned absolutely and fills its container. Layers are stacked
 * with sophisticated depth effects and can be navigated with keyboard, mouse, or gestures.
 *
 * Must be wrapped in Page.LayerProvider to function.
 *
 * @example
 * <Page.LayerProvider>
 *   <Page.Layer
 *     title="Data Source"
 *     type="exploration"
 *     description="Select and configure data sources"
 *   >
 *     <h1>First Layer</h1>
 *   </Page.Layer>
 *   <Page.Layer
 *     title="Analysis"
 *     type="configuration"
 *   >
 *     <h1>Second Layer</h1>
 *   </Page.Layer>
 * </Page.LayerProvider>
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Layer content
 * @param {string} props.title - Layer title (required)
 * @param {LayerType} [props.type='custom'] - Layer type category
 * @param {string} [props.description] - Layer description for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showDebug=false] - Show debug label
 */
Page.Layer = ({
	children,
	className,
	title,
	type = "custom",
	description,
	priority,
	customData,
	x,
	y,
	z,
	showDebug = false,
	disableGestures = false,
}: LayerProps) => {
	const context = useContext(LayerContext);
	const [layerIndex, setLayerIndex] = useState<number | null>(null);
	const [isActive, setIsActive] = useState(false);
	const layerIdRef = useRef(`layer-${Math.random().toString(36).substr(2, 9)}`);
	const layerRef = useRef<HTMLElement>(null);

	// Register layer
	useEffect(() => {
		if (context) {
			const config: LayerConfig = {
				title,
				type,
				description,
				priority,
				customData,
				x,
				y,
				z,
			};
			const index = context.registerLayer(layerIdRef.current, config);
			setLayerIndex(index);

			return () => {
				context.unregisterLayer(layerIdRef.current);
			};
		}
	}, [context, title, type, description, priority, customData, x, y, z]);

	// Calculate 3D position based on layer config and current viewport
	const layerMetadata = context?.getLayer(layerIdRef.current);
	const xPosition = layerMetadata && context ? layerMetadata.x * context.gridConfig.spacing.x - context.currentX : 0;
	const yPosition = layerMetadata && context ? layerMetadata.y * context.gridConfig.spacing.y - context.currentY : 0;
	const zPosition = layerMetadata && context ? layerMetadata.z * context.gridConfig.spacing.z - context.currentOffset : 0;

	// Update active state - layer is active when at origin (0, 0, 0) in screen space
	useEffect(() => {
		setIsActive(xPosition === 0 && yPosition === 0 && zPosition === 0);
	}, [xPosition, yPosition, zPosition]);

	// Focus management
	useEffect(() => {
		if (isActive && layerRef.current) {
			// Find first focusable element and focus it
			const focusable = layerRef.current.querySelector<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			if (focusable) {
				focusable.focus();
			}
		}
	}, [isActive]);

	if (!context) {
		console.warn("Page.Layer must be used within Page.LayerProvider");
		return <section className={className}>{children}</section>;
	}

	if (layerIndex === null) {
		return null;
	}

	if (layerIndex === null || !context) {
		return null;
	}

	// Calculate visual effects based on z-position and reduced motion preference
	const distanceFromFront = Math.abs(zPosition);
	const scale = context.prefersReducedMotion
		? 1
		: Math.max(0.8, 1 - distanceFromFront / 5000);
	const opacity = isActive
		? 1
		: Math.max(0.3, 1 - distanceFromFront / 2000);
	const blur =
		context.prefersReducedMotion || isActive
			? 0
			: Math.min(5, distanceFromFront / 400);

	// Color tint based on depth (warmer = closer)
	const tintAmount = Math.min(distanceFromFront / 3000, 0.1);
	const filterString = `blur(${blur}px) ${isActive ? "" : `brightness(${1 - tintAmount})`}`;

	// Gesture handlers
	const handleDragEnd = (_e: unknown, info: { offset: { x: number } }) => {
		if (disableGestures || !isActive) return;

		const swipeThreshold = 50;
		if (info.offset.x > swipeThreshold) {
			// Swipe right - go backward
			context.navigate("backward");
		} else if (info.offset.x < -swipeThreshold) {
			// Swipe left - go forward
			context.navigate("forward");
		}
	};

	// Transition configuration from context
	const easeValue = context.transitionConfig.type === "ease-in-out" ? ("easeInOut" as const)
		: context.transitionConfig.type === "ease-out" ? ("easeOut" as const)
		: ("linear" as const);

	const transitionProps = context.prefersReducedMotion
		? ({ duration: 0.1 } as const)
		: context.transitionConfig.type === "spring"
			? ({
					type: "spring" as const,
					stiffness: context.transitionConfig.stiffness ?? 100,
					damping: context.transitionConfig.damping ?? 25,
					mass: context.transitionConfig.mass ?? 1,
				} as const)
			: ({
					type: "tween" as const,
					ease: easeValue,
					duration:
						context.transitionConfig.duration ??
						0.3 + Math.abs(distanceFromFront) / 5000,
				} as const);

	return (
		<motion.section
			ref={layerRef}
			className={cn(
				"absolute inset-0 w-full h-full overflow-hidden",
				className,
			)}
			animate={{
				scale,
				opacity,
				filter: filterString,
				x: xPosition,
				y: yPosition,
				z: zPosition,
			}}
			transition={transitionProps}
			drag={!disableGestures && isActive ? "x" : false}
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.2}
			onDragEnd={handleDragEnd}
			style={{
				transformStyle: "preserve-3d",
				pointerEvents: isActive ? "auto" : "none",
				willChange: "transform, opacity, filter",
			}}
			role="region"
			aria-label={title}
			aria-description={description}
			aria-hidden={!isActive}
			{...(isActive ? {} : { inert: "" as any })}
		>
			{/* Debug label */}
			{showDebug && (
				<div className="absolute top-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-xs z-50 font-mono">
					Layer {layerIndex} | Pos({layerMetadata?.x},{layerMetadata?.y},{layerMetadata?.z}) | Screen({xPosition.toFixed(0)},{yPosition.toFixed(0)},{zPosition.toFixed(0)}) | {type} |{" "}
					{isActive ? "ACTIVE" : "inactive"}
				</div>
			)}

			{children}
		</motion.section>
	);
};
