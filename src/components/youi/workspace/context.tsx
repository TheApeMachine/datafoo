import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
	type ReactNode,
	useEffect,
} from "react";
import type {
	ConnectLayerInput,
	EdgeDirection,
	LayerDefinition,
	LayerNode,
	LayerWorkspaceContextValue,
	LayerWorkspaceSnapshot,
	NavigationDirection,
} from "./types";

const LayerWorkspaceContext = createContext<LayerWorkspaceContextValue | null>(
	null,
);

const edgeOffsets: Record<EdgeDirection, { x: number; y: number }> = {
	up: { x: 0, y: 1 },
	right: { x: 1, y: 0 },
	down: { x: 0, y: -1 },
	left: { x: -1, y: 0 },
};

const oppositeEdge: Record<EdgeDirection | "above" | "below", string> = {
	up: "down",
	down: "up",
	left: "right",
	right: "left",
	above: "below",
	below: "above",
};

const coordKey = (x: number, y: number, z: number) => `${x}:${y}:${z}`;
const surfaceKey = (x: number, y: number) => `${x}:${y}`;

interface ProviderProps {
	children: ReactNode;
	virtualizeNeighbors?: boolean;
}

export const LayerWorkspaceProvider = ({
	children,
	virtualizeNeighbors = false,
}: ProviderProps) => {
	const layersRef = useRef<Map<string, LayerNode>>(new Map());
	const positionIndexRef = useRef<Map<string, string>>(new Map());
	const surfaceStacksRef = useRef<Map<string, string[]>>(new Map());

	const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

	const registerNode = useCallback((node: LayerNode) => {
		layersRef.current.set(node.id, node);
		positionIndexRef
			.current
			.set(coordKey(node.x, node.y, node.z), node.id);

		const stackKey = surfaceKey(node.x, node.y);
		const stack = surfaceStacksRef.current.get(stackKey) ?? [];
		stack.push(node.id);
		stack.sort((aId, bId) => {
			const a = layersRef.current.get(aId)!;
			const b = layersRef.current.get(bId)!;
			return b.z - a.z;
		});
		surfaceStacksRef.current.set(stackKey, stack);
	}, []);

	const updateNode = useCallback((node: LayerNode) => {
		layersRef.current.set(node.id, node);
	}, []);

	const ensurePositionAvailable = useCallback((x: number, y: number, z: number) => {
		const key = coordKey(x, y, z);
		if (positionIndexRef.current.has(key)) {
			throw new Error(
				`Layer workspace: position ${key} is already occupied.`,
			);
		}
	}, []);

	const addRootLayer = useCallback(
		(layer: LayerDefinition) => {
			if (layersRef.current.size > 0) {
				throw new Error("Layer workspace already has a root layer");
			}

			const node: LayerNode = {
				...layer,
				x: 0,
				y: 0,
				z: 0,
				adjacent: {},
				createdAt: Date.now(),
			};
			registerNode(node);
			setActiveLayerId(node.id);
			return node.id;
		},
		[registerNode],
	);

	const addLayer = useCallback(
		(input: ConnectLayerInput) => {
			const from = layersRef.current.get(input.fromLayerId);
			if (!from) {
				throw new Error(`Layer ${input.fromLayerId} not found.`);
			}

			if (from.adjacent[input.direction]) {
				throw new Error(
					`Layer ${from.id} already has a neighbor on ${input.direction}.`,
				);
			}

			let x = from.x;
			let y = from.y;
			let z = from.z;

			if (input.direction === "above") {
				z = from.z + 1;
			} else {
				const offset = edgeOffsets[input.direction];
				x = from.x + offset.x;
				y = from.y + offset.y;
			}

			ensurePositionAvailable(x, y, z);

			const node: LayerNode = {
				id: input.id,
				title: input.title,
				render: input.render,
				description: input.description,
				data: input.data,
				x,
				y,
				z,
				adjacent: {},
				createdAt: Date.now(),
			};

			registerNode(node);
			const target = layersRef.current.get(node.id)!;

			from.adjacent[input.direction] = node.id;
			target.adjacent[
				oppositeEdge[input.direction] as EdgeDirection | "below"
			] = from.id;

			updateNode(from);
			updateNode(target);

			setActiveLayerId(node.id);
			return node.id;
		},
		[ensurePositionAvailable, registerNode, updateNode],
	);

	const setActiveLayer = useCallback((layerId: string) => {
		if (!layersRef.current.has(layerId)) {
			throw new Error(`Layer ${layerId} not found.`);
		}
		setActiveLayerId(layerId);
	}, []);

	const getActiveLayer = useCallback(() => {
		if (!activeLayerId) return null;
		return layersRef.current.get(activeLayerId) ?? null;
	}, [activeLayerId]);

	const getVisibleLayerIds = useCallback(() => {
		if (!activeLayerId) return [];
		if (!virtualizeNeighbors) {
			return [activeLayerId];
		}
		const active = layersRef.current.get(activeLayerId);
		if (!active) return [activeLayerId];
		const ids = new Set<string>([activeLayerId]);
		Object.values(active.adjacent).forEach((neighborId) => {
			if (neighborId) ids.add(neighborId);
		});
		return Array.from(ids);
	}, [activeLayerId, virtualizeNeighbors]);

	const navigate = useCallback(
		(direction: NavigationDirection) => {
			const active = getActiveLayer();
			if (!active) return;

			if (direction === "first") {
				setActiveLayerId((prev) => {
					if (!prev) return prev;
					const node = getActiveLayer();
					if (!node) return prev;
					const stack = surfaceStacksRef.current.get(
						surfaceKey(node.x, node.y),
					);
					return stack?.[0] ?? prev;
				});
				return;
			}

			if (direction === "last") {
				setActiveLayerId((prev) => {
					if (!prev) return prev;
					const node = getActiveLayer();
					if (!node) return prev;
					const stack = surfaceStacksRef.current.get(
						surfaceKey(node.x, node.y),
					);
					return stack?.[stack.length - 1] ?? prev;
				});
				return;
			}

			let neighborKey: string | undefined;
			if (direction === "forward") {
				neighborKey = active.adjacent.above ?? active.adjacent["above"];
			} else if (direction === "backward") {
				neighborKey = active.adjacent.below ?? active.adjacent["below"];
			} else {
				neighborKey = active.adjacent[direction];
			}

			if (neighborKey) {
				setActiveLayerId(neighborKey);
			}
		},
		[getActiveLayer],
	);

	const navigateDepthIndex = useCallback(
		(index: number) => {
			const active = getActiveLayer();
			if (!active) return;
			const stack = surfaceStacksRef.current.get(
				surfaceKey(active.x, active.y),
			);
			if (!stack) return;
			if (index < 0 || index >= stack.length) return;
			setActiveLayerId(stack[index]);
		},
		[getActiveLayer],
	);

	const isEdgeAvailable = useCallback(
		(layerId: string, direction: EdgeDirection | "above") => {
			const layer = layersRef.current.get(layerId);
			if (!layer) return false;
			return !layer.adjacent[direction];
		},
		[],
	);

	const getSnapshot = useCallback((): LayerWorkspaceSnapshot => {
		const visible = getVisibleLayerIds();
		return {
			activeLayerId,
			layers: new Map(layersRef.current),
			visibleLayerIds: visible,
		};
	}, [activeLayerId, getVisibleLayerIds]);

	const value = useMemo<LayerWorkspaceContextValue>(
		() => ({
			addRootLayer,
			addLayer,
			setActiveLayer,
			getActiveLayer,
			getSnapshot,
			navigate,
			navigateDepthIndex,
			isEdgeAvailable,
		}),
		[
			addLayer,
			addRootLayer,
			getActiveLayer,
			getSnapshot,
			isEdgeAvailable,
			navigate,
			navigateDepthIndex,
			setActiveLayer,
		],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.altKey || event.metaKey || event.shiftKey) return;

			if (event.key === "ArrowUp") {
				event.preventDefault();
				navigate("up");
				return;
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				navigate("right");
				return;
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				navigate("down");
				return;
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				navigate("left");
				return;
			}

			if (/^[0-9]$/.test(event.key)) {
				event.preventDefault();
				const index = Number.parseInt(event.key, 10);
				const targetIndex = index === 0 ? 0 : index - 1;
				navigateDepthIndex(targetIndex);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [navigate, navigateDepthIndex]);

	return (
		<LayerWorkspaceContext.Provider value={value}>
			{children}
		</LayerWorkspaceContext.Provider>
	);
};

export const useLayerWorkspace = () => {
	const context = useContext(LayerWorkspaceContext);
	if (!context) {
		throw new Error(
			"useLayerWorkspace must be used within LayerWorkspaceProvider",
		);
	}
	return context;
};


