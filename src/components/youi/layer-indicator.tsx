/**
 * Layer Indicator Component - Visual indicator showing layer position and navigation state
 */

import { motion } from "motion/react";
import { useActiveLayer, useAllLayers, useLayerNavigation } from "./layer-hooks";

interface LayerIndicatorProps {
	/** Position of the indicator */
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	/** Show layer titles on hover */
	showTitles?: boolean;
	/** Compact mode (smaller) */
	compact?: boolean;
	/** Hide the indicator */
	hidden?: boolean;
}

/**
 * LayerIndicator - A visual component that shows the current layer position
 * and provides quick navigation controls.
 *
 * @example
 * ```tsx
 * <Page.LayerProvider>
 *   <LayerIndicator position="bottom-right" showTitles />
 *   <Page.Layer title="Layer 1">Content</Page.Layer>
 *   <Page.Layer title="Layer 2">Content</Page.Layer>
 * </Page.LayerProvider>
 * ```
 */
export const LayerIndicator = ({
	position = "bottom-right",
	showTitles = false,
	compact = false,
	hidden = false,
}: LayerIndicatorProps) => {
	const activeLayer = useActiveLayer();
	const allLayers = useAllLayers();
	const { navigateToIndex } = useLayerNavigation();

	if (hidden || allLayers.length === 0) {
		return null;
	}

	const positionClasses = {
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
	};

	return (
		<motion.div
			className={`fixed ${positionClasses[position]} z-40 pointer-events-auto`}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div
				className={`
					bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-lg
					border border-white/20 dark:border-gray-700
					shadow-lg
					${compact ? "p-2" : "p-3"}
				`}
			>
				{/* Layer dots */}
				<div className="flex items-center gap-2">
					{allLayers.map((layer, index) => {
						const isActive = layer.id === activeLayer?.id;

						return (
							<button
								key={layer.id}
								type="button"
								onClick={() => navigateToIndex(index)}
								className={`
									relative group transition-all duration-200
									${compact ? "w-2 h-2" : "w-3 h-3"}
									rounded-full
									${isActive ? "scale-125" : "hover:scale-110"}
									focus:outline-none focus:ring-2 focus:ring-blue-500
								`}
								aria-label={`Navigate to ${layer.title}`}
								title={showTitles ? layer.title : undefined}
							>
								{/* Dot */}
								<motion.div
									className={`
										w-full h-full rounded-full
										${
											isActive
												? "bg-blue-500"
												: "bg-gray-400 dark:bg-gray-500"
										}
									`}
									animate={{
										scale: isActive ? [1, 1.2, 1] : 1,
									}}
									transition={{
										duration: 1,
										repeat: isActive ? Number.POSITIVE_INFINITY : 0,
										ease: "easeInOut",
									}}
								/>

								{/* Pulse effect for active layer */}
								{isActive && (
									<motion.div
										className="absolute inset-0 rounded-full bg-blue-500"
										initial={{ scale: 1, opacity: 0.5 }}
										animate={{
											scale: 2,
											opacity: 0,
										}}
										transition={{
											duration: 1.5,
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeOut",
										}}
									/>
								)}

								{/* Tooltip on hover */}
								{showTitles && (
									<div
										className="
											absolute bottom-full mb-2 left-1/2 -translate-x-1/2
											opacity-0 group-hover:opacity-100
											transition-opacity duration-200
											pointer-events-none
											whitespace-nowrap
										"
									>
										<div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs shadow-lg">
											{layer.title}
											<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
												<div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
											</div>
										</div>
									</div>
								)}
							</button>
						);
					})}
				</div>

				{/* Layer count and position */}
				{!compact && (
					<div className="mt-2 text-center text-xs text-gray-700 dark:text-gray-300 font-medium">
						{(activeLayer?.index ?? 0) + 1} / {allLayers.length}
					</div>
				)}
			</div>
		</motion.div>
	);
};

/**
 * LayerMinimap - A more detailed minimap view of all layers
 */
interface LayerMinimapProps {
	/** Position of the minimap */
	position?: "left" | "right";
	/** Width of the minimap */
	width?: number;
	/** Show layer previews (if available) */
	showPreviews?: boolean;
}

export const LayerMinimap = ({
	position = "right",
	width = 200,
	showPreviews = false,
}: LayerMinimapProps) => {
	const activeLayer = useActiveLayer();
	const allLayers = useAllLayers();
	const { navigateToIndex } = useLayerNavigation();

	const positionClass = position === "left" ? "left-0" : "right-0";

	return (
		<motion.div
			className={`
				fixed ${positionClass} top-0 h-full z-30
				bg-white/5 dark:bg-black/20 backdrop-blur-sm
				border-l border-r border-white/10 dark:border-gray-700
				pointer-events-auto
			`}
			style={{ width }}
			initial={{ x: position === "left" ? -width : width }}
			animate={{ x: 0 }}
			transition={{ type: "spring", stiffness: 200, damping: 25 }}
		>
			<div className="h-full overflow-y-auto p-4">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
					Layers
				</h3>

				<div className="space-y-2">
					{allLayers.map((layer, index) => {
						const isActive = layer.id === activeLayer?.id;

						return (
							<button
								key={layer.id}
								type="button"
								onClick={() => navigateToIndex(index)}
								className={`
									w-full text-left p-3 rounded-lg transition-all
									${
										isActive
											? "bg-blue-500 text-white shadow-lg scale-105"
											: "bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50"
									}
									focus:outline-none focus:ring-2 focus:ring-blue-500
								`}
							>
								<div className="flex items-center gap-2 mb-1">
									<div
										className={`
											w-2 h-2 rounded-full
											${isActive ? "bg-white" : "bg-gray-400"}
										`}
									/>
									<span className="text-xs font-medium">
										Layer {index + 1}
									</span>
								</div>

								<div
									className={`
									text-sm font-semibold truncate
									${isActive ? "text-white" : "text-gray-700 dark:text-gray-300"}
								`}
								>
									{layer.title}
								</div>

								{layer.description && (
									<div
										className={`
										text-xs mt-1 truncate
										${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}
									`}
									>
										{layer.description}
									</div>
								)}

								<div className="flex items-center gap-2 mt-2 text-xs">
									<span
										className={`
										px-2 py-0.5 rounded-full
										${
											isActive
												? "bg-white/20 text-white"
												: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
										}
									`}
									>
										{layer.type}
									</span>

									<span
										className={`
										${isActive ? "text-white/60" : "text-gray-400"}
									`}
									>
										{layer.state}
									</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};

/**
 * LayerBreadcrumb - Shows navigation history as a breadcrumb trail
 */
export const LayerBreadcrumb = () => {
	const { history, historyIndex, navigateToIndex } = useLayerNavigation();
	const allLayers = useAllLayers();

	if (history.length === 0) {
		return null;
	}

	// Show last 5 history entries
	const recentHistory = history.slice(Math.max(0, historyIndex - 4), historyIndex + 1);

	return (
		<motion.div
			className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700 shadow-lg px-4 py-2">
				<div className="flex items-center gap-2 text-sm">
					{recentHistory.map((entry, idx) => {
						const layer = allLayers[entry.index];
						const isLast = idx === recentHistory.length - 1;

						return (
							<div key={entry.timestamp} className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => navigateToIndex(entry.index)}
									className={`
										transition-colors hover:text-blue-500
										${isLast ? "text-blue-500 font-semibold" : "text-gray-600 dark:text-gray-400"}
									`}
								>
									{layer?.title || `Layer ${entry.index + 1}`}
								</button>

								{!isLast && (
									<span className="text-gray-400 dark:text-gray-600">/</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};

