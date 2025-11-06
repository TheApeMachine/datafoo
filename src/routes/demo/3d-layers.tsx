import { createFileRoute } from "@tanstack/react-router";
import { Flex } from "@/components/youi/flex";
import { Page } from "@/components/youi/page";
import { Text } from "@/components/youi/text";

export const Route = createFileRoute("/demo/3d-layers")({
	component: ThreeDLayersDemo,
});

function ThreeDLayersDemo() {
	return (
		<Page.LayerProvider>
			<Page.Layer className="bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
				<Flex className="flex-col items-center gap-6 text-white">
					<Text.Title className="text-6xl font-bold text-white">
						Layer 1
					</Text.Title>
					<Text.Paragraph center>The Front Layer</Text.Paragraph>
					<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
						<Text.Paragraph center>
							Press <kbd className="px-2 py-1 bg-white/20 rounded">↑</kbd> to go
							deeper
						</Text.Paragraph>
					</div>
				</Flex>
			</Page.Layer>

			<Page.Layer className="bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
				<Flex className="flex-col items-center gap-6 text-white">
					<Text.Title className="text-6xl font-bold text-white">
						Layer 2
					</Text.Title>
					<Text.Paragraph center>The Middle Layer</Text.Paragraph>
					<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
						<Text.Paragraph center>
							Press <kbd className="px-2 py-1 bg-white/20 rounded">↓</kbd> to go
							back or <kbd className="px-2 py-1 bg-white/20 rounded">↑</kbd> to
							go deeper
						</Text.Paragraph>
					</div>
				</Flex>
			</Page.Layer>

			<Page.Layer className="bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
				<Flex className="flex-col items-center gap-6 text-white">
					<Text.Title className="text-6xl font-bold text-white">
						Layer 3
					</Text.Title>
					<Text.Paragraph center>The Back Layer</Text.Paragraph>
					<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
						<Text.Paragraph center>
							Press <kbd className="px-2 py-1 bg-white/20 rounded">↓</kbd> to go
							back
						</Text.Paragraph>
					</div>
				</Flex>
			</Page.Layer>

			<Page.Layer className="bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
				<Flex className="flex-col items-center gap-6 text-white">
					<Text.Title className="text-6xl font-bold text-white">
						Layer 4
					</Text.Title>
					<Text.Paragraph center>The Deepest Layer</Text.Paragraph>
					<div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
						<Text.Paragraph center>
							You've reached the bottom!{" "}
							<kbd className="px-2 py-1 bg-white/20 rounded">↓</kbd> to go back
						</Text.Paragraph>
					</div>
				</Flex>
			</Page.Layer>
		</Page.LayerProvider>
	);
}
