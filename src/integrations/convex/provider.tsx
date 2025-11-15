import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider } from "convex/react";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

let convexQueryClient: ConvexQueryClient | null = null;

if (CONVEX_URL) {
	try {
		convexQueryClient = new ConvexQueryClient(CONVEX_URL);
	} catch (error) {
		console.error("Failed to initialize ConvexQueryClient:", error);
	}
} else {
	console.warn("missing envar VITE_CONVEX_URL - Convex features will be disabled");
}

export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// If Convex is not configured, render children without the provider
	if (!convexQueryClient) {
		return <>{children}</>;
	}

	return (
		<ConvexProvider client={convexQueryClient.convexClient}>
			{children}
		</ConvexProvider>
	);
}
