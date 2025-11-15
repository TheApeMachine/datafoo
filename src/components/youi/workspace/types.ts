import type { ReactNode } from "react";

export type EdgeDirection = "up" | "right" | "down" | "left";
export type DepthDirection = "above" | "below";

export type NavigationDirection =
	| EdgeDirection
	| "forward"
	| "backward"
	| "first"
	| "last";

export interface LayerDefinition {
	id: string;
	title: string;
	render: () => ReactNode;
	description?: string;
	data?: Record<string, unknown>;
}

export interface LayerNode extends LayerDefinition {
	x: number;
	y: number;
	z: number;
	adjacent: Partial<Record<EdgeDirection | DepthDirection, string>>;
	createdAt: number;
}

export interface LayerWorkspaceSnapshot {
	activeLayerId: string | null;
	layers: Map<string, LayerNode>;
	visibleLayerIds: string[];
}

export interface ConnectLayerInput extends LayerDefinition {
	fromLayerId: string;
	direction: EdgeDirection | "above";
}

export interface LayerWorkspaceContextValue {
	addRootLayer: (layer: LayerDefinition) => string;
	addLayer: (input: ConnectLayerInput) => string;
	setActiveLayer: (layerId: string) => void;
	getActiveLayer: () => LayerNode | null;
	getSnapshot: () => LayerWorkspaceSnapshot;
	navigate: (direction: NavigationDirection) => void;
	navigateDepthIndex: (index: number) => void;
	isEdgeAvailable: (layerId: string, direction: EdgeDirection | "above") => boolean;
}


