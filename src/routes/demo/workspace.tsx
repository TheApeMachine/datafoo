import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
	LayerWorkspaceProvider,
	LayerWorkspaceViewport,
	useLayerWorkspace,
	type EdgeDirection,
} from "@/components/youi/workspace";
import { Button } from "@/components/youi/button";
import { Flex } from "@/components/youi/flex";
import { Text } from "@/components/youi/text";

export const Route = createFileRoute("/demo/workspace")({
	component: WorkspaceDemoRoute,
});

function WorkspaceDemoRoute() {
	return (
		<LayerWorkspaceProvider>
			<WorkspaceDemo />
		</LayerWorkspaceProvider>
	);
}

const edgeLabels: Record<EdgeDirection | "above", string> = {
	up: "Top",
	right: "Right",
	down: "Bottom",
	left: "Left",
	above: "On-Top",
};

const directions: Array<EdgeDirection | "above"> = [
	"up",
	"right",
	"down",
	"left",
	"above",
];

function WorkspaceDemo() {
	const workspace = useLayerWorkspace();
	const snapshot = workspace.getSnapshot();
	const active = workspace.getActiveLayer();
	const [layerCount, setLayerCount] = useState(0);

	const insight = useMemo(() => {
		if (!active) {
			return "No layers yet. Add a root layer to begin.";
		}
		const coord = `(${active.x}, ${active.y}, ${active.z})`;
		const neighbors = directions
			.map((dir) => (active.adjacent[dir] ? edgeLabels[dir] : null))
			.filter(Boolean)
			.join(", ");
		return neighbors.length > 0
			? `Active layer ${active.title} @ ${coord}. Connected: ${neighbors}`
			: `Active layer ${active.title} @ ${coord}. No neighbors yet.`;
	}, [active]);

	const handleAddRoot = () => {
		const index = layerCount + 1;
		workspace.addRootLayer({
			id: `layer-root-${index}`,
			title: `Layer Root ${index}`,
			render: () => <LayerCard title={`Root Layer ${index}`} />,
		});
		setLayerCount(index);
	};

	const handleAddNeighbor = (direction: EdgeDirection | "above") => {
		if (!active) return;
		const index = layerCount + 1;
		workspace.addLayer({
			fromLayerId: active.id,
			direction,
			id: `layer-${direction}-${index}`,
			title: `Layer ${index}`,
			render: () => (
				<LayerCard
					title={`Layer ${index}`}
					subtitle={`Connected ${edgeLabels[direction]} of ${active.title}`}
				/>
			),
		});
		setLayerCount(index);
	};

	return (
		<div className="flex min-h-screen flex-col bg-surface text-fg-primary">
			<header className="border-b border-border-primary px-6 py-4">
				<Text.Title className="text-2xl">3D Layer Workspace</Text.Title>
				<Text.Paragraph className="text-sm text-fg-secondary">
					Arrow keys navigate edges; numeric keys select depth. Only the active
					layer is mounted (virtualized).
				</Text.Paragraph>
			</header>

			<main className="flex flex-1 flex-row">
				<section className="w-80 border-r border-border-primary p-6 space-y-4">
					<Text.Subtitle className="text-lg font-semibold">
						Controls
					</Text.Subtitle>

					{snapshot.activeLayerId ? (
						<div className="space-y-2">
							<Text.Paragraph className="text-sm">{insight}</Text.Paragraph>
							<div className="grid grid-cols-2 gap-2">
								{directions.map((direction) => (
									<Button
										key={direction}
										size="sm"
										disabled={!workspace.isEdgeAvailable(snapshot.activeLayerId!, direction)}
										onClick={() => handleAddNeighbor(direction)}
										className="justify-center"
									>
										Add {edgeLabels[direction]}
									</Button>
								))}
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<Text.Paragraph className="text-sm">
								Start by creating the root layer.
							</Text.Paragraph>
							<Button
								onClick={handleAddRoot}
								className="justify-center"
							>
								Add root layer
							</Button>
						</div>
					)}

					<div className="pt-4">
						<Text.Subtitle className="text-sm font-semibold">
							Workspace State
						</Text.Subtitle>
						<pre className="mt-2 max-h-48 overflow-y-auto rounded bg-surface-elevated p-3 text-xs">
							{JSON.stringify(
								{
									activeLayerId: snapshot.activeLayerId,
									visibleLayerIds: snapshot.visibleLayerIds,
									totalLayers: snapshot.layers.size,
								},
								null,
								2,
							)}
						</pre>
					</div>
				</section>

				<section className="flex flex-1 items-center justify-center bg-surface-elevated">
					<div className="relative h-full w-full max-w-4xl px-8 py-12">
						{snapshot.activeLayerId ? (
							<LayerWorkspaceViewport className="h-full w-full rounded-lg border border-border-primary bg-surface shadow-lg p-8" />
						) : (
							<div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border-secondary text-sm text-fg-secondary">
								No active layer. Add one using the controls.
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}

function LayerCard({
	title,
	subtitle,
}: {
	title: string;
	subtitle?: string;
}) {
	return (
		<Flex className="h-full w-full flex-col items-center justify-center gap-4 text-center">
			<Text.Title className="text-4xl font-bold">{title}</Text.Title>
			{subtitle ? (
				<Text.Paragraph className="max-w-md text-fg-secondary">
					{subtitle}
				</Text.Paragraph>
			) : null}
		</Flex>
	);
}


