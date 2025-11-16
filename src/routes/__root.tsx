import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { Dock } from "@/components/youi/dock";
import { NavigationMenu } from "@/components/youi/nav-menu";
import { Page } from "@/components/youi/page";
import { Sidebar, type TreeData } from "@/components/youi/sidebar";
import ConvexProvider from "../integrations/convex/provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { ThemeProvider } from "../integrations/theme/provider";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

// Navigation tree data
const NAVIGATION_DATA: TreeData = {
	label: "Your Data-Fu Navigation",
	groups: [
		{
			title: "Base",
			items: [
				{
					id: "home",
					label: "Home",
					href: "/",
					current: true,
				},
			],
		},
		{
			title: "Demo",
			items: [
				{
					id: "tanstack-start",
					label: "TanStack Start",
					href: "#tanstack-start",
					items: [
						{
							id: "api-request",
							label: "API Request",
							href: "/demo/start/api-request",
						},
						{
							id: "server-funcs",
							label: "Server Functions",
							href: "/demo/start/server-funcs",
						},
						{
							id: "ssr",
							label: "SSR",
							href: "/demo/start/ssr",
							items: [
								{
									id: "ssr-full",
									label: "Full SSR",
									href: "/demo/start/ssr/full-ssr",
								},
								{
									id: "ssr-data-only",
									label: "Data Only",
									href: "/demo/start/ssr/data-only",
								},
								{
									id: "ssr-spa-mode",
									label: "SPA Mode",
									href: "/demo/start/ssr/spa-mode",
								},
							],
						},
					],
				},
				{
					id: "convex",
					label: "Convex",
					href: "/demo/convex",
				},
				{
					id: "tanstack-query",
					label: "TanStack Query",
					href: "/demo/tanstack-query",
				},
				{
					id: "forms",
					label: "Forms",
					href: "#forms",
					items: [
						{
							id: "simple-form",
							label: "Simple Form",
							href: "/demo/form/simple",
						},
						{
							id: "address-form",
							label: "Address Form",
							href: "/demo/form/address",
						},
					],
				},
				{
					id: "db-chat",
					label: "DB Chat",
					href: "/demo/db-chat",
				},
				{
					id: "store",
					label: "Store",
					href: "/demo/store",
				},
				{
					id: "table",
					label: "Table",
					href: "/demo/table",
				},
				{
					id: "toggle",
					label: "Toggle",
					href: "/demo/toggle",
				},
				{
					id: "sentry",
					label: "Sentry Testing",
					href: "/demo/sentry/testing",
				},
			],
		},
	],
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Your Data-Fu No Good",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const [isSidebarPinned, setIsSidebarPinned] = useState(false);

	return (
		<html
			lang="en"
			data-mode="light"
			data-contrast="normal"
			data-theme="default"
		>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<ConvexProvider>
						<Page.LayerProvider>
							<Page
								className="transition-[grid-template-columns] duration-(--speed,0.16s) ease-(--timing,ease-out)"
								style={{
									gridTemplateColumns: isSidebarPinned
										? "var(--sidebar-width,260px) 1fr auto"
										: "0 1fr auto",
								}}
							>
								<Page.Header>
									<NavigationMenu />
								</Page.Header>
								<Page.Nav>
									<Sidebar
										data={NAVIGATION_DATA}
										onPinnedChange={setIsSidebarPinned}
									/>
								</Page.Nav>
								<Page.Main content="center">{children}</Page.Main>
								<Page.Aside></Page.Aside>
								<Page.Footer>
									<Dock items={[]} />
								</Page.Footer>
							</Page>
							<TanStackDevtools
								config={{
									position: "bottom-right",
								}}
								plugins={[
									{
										name: "Tanstack Router",
										render: <TanStackRouterDevtoolsPanel />,
									},
									StoreDevtools,
									TanStackQueryDevtools,
								]}
							/>
						</Page.LayerProvider>
					</ConvexProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
