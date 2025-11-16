/**
 * 3D Grid Workspace Demo - Comprehensive demonstration of multi-dimensional layer navigation
 */

import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/youi/page";
import { Button } from "@/components/youi/button";
import { Flex } from "@/components/youi/flex";
import { Text } from "@/components/youi/text";
import { Grid3DIndicator } from "@/components/youi/layer-indicator";
import { useLayerNavigation } from "@/components/youi/layer-hooks";
import {
	useDynamicLayers,
	LayerCreator,
	QuickLayerActions,
	type DynamicLayerData,
} from "@/components/youi/layer-creator";

export const Route = createFileRoute("/demo/grid-workspace")({
	component: GridWorkspaceDemo,
});

// Initial layers
const initialLayers: DynamicLayerData[] = [
	{
		id: "center",
		position: { x: 0, y: 0, z: 0 },
		config: {
			title: "Center Hub",
			type: "exploration",
			description: "The central hub - create new layers from here",
			x: 0,
			y: 0,
			z: 0,
			showDebug: true,
		},
	},
];

function GridWorkspaceDemo() {
	const { layers, addLayer, removeLayerAtPosition } =
		useDynamicLayers(initialLayers);

	return (
		<Page.LayerProvider
			gridConfig={{
				spacing: { x: 1000, y: 1000, z: 1000 },
				infinite: true,
			}}
		>
			<Grid3DIndicator position="top-right" size={250} range={3} />
			<LayerCreator
				position="bottom-left"
				onCreateLayer={(direction) =>
					addLayer(direction, {
						type: "custom",
						showDebug: true,
					})
				}
			/>

			{/* Dynamically created layers */}
			{layers.map((layer) => (
				<Page.Layer
					key={layer.id}
					{...layer.config}
					className={getLayerClassName(layer.position)}
				>
					{layer.content || (
						<DynamicLayerContent
							position={layer.position}
							title={layer.config.title || "Layer"}
							onAddLayer={addLayer}
							onRemoveLayer={() => removeLayerAtPosition(layer.position)}
						/>
					)}
				</Page.Layer>
			))}
		</Page.LayerProvider>
	);
}

// Helper to get layer color based on position
function getLayerClassName(position: { x: number; y: number; z: number }): string {
	const colors = [
		"from-blue-500 to-cyan-500",
		"from-purple-500 to-pink-500",
		"from-green-500 to-emerald-500",
		"from-yellow-500 to-orange-500",
		"from-red-500 to-rose-500",
		"from-indigo-500 to-purple-600",
		"from-teal-500 to-cyan-600",
		"from-amber-500 to-yellow-600",
		"from-fuchsia-500 to-pink-600",
		"from-lime-500 to-green-500",
		"from-sky-500 to-blue-500",
	];

	// Use position to deterministically select a color
	const hash = Math.abs(position.x * 7 + position.y * 13 + position.z * 17);
	const colorIndex = hash % colors.length;

	return `bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center`;
}

interface DynamicLayerContentProps {
	title: string;
	position: { x: number; y: number; z: number };
	onAddLayer: (
		direction: "top" | "right" | "bottom" | "left" | "stack",
	) => void;
	onRemoveLayer: () => void;
}

function DynamicLayerContent({
	title,
	position,
	onAddLayer,
	onRemoveLayer,
}: DynamicLayerContentProps) {
	const { navigateToGridPosition } = useLayerNavigation();

	return (
		<Flex className="flex-col items-center gap-6 text-white p-8 max-w-2xl">
			<Text.Title className="text-6xl font-bold text-white text-center">
				{title}
			</Text.Title>

			<div className="text-sm font-mono bg-white/20 px-4 py-2 rounded-lg">
				Position: ({position.x}, {position.y}, {position.z})
			</div>

			<Text.Paragraph center className="text-xl">
				{position.x === 0 && position.y === 0 && position.z === 0
					? "Welcome! Create new layers using the buttons below or the menu in the bottom-left corner."
					: "Navigate using arrow keys or create new layers from this position."}
			</Text.Paragraph>

			{/* Quick layer creation actions */}
			<div className="mt-4 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 max-w-lg">
				<Text.Paragraph center className="mb-4 font-semibold">
					Create New Layer:
				</Text.Paragraph>

				<QuickLayerActions onCreateLayer={onAddLayer} className="justify-center" />

				<div className="mt-4 text-xs text-white/60 text-center">
					Creates a new layer adjacent to this one
				</div>
			</div>

			{/* Navigation instructions */}
			<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 max-w-lg">
				<Text.Paragraph center className="mb-4 font-semibold">
					3D Navigation Controls:
				</Text.Paragraph>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<div className="font-semibold mb-2 text-white/80">X-Axis (Horizontal)</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">←/→</kbd>
								<span>Left/Right</span>
							</div>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-2 text-white/80">Y-Axis (Vertical)</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">↑/↓</kbd>
								<span>Up/Down</span>
							</div>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-2 text-white/80">Z-Axis (Depth)</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">0-9</kbd>
								<span>Jump to Z layer</span>
							</div>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-2 text-white/80">Shortcuts</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">Esc</kbd>
								<span>Origin (0,0,0)</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">?</kbd>
								<span>Show all keys</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex flex-wrap gap-3 mt-4 justify-center">
				{position.x !== 0 || position.y !== 0 || position.z !== 0 ? (
					<>
						<Button
							size="lg"
							onClick={() => navigateToGridPosition({ x: 0, y: 0, z: 0 })}
							className="bg-white text-blue-500 hover:bg-gray-100"
						>
							← Return to Center
						</Button>
						<Button
							size="lg"
							onClick={onRemoveLayer}
							className="bg-red-500/80 hover:bg-red-500 text-white"
						>
							🗑 Delete Layer
						</Button>
					</>
				) : (
					<Button
						size="lg"
						onClick={() => navigateToGridPosition({ x: 0, y: 0, z: 0 })}
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
					>
						↺ Reset View
					</Button>
				)}
			</div>

			<div className="mt-4 text-xs opacity-60 text-center">
				Watch the 3D Grid Indicator (top-right) to see your position
				<br />
				Use "New Layer" button (bottom-left) for more options
			</div>
		</Flex>
	);
}
