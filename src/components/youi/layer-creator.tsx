/**
 * Dynamic Layer Creation Components and Hooks
 */

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useLayerContext } from "./layer-hooks";
import type { LayerConfig, Grid3DPosition } from "./layer-types";
import { Button } from "./button";

/**
 * Position type for creating new layers relative to current position
 */
export type RelativePosition = "top" | "right" | "bottom" | "left" | "stack";

/**
 * Layer data for dynamic creation
 */
export interface DynamicLayerData {
	id: string;
	config: LayerConfig;
	position: Grid3DPosition;
	content?: React.ReactNode;
}

/**
 * Calculate position for a new layer based on relative direction
 */
export function calculateNewPosition(
	currentPos: Grid3DPosition,
	direction: RelativePosition,
): Grid3DPosition {
	switch (direction) {
		case "top":
			return { x: currentPos.x, y: currentPos.y + 1, z: currentPos.z };
		case "bottom":
			return { x: currentPos.x, y: currentPos.y - 1, z: currentPos.z };
		case "left":
			return { x: currentPos.x - 1, y: currentPos.y, z: currentPos.z };
		case "right":
			return { x: currentPos.x + 1, y: currentPos.y, z: currentPos.z };
		case "stack":
			return { x: currentPos.x, y: currentPos.y, z: currentPos.z + 1 };
		default:
			return currentPos;
	}
}

/**
 * Hook for managing dynamic layer creation
 */
export function useDynamicLayers(initialLayers: DynamicLayerData[] = []) {
	const [layers, setLayers] = useState<DynamicLayerData[]>(initialLayers);
	const context = useLayerContext();

	const addLayer = useCallback(
		(
			direction: RelativePosition,
			config: Partial<LayerConfig> = {},
			content?: React.ReactNode,
		) => {
			const currentPos = context.currentGridPosition;
			const newPos = calculateNewPosition(currentPos, direction);

			// Check if layer already exists at this position
			const existingLayer = context.getLayerAtPosition(newPos);
			if (existingLayer) {
				console.log(`Layer already exists at position (${newPos.x}, ${newPos.y}, ${newPos.z})`);
				return null;
			}

			const id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const newLayer: DynamicLayerData = {
				id,
				position: newPos,
				config: {
					title: config.title || `Layer (${newPos.x},${newPos.y},${newPos.z})`,
					type: config.type || "custom",
					description: config.description,
					x: newPos.x,
					y: newPos.y,
					z: newPos.z,
					showDebug: config.showDebug ?? true,
				},
				content,
			};

			setLayers((prev) => [...prev, newLayer]);

			console.log(`Created new layer at position (${newPos.x}, ${newPos.y}, ${newPos.z})`);

			// Navigate to the new layer with a slight delay to allow React to render it first
			setTimeout(() => {
				console.log(`Navigating to new layer at (${newPos.x}, ${newPos.y}, ${newPos.z})`);
				context.navigateToGridPosition(newPos);
			}, 300);

			return newLayer;
		},
		[context],
	);

	const removeLayer = useCallback((id: string) => {
		setLayers((prev) => prev.filter((layer) => layer.id !== id));
	}, []);

	const removeLayerAtPosition = useCallback((position: Grid3DPosition) => {
		setLayers((prev) =>
			prev.filter(
				(layer) =>
					!(
						layer.position.x === position.x &&
						layer.position.y === position.y &&
						layer.position.z === position.z
					),
			),
		);
	}, []);

	return {
		layers,
		addLayer,
		removeLayer,
		removeLayerAtPosition,
	};
}

/**
 * LayerCreator - UI component for creating new layers
 */
interface LayerCreatorProps {
	onCreateLayer: (direction: RelativePosition) => void;
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	compact?: boolean;
}

export function LayerCreator({
	onCreateLayer,
	position = "bottom-left",
	compact = false,
}: LayerCreatorProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const positionClasses = {
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
	};

	const directions: { dir: RelativePosition; label: string; icon: string }[] = [
		{ dir: "top", label: "Top", icon: "↑" },
		{ dir: "right", label: "Right", icon: "→" },
		{ dir: "bottom", label: "Bottom", icon: "↓" },
		{ dir: "left", label: "Left", icon: "←" },
		{ dir: "stack", label: "Stack", icon: "⬆" },
	];

	return (
		<motion.div
			className={`fixed ${positionClasses[position]} z-40 pointer-events-auto`}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-700 shadow-lg">
				{!isExpanded ? (
					<Button
						onClick={() => setIsExpanded(true)}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
						size={compact ? "sm" : "md"}
					>
						+ New Layer
					</Button>
				) : (
					<div className="p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-semibold text-white dark:text-gray-300">
								Create Layer
							</h3>
							<button
								type="button"
								onClick={() => setIsExpanded(false)}
								className="text-white/60 hover:text-white text-lg leading-none"
							>
								×
							</button>
						</div>

						<div className="space-y-2">
							{directions.map(({ dir, label, icon }) => (
								<Button
									key={dir}
									onClick={() => {
										onCreateLayer(dir);
										setIsExpanded(false);
									}}
									className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 justify-start"
									size="sm"
								>
									<span className="mr-2 text-lg">{icon}</span>
									{label}
									{dir === "stack" && (
										<span className="ml-auto text-xs opacity-60">Z+1</span>
									)}
								</Button>
							))}
						</div>

						<div className="mt-3 text-xs text-white/60 text-center">
							Creates layer at selected position
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
}

/**
 * Quick action buttons for layer creation
 */
interface QuickLayerActionsProps {
	onCreateLayer: (direction: RelativePosition) => void;
	className?: string;
}

export function QuickLayerActions({
	onCreateLayer,
	className = "",
}: QuickLayerActionsProps) {
	return (
		<div className={`flex flex-wrap gap-2 ${className}`}>
			<Button
				onClick={() => onCreateLayer("top")}
				size="sm"
				className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
			>
				↑ Top
			</Button>
			<Button
				onClick={() => onCreateLayer("right")}
				size="sm"
				className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
			>
				→ Right
			</Button>
			<Button
				onClick={() => onCreateLayer("bottom")}
				size="sm"
				className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
			>
				↓ Bottom
			</Button>
			<Button
				onClick={() => onCreateLayer("left")}
				size="sm"
				className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
			>
				← Left
			</Button>
			<Button
				onClick={() => onCreateLayer("stack")}
				size="sm"
				className="bg-blue-500/80 hover:bg-blue-500 text-white border border-blue-400/50"
			>
				⬆ Stack
			</Button>
		</div>
	);
}
