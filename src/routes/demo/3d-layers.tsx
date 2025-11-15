import { createFileRoute } from "@tanstack/react-router";
import { Flex } from "@/components/youi/flex";
import { Page } from "@/components/youi/page";
import { Text } from "@/components/youi/text";
import { LayerIndicator } from "@/components/youi/layer-indicator";
import { useLayerNavigation } from "@/components/youi/layer-hooks";
import { Button } from "@/components/youi/button";

export const Route = createFileRoute("/demo/3d-layers")({
	component: ThreeDLayersDemo,
});

function ThreeDLayersDemo() {
	return (
		<Page.LayerProvider>
			<LayerIndicator position="bottom-right" showTitles />

			<Page.Layer
				title="Front Layer"
				type="exploration"
				description="The front-most layer in the stack"
				className="bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
			>
				<LayerContent layerNumber={1} color="blue" />
			</Page.Layer>

			<Page.Layer
				title="Second Layer"
				type="configuration"
				description="The middle layer"
				className="bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center"
			>
				<LayerContent layerNumber={2} color="purple" />
			</Page.Layer>

			<Page.Layer
				title="Third Layer"
				type="results"
				description="Another middle layer"
				className="bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center"
			>
				<LayerContent layerNumber={3} color="green" />
			</Page.Layer>

			<Page.Layer
				title="Back Layer"
				type="custom"
				description="The back-most layer in the stack"
				className="bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center"
			>
				<LayerContent layerNumber={4} color="orange" isLast />
			</Page.Layer>
		</Page.LayerProvider>
	);
}

function LayerContent({
	layerNumber,
	color,
	isLast = false,
}: {
	layerNumber: number;
	color: string;
	isLast?: boolean;
}) {
	const { navigate } = useLayerNavigation();

	return (
		<Flex className="flex-col items-center gap-6 text-white">
			<Text.Title className="text-6xl font-bold text-white">
				Layer {layerNumber}
			</Text.Title>

			<Text.Paragraph center className="text-xl max-w-md">
				{isLast
					? "You've reached the deepest layer!"
					: `This is layer ${layerNumber} of the 3D stack`}
			</Text.Paragraph>

			<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 max-w-md">
				<Text.Paragraph center className="mb-4">
					Enhanced Navigation Controls:
				</Text.Paragraph>

				<div className="space-y-2 text-sm">
					<div className="flex items-center justify-between">
						<kbd className="px-2 py-1 bg-white/20 rounded">↑/↓</kbd>
						<span>Navigate layers</span>
					</div>
					<div className="flex items-center justify-between">
						<kbd className="px-2 py-1 bg-white/20 rounded">Esc</kbd>
						<span>Return to first layer</span>
					</div>
					<div className="flex items-center justify-between">
						<kbd className="px-2 py-1 bg-white/20 rounded">1-4</kbd>
						<span>Jump to specific layer</span>
					</div>
					<div className="flex items-center justify-between">
						<kbd className="px-2 py-1 bg-white/20 rounded">?</kbd>
						<span>Show all shortcuts</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-xs">Swipe left/right</span>
						<span>Touch navigation</span>
					</div>
				</div>
			</div>

			<div className="flex gap-4 mt-4">
				{layerNumber > 1 && (
					<Button
						size="lg"
						onClick={() => navigate("backward")}
						className={`bg-white/20 hover:bg-white/30 text-white border border-white/30`}
					>
						← Previous
					</Button>
				)}

				{!isLast && (
					<Button
						size="lg"
						onClick={() => navigate("forward")}
						className={`bg-white text-${color}-500 hover:bg-gray-100`}
					>
						Next →
					</Button>
				)}

				{isLast && (
					<Button
						size="lg"
						onClick={() => navigate("first")}
						className={`bg-white text-${color}-500 hover:bg-gray-100`}
					>
						← Back to Start
					</Button>
				)}
			</div>

			<div className="mt-4 text-xs opacity-60">
				Look at the bottom-right corner for layer indicator
			</div>
		</Flex>
	);
}
