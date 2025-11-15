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

export const Route = createFileRoute("/demo/grid-workspace")({
	component: GridWorkspaceDemo,
});

function GridWorkspaceDemo() {
	return (
		<Page.LayerProvider
			gridConfig={{
				spacing: { x: 1000, y: 1000, z: 1000 },
				infinite: true,
			}}
		>
			<Grid3DIndicator position="top-right" size={250} range={3} />

			{/* Center layer at (0, 0, 0) */}
			<Page.Layer
				title="Center Hub"
				type="exploration"
				description="The central hub of the workspace"
				x={0}
				y={0}
				showDebug
				className="bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
			>
				<LayerContent
					title="Center Hub"
					position={{ x: 0, y: 0, z: 0 }}
					color="blue"
					description="Navigate in any direction using arrow keys"
				/>
			</Page.Layer>

			{/* X-axis layers (horizontal) */}
			<Page.Layer
				title="West Wing"
				type="configuration"
				description="Layer to the left"
				x={-1}
				y={0}
				showDebug
				className="bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
			>
				<LayerContent
					title="West Wing"
					position={{ x: -1, y: 0, z: 0 }}
					color="purple"
					description="Press → to go back to center"
				/>
			</Page.Layer>

			<Page.Layer
				title="East Wing"
				type="results"
				description="Layer to the right"
				x={1}
				y={0}
				showDebug
				className="bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
			>
				<LayerContent
					title="East Wing"
					position={{ x: 1, y: 0, z: 0 }}
					color="green"
					description="Press ← to go back to center"
				/>
			</Page.Layer>

			{/* Y-axis layers (vertical) */}
			<Page.Layer
				title="Upper Level"
				type="help"
				description="Layer above"
				x={0}
				y={1}
				showDebug
				className="bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
			>
				<LayerContent
					title="Upper Level"
					position={{ x: 0, y: 1, z: 0 }}
					color="yellow"
					description="Press Shift+↓ to go back to center"
				/>
			</Page.Layer>

			<Page.Layer
				title="Lower Level"
				type="custom"
				description="Layer below"
				x={0}
				y={-1}
				showDebug
				className="bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center"
			>
				<LayerContent
					title="Lower Level"
					position={{ x: 0, y: -1, z: 0 }}
					color="red"
					description="Press Shift+↑ to go back to center"
				/>
			</Page.Layer>

			{/* Z-axis layers (depth) */}
			<Page.Layer
				title="Background Layer"
				type="exploration"
				description="Layer in the back"
				x={0}
				y={0}
				showDebug
				className="bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
			>
				<LayerContent
					title="Background Layer"
					position={{ x: 0, y: 0, z: 1 }}
					color="indigo"
					description="Press ↑ to go back to center"
				/>
			</Page.Layer>

			{/* Corner layers */}
			<Page.Layer
				title="NE Corner"
				type="configuration"
				description="Northeast corner"
				x={1}
				y={1}
				showDebug
				className="bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center"
			>
				<LayerContent
					title="Northeast Corner"
					position={{ x: 1, y: 1, z: 0 }}
					color="teal"
					description="At the intersection of East and Upper"
				/>
			</Page.Layer>

			<Page.Layer
				title="SW Corner"
				type="results"
				description="Southwest corner"
				x={-1}
				y={-1}
				showDebug
				className="bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center"
			>
				<LayerContent
					title="Southwest Corner"
					position={{ x: -1, y: -1, z: 0 }}
					color="amber"
					description="At the intersection of West and Lower"
				/>
			</Page.Layer>

			{/* 3D diagonal layer */}
			<Page.Layer
				title="Deep Corner"
				type="custom"
				description="Far diagonal corner"
				x={1}
				y={1}
				showDebug
				className="bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center"
			>
				<LayerContent
					title="Deep Diagonal"
					position={{ x: 1, y: 1, z: 1 }}
					color="fuchsia"
					description="Furthest corner in 3D space"
				/>
			</Page.Layer>
		</Page.LayerProvider>
	);
}

interface LayerContentProps {
	title: string;
	position: { x: number; y: number; z: number };
	color: string;
	description: string;
}

function LayerContent({ title, position, color, description }: LayerContentProps) {
	const { navigate, navigateToGridPosition } = useLayerNavigation();

	return (
		<Flex className="flex-col items-center gap-6 text-white p-8 max-w-2xl">
			<Text.Title className="text-6xl font-bold text-white text-center">
				{title}
			</Text.Title>

			<div className={`text-sm font-mono bg-white/20 px-4 py-2 rounded-lg`}>
				Position: ({position.x}, {position.y}, {position.z})
			</div>

			<Text.Paragraph center className="text-xl">
				{description}
			</Text.Paragraph>

			{/* Navigation instructions */}
			<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 max-w-lg">
				<Text.Paragraph center className="mb-4 font-semibold">
					3D Navigation Controls:
				</Text.Paragraph>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<div className="font-semibold mb-2 text-white/80">Z-Axis (Depth)</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">↑/↓</kbd>
								<span>Forward/Back</span>
							</div>
						</div>
					</div>
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
								<kbd className="px-2 py-1 bg-white/20 rounded">Shift+↑/↓</kbd>
								<span>Up/Down</span>
							</div>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-2 text-white/80">Shortcuts</div>
						<div className="space-y-1 text-xs">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">Esc</kbd>
								<span>Origin</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">?</kbd>
								<span>Help</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick navigation buttons */}
			<div className="flex flex-wrap gap-3 mt-4 justify-center">
				{position.x !== 0 || position.y !== 0 || position.z !== 0 ? (
					<Button
						size="lg"
						onClick={() => navigateToGridPosition({ x: 0, y: 0, z: 0 })}
						className={`bg-white text-${color}-500 hover:bg-gray-100`}
					>
						← Return to Center
					</Button>
				) : (
					<>
						<Button
							size="md"
							onClick={() => navigate("left")}
							className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
						>
							← West
						</Button>
						<Button
							size="md"
							onClick={() => navigate("right")}
							className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
						>
							East →
						</Button>
						<Button
							size="md"
							onClick={() => navigate("up")}
							className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
						>
							↑ Up
						</Button>
						<Button
							size="md"
							onClick={() => navigate("down")}
							className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
						>
							↓ Down
						</Button>
						<Button
							size="md"
							onClick={() => navigate("forward")}
							className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
						>
							⬇ Back
						</Button>
					</>
				)}
			</div>

			<div className="mt-4 text-xs opacity-60 text-center">
				Watch the 3D Grid Indicator (top-right) to see your position
			</div>
		</Flex>
	);
}
