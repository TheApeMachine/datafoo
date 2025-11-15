/**
 * TypeScript types and interfaces for the Enhanced Z-Axis Layer System
 */

/**
 * Layer type categories for different use cases
 */
export type LayerType =
	| "exploration" // Data exploration and browsing
	| "configuration" // Settings and configuration
	| "results" // Analysis results and visualizations
	| "help" // Help, documentation, tutorials
	| "custom"; // Custom layer types

/**
 * Layer state during lifecycle
 */
export type LayerState =
	| "active" // Currently focused and interactive
	| "inactive" // In background, not interactive
	| "hidden" // Completely hidden from view
	| "transitioning"; // Currently animating

/**
 * Transition timing function types
 */
export type TransitionType = "spring" | "ease-in-out" | "ease-out" | "linear";

/**
 * Layer metadata interface
 */
export interface LayerMetadata {
	/** Unique identifier for the layer */
	id: string;
	/** Layer type category */
	type: LayerType;
	/** Display title for the layer */
	title: string;
	/** Optional description for accessibility */
	description?: string;
	/** Optional priority override (higher = closer to front) */
	priority?: number;
	/** Current state of the layer */
	state: LayerState;
	/** Custom application-specific data */
	customData?: Record<string, unknown>;
	/** Index in the layer stack (0 = front) - for Z-axis */
	index: number;
	/** Current z-position in 3D space */
	zPosition: number;
	/** X-coordinate in 3D space (0 = center) */
	x: number;
	/** Y-coordinate in 3D space (0 = center) */
	y: number;
	/** Adjacent layer IDs */
	adjacent: {
		up?: string;
		down?: string;
		left?: string;
		right?: string;
	};
}

/**
 * Layer navigation direction
 */
export type NavigationDirection =
	| "up"      // Move to layer above (Y+)
	| "down"    // Move to layer below (Y-)
	| "left"    // Move to layer on left (X-)
	| "right"   // Move to layer on right (X+)
	| "forward" // Move deeper in Z (Z-)
	| "backward"// Move closer in Z (Z+)
	| "first"   // Jump to first layer (Z=0)
	| "last";   // Jump to last layer

/**
 * Layer navigation history entry
 */
export interface NavigationHistoryEntry {
	/** Layer ID that was navigated to */
	layerId: string;
	/** Timestamp of navigation */
	timestamp: number;
	/** Layer index at time of navigation */
	index: number;
}

/**
 * Layer configuration options
 */
export interface LayerConfig {
	/** Layer type */
	type?: LayerType;
	/** Layer title */
	title: string;
	/** Layer description */
	description?: string;
	/** Priority override */
	priority?: number;
	/** Custom data */
	customData?: Record<string, unknown>;
	/** Show debug label */
	showDebug?: boolean;
	/** Disable layer */
	disabled?: boolean;
	/** X coordinate (defaults to 0) */
	x?: number;
	/** Y coordinate (defaults to 0) */
	y?: number;
	/** Adjacent layer connections */
	adjacent?: {
		up?: string;
		down?: string;
		left?: string;
		right?: string;
	};
}

/**
 * Layer transition configuration
 */
export interface TransitionConfig {
	/** Transition type */
	type: TransitionType;
	/** Duration in milliseconds (overrides automatic calculation) */
	duration?: number;
	/** Stiffness for spring transitions */
	stiffness?: number;
	/** Damping for spring transitions */
	damping?: number;
	/** Mass for spring transitions */
	mass?: number;
}

/**
 * Layer context value interface
 */
export interface LayerContextType {
	/** Register a new layer and get its index */
	registerLayer: (id: string, config: LayerConfig) => number;
	/** Unregister a layer */
	unregisterLayer: (id: string) => void;
	/** Update layer metadata */
	updateLayer: (id: string, updates: Partial<LayerConfig>) => void;
	/** Get metadata for a specific layer */
	getLayer: (id: string) => LayerMetadata | undefined;
	/** Get all layer metadata */
	getAllLayers: () => LayerMetadata[];
	/** Get currently active layer */
	getActiveLayer: () => LayerMetadata | undefined;
	/** Current global z-offset for all layers */
	currentOffset: number;
	/** Current X position */
	currentX: number;
	/** Current Y position */
	currentY: number;
	/** Current 3D grid position */
	currentGridPosition: Grid3DPosition;
	/** Navigate to a specific layer by ID */
	navigateToLayer: (layerId: string) => void;
	/** Navigate to a layer by index */
	navigateToIndex: (index: number) => void;
	/** Navigate to a specific grid position */
	navigateToGridPosition: (position: Grid3DPosition) => void;
	/** Navigate in a direction */
	navigate: (direction: NavigationDirection) => void;
	/** Go back in navigation history */
	goBack: () => void;
	/** Go forward in navigation history */
	goForward: () => void;
	/** Navigation history */
	history: NavigationHistoryEntry[];
	/** Current position in history */
	historyIndex: number;
	/** Transition configuration */
	transitionConfig: TransitionConfig;
	/** Update transition configuration */
	setTransitionConfig: (config: Partial<TransitionConfig>) => void;
	/** Whether reduced motion is preferred */
	prefersReducedMotion: boolean;
	/** Grid workspace configuration */
	gridConfig: GridWorkspaceConfig;
	/** Get layer at specific grid position */
	getLayerAtPosition: (position: Grid3DPosition) => LayerMetadata | undefined;
	/** Get all occupied grid positions */
	getOccupiedPositions: () => LayerGridCell[];
}

/**
 * Layer visual effects configuration
 */
export interface LayerVisualEffects {
	/** Scale factor based on depth */
	scale: number;
	/** Opacity based on depth */
	opacity: number;
	/** Blur amount in pixels */
	blur: number;
	/** Whether layer can receive interactions */
	interactive: boolean;
	/** Color tint based on depth (CSS color value) */
	tint?: string;
}

/**
 * Layer gesture events
 */
export interface LayerGestureHandlers {
	/** Swipe left/right handler */
	onSwipe?: (direction: "left" | "right") => void;
	/** Pinch handler */
	onPinch?: (scale: number) => void;
	/** Long press handler */
	onLongPress?: () => void;
}

/**
 * Performance metrics for layer system
 */
export interface LayerPerformanceMetrics {
	/** Current frames per second */
	fps: number;
	/** Number of active layers */
	layerCount: number;
	/** Number of rendered layers (visible) */
	renderedCount: number;
	/** Number of culled layers */
	culledCount: number;
	/** Average transition duration */
	avgTransitionDuration: number;
}

/**
 * 3D Grid position
 */
export interface Grid3DPosition {
	/** X coordinate (horizontal) */
	x: number;
	/** Y coordinate (vertical) */
	y: number;
	/** Z coordinate (depth) */
	z: number;
}

/**
 * Grid workspace configuration
 */
export interface GridWorkspaceConfig {
	/** Spacing between layers on each axis (in pixels) */
	spacing: {
		x: number;
		y: number;
		z: number;
	};
	/** Enable infinite grid (allows navigation beyond registered layers) */
	infinite?: boolean;
	/** Snap to grid when navigating */
	snapToGrid?: boolean;
	/** Grid bounds (optional, for finite grids) */
	bounds?: {
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
		minZ: number;
		maxZ: number;
	};
}

/**
 * Layer grid cell data
 */
export interface LayerGridCell {
	/** Position in grid */
	position: Grid3DPosition;
	/** Layer ID at this position (if any) */
	layerId?: string;
	/** Whether this cell is occupied */
	occupied: boolean;
}

