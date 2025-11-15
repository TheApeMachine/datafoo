/**
 * Advanced Layers Demo - Comprehensive demonstration of the Enhanced Z-Axis Layer System
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/youi/page";
import { Button } from "@/components/youi/button";
import { Flex } from "@/components/youi/flex";
import { Text } from "@/components/youi/text";
import {
	LayerIndicator,
	LayerMinimap,
	LayerBreadcrumb,
} from "@/components/youi/layer-indicator";
import {
	useLayerNavigation,
	useActiveLayer,
	useLayerPerformance,
	useLayerTransition,
} from "@/components/youi/layer-hooks";

export const Route = createFileRoute("/demo/advanced-layers")({
	component: AdvancedLayersDemo,
});

function AdvancedLayersDemo() {
	return (
		<Page.LayerProvider>
			<LayerIndicator position="bottom-right" showTitles />
			<LayerBreadcrumb />

			{/* Layer 1: Data Source Selection */}
			<Page.Layer
				title="Data Source"
				type="exploration"
				description="Select and configure your data sources"
				showDebug
			>
				<DataSourceLayer />
			</Page.Layer>

			{/* Layer 2: Data Preview & Filters */}
			<Page.Layer
				title="Data Preview"
				type="exploration"
				description="Preview data and apply filters"
				showDebug
			>
				<DataPreviewLayer />
			</Page.Layer>

			{/* Layer 3: Analysis Configuration */}
			<Page.Layer
				title="Analysis Config"
				type="configuration"
				description="Configure analysis parameters"
				showDebug
			>
				<AnalysisConfigLayer />
			</Page.Layer>

			{/* Layer 4: Results Visualization */}
			<Page.Layer
				title="Results"
				type="results"
				description="View analysis results and visualizations"
				showDebug
			>
				<ResultsLayer />
			</Page.Layer>

			{/* Layer 5: Help & Documentation */}
			<Page.Layer
				title="Help"
				type="help"
				description="Documentation and keyboard shortcuts"
				showDebug
			>
				<HelpLayer />
			</Page.Layer>
		</Page.LayerProvider>
	);
}

function DataSourceLayer() {
	const { navigate } = useLayerNavigation();

	return (
		<div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center p-8">
			<Flex className="flex-col items-center gap-6 max-w-2xl text-white">
				<Text.Title className="text-6xl font-bold text-white mb-4">
					Data Source Selection
				</Text.Title>

				<Text.Paragraph center className="text-xl mb-8">
					Choose your data source to begin analysis
				</Text.Paragraph>

				<div className="grid grid-cols-2 gap-4 w-full">
					<Button
						size="lg"
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-32 flex flex-col items-center justify-center gap-2"
					>
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Upload CSV</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<span className="font-semibold">Upload CSV</span>
					</Button>

					<Button
						size="lg"
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-32 flex flex-col items-center justify-center gap-2"
					>
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Connect Database</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
							/>
						</svg>
						<span className="font-semibold">Connect Database</span>
					</Button>

					<Button
						size="lg"
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-32 flex flex-col items-center justify-center gap-2"
					>
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>API Connection</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<span className="font-semibold">API Connection</span>
					</Button>

					<Button
						size="lg"
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-32 flex flex-col items-center justify-center gap-2"
					>
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Cloud Storage</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
							/>
						</svg>
						<span className="font-semibold">Cloud Storage</span>
					</Button>
				</div>

				<Button
					size="lg"
					onClick={() => navigate("forward")}
					className="mt-8 bg-white text-blue-500 hover:bg-gray-100 px-8"
				>
					Continue to Preview →
				</Button>

				<LayerNavigationHint />
			</Flex>
		</div>
	);
}

function DataPreviewLayer() {
	const { navigate } = useLayerNavigation();

	return (
		<div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
			<Flex className="flex-col items-center gap-6 max-w-4xl text-white">
				<Text.Title className="text-6xl font-bold text-white mb-4">
					Data Preview
				</Text.Title>

				<Text.Paragraph center className="text-xl mb-4">
					Your data is loaded and ready for analysis
				</Text.Paragraph>

				{/* Mock data table */}
				<div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b border-white/20">
								<tr>
									<th className="p-3 font-semibold">Name</th>
									<th className="p-3 font-semibold">Value</th>
									<th className="p-3 font-semibold">Category</th>
									<th className="p-3 font-semibold">Status</th>
								</tr>
							</thead>
							<tbody>
								{[1, 2, 3, 4, 5].map((i) => (
									<tr key={i} className="border-b border-white/10">
										<td className="p-3">Item {i}</td>
										<td className="p-3">${(i * 100).toFixed(2)}</td>
										<td className="p-3">Category {i % 3}</td>
										<td className="p-3">
											<span className="px-2 py-1 bg-green-500/30 rounded text-xs">
												Active
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="flex gap-4 mt-4">
					<Button
						size="lg"
						onClick={() => navigate("backward")}
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
					>
						← Back
					</Button>
					<Button
						size="lg"
						onClick={() => navigate("forward")}
						className="bg-white text-purple-500 hover:bg-gray-100"
					>
						Configure Analysis →
					</Button>
				</div>

				<LayerNavigationHint />
			</Flex>
		</div>
	);
}

function AnalysisConfigLayer() {
	const { navigate } = useLayerNavigation();

	return (
		<div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center p-8">
			<Flex className="flex-col items-center gap-6 max-w-2xl text-white">
				<Text.Title className="text-6xl font-bold text-white mb-4">
					Analysis Configuration
				</Text.Title>

				<Text.Paragraph center className="text-xl mb-8">
					Fine-tune your analysis parameters
				</Text.Paragraph>

				<div className="w-full space-y-4">
					{/* Config options */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<label className="block mb-2 font-semibold">Analysis Type</label>
						<select className="w-full bg-white/20 border border-white/30 rounded px-4 py-2 text-white">
							<option>Descriptive Statistics</option>
							<option>Correlation Analysis</option>
							<option>Time Series</option>
							<option>Regression</option>
						</select>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<label className="block mb-2 font-semibold">Confidence Level</label>
						<input
							type="range"
							min="90"
							max="99"
							defaultValue="95"
							className="w-full"
						/>
						<span className="text-sm">95%</span>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<label className="flex items-center gap-2">
							<input type="checkbox" className="w-4 h-4" defaultChecked />
							<span>Include outlier detection</span>
						</label>
					</div>
				</div>

				<div className="flex gap-4 mt-4">
					<Button
						size="lg"
						onClick={() => navigate("backward")}
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
					>
						← Back
					</Button>
					<Button
						size="lg"
						onClick={() => navigate("forward")}
						className="bg-white text-green-500 hover:bg-gray-100"
					>
						Run Analysis →
					</Button>
				</div>

				<LayerNavigationHint />
			</Flex>
		</div>
	);
}

function ResultsLayer() {
	const { navigate } = useLayerNavigation();

	return (
		<div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-8">
			<Flex className="flex-col items-center gap-6 max-w-4xl text-white">
				<Text.Title className="text-6xl font-bold text-white mb-4">
					Analysis Results
				</Text.Title>

				<Text.Paragraph center className="text-xl mb-8">
					Your analysis is complete!
				</Text.Paragraph>

				{/* Mock charts */}
				<div className="grid grid-cols-2 gap-4 w-full">
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 h-64 flex items-center justify-center">
						<div className="text-center">
							<div className="text-4xl font-bold mb-2">87.3%</div>
							<div className="text-sm">Correlation Score</div>
						</div>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 h-64 flex items-center justify-center">
						<div className="text-center">
							<div className="text-4xl font-bold mb-2">2,451</div>
							<div className="text-sm">Data Points</div>
						</div>
					</div>

					<div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 h-48 flex items-center justify-center">
						<div className="text-center">
							<svg
								className="w-16 h-16 mx-auto mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Chart</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<div className="text-sm">Interactive Chart Visualization</div>
						</div>
					</div>
				</div>

				<div className="flex gap-4 mt-4">
					<Button
						size="lg"
						onClick={() => navigate("backward")}
						className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
					>
						← Back
					</Button>
					<Button
						size="lg"
						onClick={() => navigate("last")}
						className="bg-white text-orange-500 hover:bg-gray-100"
					>
						Need Help? →
					</Button>
				</div>

				<LayerNavigationHint />
			</Flex>
		</div>
	);
}

function HelpLayer() {
	const { navigate } = useLayerNavigation();
	const performance = useLayerPerformance();
	const { config, setConfig } = useLayerTransition();

	return (
		<div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center p-8">
			<Flex className="flex-col items-center gap-6 max-w-3xl text-white">
				<Text.Title className="text-6xl font-bold text-white mb-4">
					Help & Settings
				</Text.Title>

				<div className="w-full space-y-4">
					{/* Keyboard shortcuts */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">↑/↓</kbd>
								<span>Navigate layers</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">
									Ctrl/⌘ + ↑/↓
								</kbd>
								<span>First/Last layer</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">Esc</kbd>
								<span>Return to start</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">1-5</kbd>
								<span>Jump to specific layer</span>
							</div>
							<div className="flex justify-between">
								<kbd className="px-2 py-1 bg-white/20 rounded">?</kbd>
								<span>Show shortcuts overlay</span>
							</div>
						</div>
					</div>

					{/* Performance metrics */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<h3 className="text-xl font-semibold mb-4">Performance</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<div className="text-2xl font-bold">
									{performance.fps.toFixed(1)}
								</div>
								<div className="text-xs opacity-80">FPS</div>
							</div>
							<div>
								<div className="text-2xl font-bold">{performance.layerCount}</div>
								<div className="text-xs opacity-80">Total Layers</div>
							</div>
							<div>
								<div className="text-2xl font-bold">
									{performance.renderedCount}
								</div>
								<div className="text-xs opacity-80">Rendered</div>
							</div>
							<div>
								<div className="text-2xl font-bold">{performance.culledCount}</div>
								<div className="text-xs opacity-80">Culled</div>
							</div>
						</div>
					</div>

					{/* Transition settings */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
						<h3 className="text-xl font-semibold mb-4">Animation Settings</h3>
						<div className="space-y-3">
							<div>
								<label className="block mb-2 text-sm">Transition Type</label>
								<select
									className="w-full bg-white/20 border border-white/30 rounded px-4 py-2 text-white"
									value={config.type}
									onChange={(e) =>
										setConfig({
											type: e.target.value as "spring" | "ease-in-out",
										})
									}
								>
									<option value="spring">Spring</option>
									<option value="ease-in-out">Ease In-Out</option>
									<option value="ease-out">Ease Out</option>
									<option value="linear">Linear</option>
								</select>
							</div>

							{config.type === "spring" && (
								<>
									<div>
										<label className="block mb-2 text-sm">
											Stiffness: {config.stiffness}
										</label>
										<input
											type="range"
											min="50"
											max="300"
											value={config.stiffness}
											onChange={(e) =>
												setConfig({ stiffness: Number(e.target.value) })
											}
											className="w-full"
										/>
									</div>
									<div>
										<label className="block mb-2 text-sm">
											Damping: {config.damping}
										</label>
										<input
											type="range"
											min="10"
											max="50"
											value={config.damping}
											onChange={(e) =>
												setConfig({ damping: Number(e.target.value) })
											}
											className="w-full"
										/>
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				<Button
					size="lg"
					onClick={() => navigate("first")}
					className="mt-4 bg-white text-indigo-500 hover:bg-gray-100"
				>
					← Return to Start
				</Button>

				<LayerNavigationHint />
			</Flex>
		</div>
	);
}

function LayerNavigationHint() {
	const activeLayer = useActiveLayer();

	return (
		<div className="mt-8 p-4 bg-black/20 rounded-lg backdrop-blur-sm border border-white/20 text-center">
			<p className="text-sm opacity-80">
				Press <kbd className="px-2 py-1 bg-white/20 rounded mx-1">↓</kbd> for
				next layer or{" "}
				<kbd className="px-2 py-1 bg-white/20 rounded mx-1">?</kbd> for help
			</p>
			<p className="text-xs opacity-60 mt-2">
				Swipe left/right on mobile • Current: {activeLayer?.title}
			</p>
		</div>
	);
}

