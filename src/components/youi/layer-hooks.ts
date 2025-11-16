/**
 * Custom hooks for interacting with the Enhanced Z-Axis Layer System
 */

import { useContext, useEffect, useState, useCallback } from "react";
import type {
	LayerContextType,
	LayerMetadata,
	NavigationDirection,
	LayerPerformanceMetrics,
} from "./layer-types";

// Import the LayerContext from page.tsx (where it's created and provided)
import { LayerContext } from "./page";

/**
 * Hook to access the layer context
 * @throws Error if used outside LayerProvider
 */
export const useLayerContext = (): LayerContextType => {
	const context = useContext(LayerContext);
	if (!context) {
		// In development, provide a helpful error with stack trace
		if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
			console.error(
				"useLayerContext must be used within Page.LayerProvider",
				new Error().stack,
			);
		}
		throw new Error("useLayerContext must be used within Page.LayerProvider");
	}
	return context;
};

/**
 * Hook to get the currently active layer metadata
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const activeLayer = useActiveLayer();
 *
 *   return (
 *     <div>
 *       Current layer: {activeLayer?.title}
 *     </div>
 *   );
 * }
 * ```
 */
export const useActiveLayer = (): LayerMetadata | undefined => {
	const context = useLayerContext();
	const [activeLayer, setActiveLayer] = useState<LayerMetadata | undefined>(
		context.getActiveLayer(),
	);

	useEffect(() => {
		// Update active layer when offset changes
		const layer = context.getActiveLayer();
		setActiveLayer(layer);
	}, [context, context.currentOffset]);

	return activeLayer;
};

/**
 * Hook to get all layer metadata
 *
 * @example
 * ```tsx
 * function LayerList() {
 *   const layers = useAllLayers();
 *
 *   return (
 *     <ul>
 *       {layers.map(layer => (
 *         <li key={layer.id}>{layer.title}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const useAllLayers = (): LayerMetadata[] => {
	const context = useLayerContext();
	const [layers, setLayers] = useState<LayerMetadata[]>(context.getAllLayers());

	useEffect(() => {
		setLayers(context.getAllLayers());
	}, [context, context.currentOffset]);

	return layers;
};

/**
 * Hook to check if a specific layer is active
 *
 * @param layerId - The ID of the layer to check
 * @returns true if the layer is currently active
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isActive = useIsLayerActive('layer-123');
 *
 *   return (
 *     <div className={isActive ? 'active' : 'inactive'}>
 *       This layer is {isActive ? 'active' : 'inactive'}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsLayerActive = (layerId: string): boolean => {
	const context = useLayerContext();
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const layer = context.getLayer(layerId);
		setIsActive(layer?.state === "active");
	}, [context, layerId, context.currentOffset]);

	return isActive;
};

/**
 * Hook to get layer navigation functions
 *
 * @returns Navigation functions and state
 *
 * @example
 * ```tsx
 * function NavigationControls() {
 *   const { navigate, goBack, goForward, canGoBack, canGoForward } = useLayerNavigation();
 *
 *   return (
 *     <div>
 *       <button onClick={() => navigate('backward')} disabled={!canGoBack}>
 *         Previous
 *       </button>
 *       <button onClick={() => navigate('forward')} disabled={!canGoForward}>
 *         Next
 *       </button>
 *       <button onClick={goBack} disabled={!canGoBack}>
 *         History Back
 *       </button>
 *       <button onClick={goForward} disabled={!canGoForward}>
 *         History Forward
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLayerNavigation = () => {
	const context = useLayerContext();

	const canGoBack = context.historyIndex > 0;
	const canGoForward = context.historyIndex < context.history.length - 1;

	const navigate = useCallback(
		(direction: NavigationDirection) => {
			context.navigate(direction);
		},
		[context],
	);

	const navigateToLayer = useCallback(
		(layerId: string) => {
			context.navigateToLayer(layerId);
		},
		[context],
	);

	const navigateToIndex = useCallback(
		(index: number) => {
			context.navigateToIndex(index);
		},
		[context],
	);

	const navigateToGridPosition = useCallback(
		(position: { x: number; y: number; z: number }) => {
			context.navigateToGridPosition(position);
		},
		[context],
	);

	return {
		navigate,
		navigateToLayer,
		navigateToIndex,
		navigateToGridPosition,
		goBack: context.goBack,
		goForward: context.goForward,
		canGoBack,
		canGoForward,
		history: context.history,
		historyIndex: context.historyIndex,
	};
};

/**
 * Hook to monitor layer system performance
 *
 * @param sampleInterval - How often to sample FPS (in ms)
 * @returns Performance metrics
 *
 * @example
 * ```tsx
 * function PerformanceMonitor() {
 *   const metrics = useLayerPerformance();
 *
 *   return (
 *     <div>
 *       <p>FPS: {metrics.fps.toFixed(1)}</p>
 *       <p>Layers: {metrics.layerCount}</p>
 *       <p>Rendered: {metrics.renderedCount}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLayerPerformance = (
	sampleInterval = 1000,
): LayerPerformanceMetrics => {
	const context = useLayerContext();
	const [metrics, setMetrics] = useState<LayerPerformanceMetrics>({
		fps: 60,
		layerCount: 0,
		renderedCount: 0,
		culledCount: 0,
		avgTransitionDuration: 0,
	});

	useEffect(() => {
		let frameCount = 0;
		let lastTime = performance.now();
		let rafId: number;

		const measureFPS = () => {
			frameCount++;
			rafId = requestAnimationFrame(measureFPS);
		};

		const updateMetrics = () => {
			const currentTime = performance.now();
			const elapsed = currentTime - lastTime;
			const fps = (frameCount / elapsed) * 1000;

			const allLayers = context.getAllLayers();
			const activeLayer = context.getActiveLayer();
			const currentIndex = activeLayer?.index ?? 0;

			// Layers within 3 positions are rendered
			const renderedCount = allLayers.filter((layer) => {
				const distance = Math.abs(layer.index - currentIndex);
				return distance <= 3;
			}).length;

			setMetrics({
				fps: Math.min(fps, 60), // Cap at 60
				layerCount: allLayers.length,
				renderedCount,
				culledCount: allLayers.length - renderedCount,
				avgTransitionDuration: 0.3, // This would need tracking in context
			});

			frameCount = 0;
			lastTime = currentTime;
		};

		rafId = requestAnimationFrame(measureFPS);
		const intervalId = setInterval(updateMetrics, sampleInterval);

		return () => {
			cancelAnimationFrame(rafId);
			clearInterval(intervalId);
		};
	}, [context, sampleInterval]);

	return metrics;
};

/**
 * Hook to get a specific layer's metadata
 *
 * @param layerId - The ID of the layer
 * @returns Layer metadata or undefined if not found
 *
 * @example
 * ```tsx
 * function LayerInfo({ layerId }: { layerId: string }) {
 *   const layer = useLayer(layerId);
 *
 *   if (!layer) return <div>Layer not found</div>;
 *
 *   return (
 *     <div>
 *       <h3>{layer.title}</h3>
 *       <p>{layer.description}</p>
 *       <p>State: {layer.state}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLayer = (layerId: string): LayerMetadata | undefined => {
	const context = useLayerContext();
	const [layer, setLayer] = useState<LayerMetadata | undefined>(
		context.getLayer(layerId),
	);

	useEffect(() => {
		setLayer(context.getLayer(layerId));
	}, [context, layerId, context.currentOffset]);

	return layer;
};

/**
 * Hook to get the current layer index (0 = front)
 *
 * @returns Current layer index
 *
 * @example
 * ```tsx
 * function LayerPosition() {
 *   const currentIndex = useCurrentLayerIndex();
 *
 *   return <div>Currently viewing layer {currentIndex + 1}</div>;
 * }
 * ```
 */
export const useCurrentLayerIndex = (): number => {
	const context = useLayerContext();
	const activeLayer = useActiveLayer();
	return activeLayer?.index ?? 0;
};

/**
 * Hook to get layer transition configuration
 *
 * @returns Transition config and setter
 *
 * @example
 * ```tsx
 * function TransitionControls() {
 *   const { config, setConfig } = useLayerTransition();
 *
 *   return (
 *     <div>
 *       <button onClick={() => setConfig({ type: 'spring', stiffness: 200 })}>
 *         Fast Spring
 *       </button>
 *       <button onClick={() => setConfig({ type: 'ease-in-out' })}>
 *         Ease In-Out
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLayerTransition = () => {
	const context = useLayerContext();

	return {
		config: context.transitionConfig,
		setConfig: context.setTransitionConfig,
		prefersReducedMotion: context.prefersReducedMotion,
	};
};

