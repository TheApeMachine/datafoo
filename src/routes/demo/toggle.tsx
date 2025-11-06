import { useState } from "react";
import { Toggle } from "@/components/youi/tabs";

/**
 * Toggle Component Examples
 *
 * Demonstrates the various ways to use the Toggle component.
 */
export function ToggleExamples() {
	const [simpleValue, setSimpleValue] = useState("option1");
	const [tierValue, setTierValue] = useState("free");

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "var(--space-12)",
				padding: "var(--space-8)",
				backgroundColor: "var(--color-bg-primary)",
				minHeight: "100vh",
			}}
		>
			<section>
				<h2
					style={{
						fontSize: "var(--text-2xl)",
						fontWeight: "var(--font-semibold)",
						marginBottom: "var(--space-6)",
						color: "var(--color-fg-primary)",
					}}
				>
					Simple Toggle
				</h2>
				<p
					style={{
						marginBottom: "var(--space-4)",
						color: "var(--color-fg-secondary)",
					}}
				>
					Basic two-option toggle. Selected: <strong>{simpleValue}</strong>
				</p>
				<Toggle value={simpleValue} onChange={setSimpleValue}>
					<Toggle.Option value="option1" label="Option 1" />
					<Toggle.Option value="option2" label="Option 2" />
				</Toggle>
			</section>

			<section>
				<h2
					style={{
						fontSize: "var(--text-2xl)",
						fontWeight: "var(--font-semibold)",
						marginBottom: "var(--space-6)",
						color: "var(--color-fg-primary)",
					}}
				>
					Pricing Tier Toggle
				</h2>
				<p
					style={{
						marginBottom: "var(--space-4)",
						color: "var(--color-fg-secondary)",
					}}
				>
					Toggle with nested options for Premium tier. Selected:{" "}
					<strong>{tierValue}</strong>
				</p>
				<Toggle value={tierValue} onChange={setTierValue}>
					<Toggle.Option value="free" label="Free" />
					<Toggle.OptionGroup value="premium" label="Premium">
						<Toggle.SubOption
							value="premium-solo"
							label="Solo"
							srLabel="Premium Solo"
						/>
						<Toggle.SubOption
							value="premium-team"
							label="Team"
							srLabel="Premium Team"
						/>
					</Toggle.OptionGroup>
				</Toggle>
			</section>

			<section>
				<h2
					style={{
						fontSize: "var(--text-2xl)",
						fontWeight: "var(--font-semibold)",
						marginBottom: "var(--space-6)",
						color: "var(--color-fg-primary)",
					}}
				>
					Uncontrolled Toggle
				</h2>
				<p
					style={{
						marginBottom: "var(--space-4)",
						color: "var(--color-fg-secondary)",
					}}
				>
					Using defaultValue for uncontrolled usage
				</p>
				<Toggle
					defaultValue="premium-solo"
					onChange={(value) => console.log("Changed to:", value)}
				>
					<Toggle.Option value="free" label="Free" />
					<Toggle.OptionGroup value="premium" label="Premium">
						<Toggle.SubOption value="premium-solo" label="Solo" />
						<Toggle.SubOption value="premium-team" label="Team" />
					</Toggle.OptionGroup>
				</Toggle>
			</section>

			<section>
				<h2
					style={{
						fontSize: "var(--text-2xl)",
						fontWeight: "var(--font-semibold)",
						marginBottom: "var(--space-6)",
						color: "var(--color-fg-primary)",
					}}
				>
					View Mode Toggle
				</h2>
				<Toggle defaultValue="list">
					<Toggle.Option value="list" label="List" />
					<Toggle.Option value="grid" label="Grid" />
				</Toggle>
			</section>

			<section>
				<h2
					style={{
						fontSize: "var(--text-2xl)",
						fontWeight: "var(--font-semibold)",
						marginBottom: "var(--space-6)",
						color: "var(--color-fg-primary)",
					}}
				>
					Content Filter Toggle
				</h2>
				<Toggle defaultValue="published">
					<Toggle.Option value="all" label="All" />
					<Toggle.OptionGroup value="status" label="Status">
						<Toggle.SubOption value="status-draft" label="Draft" />
						<Toggle.SubOption value="status-published" label="Published" />
					</Toggle.OptionGroup>
				</Toggle>
			</section>
		</div>
	);
}
