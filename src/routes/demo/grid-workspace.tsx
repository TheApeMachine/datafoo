/**
 * 3D Grid Workspace Demo - Comprehensive demonstration of multi-dimensional layer navigation
 */

import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/youi/page";

export const Route = createFileRoute("/demo/grid-workspace")({
	component: GridWorkspaceDemo,
});

function GridWorkspaceDemo() {
	return (
		<Page.LayerProvider>
			<Page.Layer />
		</Page.LayerProvider>
	);
}
