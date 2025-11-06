import type {
	Theme,
	ThemeContrast,
	ThemeMode,
} from "@/integrations/theme/provider";
import { useTheme } from "@/integrations/theme/provider";

/**
 * Theme Switcher Component
 *
 * Provides UI controls for switching between modes, themes, and contrast levels.
 * Demonstrates the complete theme system capabilities.
 *
 * @example
 * ```tsx
 * <ThemeSwitcher />
 * ```
 */
export function ThemeSwitcher() {
	const {
		mode,
		contrast,
		theme,
		setMode,
		setContrast,
		setTheme,
		toggleMode,
		toggleContrast,
	} = useTheme();

	const modes: Array<{ value: ThemeMode; label: string; icon: string }> = [
		{ value: "light", label: "Light", icon: "☀️" },
		{ value: "dim", label: "Dim", icon: "☁️" },
		{ value: "dark", label: "Dark", icon: "🌙" },
	];

	const themes: Array<{ value: Theme; label: string }> = [
		{ value: "default", label: "Default" },
		{ value: "glassmorphism", label: "Glassmorphism" },
		{ value: "cyberpunk", label: "Cyberpunk" },
		{ value: "neumorphism", label: "Neumorphism" },
	];

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "var(--space-4)",
				padding: "var(--space-6)",
				backgroundColor: "var(--color-bg-secondary)",
				borderRadius: "var(--radius-lg)",
				border: "1px solid var(--color-border-primary)",
			}}
		>
			<h3
				style={{
					margin: 0,
					fontSize: "var(--text-lg)",
					fontWeight: "var(--font-semibold)",
					color: "var(--color-fg-primary)",
				}}
			>
				Theme Settings
			</h3>

			{/* Mode Selection */}
			<div>
				<label
					style={{
						display: "block",
						marginBottom: "var(--space-2)",
						fontSize: "var(--text-sm)",
						fontWeight: "var(--font-medium)",
						color: "var(--color-fg-secondary)",
					}}
				>
					Mode
				</label>
				<div style={{ display: "flex", gap: "var(--space-2)" }}>
					{modes.map((m) => (
						<button
							key={m.value}
							type="button"
							onClick={() => setMode(m.value)}
							style={{
								flex: 1,
								padding: "var(--space-3)",
								backgroundColor:
									mode === m.value
										? "var(--color-accent-primary)"
										: "var(--color-bg-tertiary)",
								color:
									mode === m.value
										? "var(--color-fg-on-accent)"
										: "var(--color-fg-primary)",
								border: `1px solid ${mode === m.value ? "var(--color-accent-primary)" : "var(--color-border-primary)"}`,
								borderRadius: "var(--radius-md)",
								cursor: "pointer",
								fontSize: "var(--text-sm)",
								fontWeight: "var(--font-medium)",
								transition: `all var(--transition-fast) var(--transition-ease)`,
							}}
						>
							<div>{m.icon}</div>
							<div>{m.label}</div>
						</button>
					))}
				</div>
			</div>

			{/* Theme Selection */}
			<div>
				<label
					htmlFor="theme-select"
					style={{
						display: "block",
						marginBottom: "var(--space-2)",
						fontSize: "var(--text-sm)",
						fontWeight: "var(--font-medium)",
						color: "var(--color-fg-secondary)",
					}}
				>
					Theme
				</label>
				<select
					id="theme-select"
					value={theme}
					onChange={(e) => setTheme(e.target.value as Theme)}
					style={{
						width: "100%",
						padding: "var(--space-3)",
						backgroundColor: "var(--color-bg-tertiary)",
						color: "var(--color-fg-primary)",
						border: "1px solid var(--color-border-primary)",
						borderRadius: "var(--radius-md)",
						fontSize: "var(--text-sm)",
						cursor: "pointer",
					}}
				>
					{themes.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
			</div>

			{/* Contrast Toggle */}
			<div>
				<label
					style={{
						display: "flex",
						alignItems: "center",
						gap: "var(--space-3)",
						cursor: "pointer",
						fontSize: "var(--text-sm)",
						color: "var(--color-fg-secondary)",
					}}
				>
					<input
						type="checkbox"
						checked={contrast === "high"}
						onChange={(e) => setContrast(e.target.checked ? "high" : "normal")}
						style={{
							cursor: "pointer",
							width: "var(--space-4)",
							height: "var(--space-4)",
						}}
					/>
					<span style={{ fontWeight: "var(--font-medium)" }}>
						High Contrast Mode
					</span>
				</label>
				<p
					style={{
						margin: "var(--space-2) 0 0",
						fontSize: "var(--text-xs)",
						color: "var(--color-fg-tertiary)",
					}}
				>
					Increases contrast for better accessibility
				</p>
			</div>

			{/* Quick Actions */}
			<div
				style={{
					display: "flex",
					gap: "var(--space-2)",
					paddingTop: "var(--space-4)",
					borderTop: "1px solid var(--color-border-secondary)",
				}}
			>
				<button
					type="button"
					onClick={toggleMode}
					style={{
						flex: 1,
						padding: "var(--space-2) var(--space-3)",
						backgroundColor: "var(--color-bg-tertiary)",
						color: "var(--color-fg-primary)",
						border: "1px solid var(--color-border-primary)",
						borderRadius: "var(--radius-md)",
						cursor: "pointer",
						fontSize: "var(--text-xs)",
						fontWeight: "var(--font-medium)",
						transition: `all var(--transition-fast) var(--transition-ease)`,
					}}
				>
					Toggle Mode
				</button>
				<button
					type="button"
					onClick={toggleContrast}
					style={{
						flex: 1,
						padding: "var(--space-2) var(--space-3)",
						backgroundColor: "var(--color-bg-tertiary)",
						color: "var(--color-fg-primary)",
						border: "1px solid var(--color-border-primary)",
						borderRadius: "var(--radius-md)",
						cursor: "pointer",
						fontSize: "var(--text-xs)",
						fontWeight: "var(--font-medium)",
						transition: `all var(--transition-fast) var(--transition-ease)`,
					}}
				>
					Toggle Contrast
				</button>
			</div>

			{/* Current State Display */}
			<div
				style={{
					padding: "var(--space-3)",
					backgroundColor: "var(--color-bg-tertiary)",
					borderRadius: "var(--radius-md)",
					fontSize: "var(--text-xs)",
					color: "var(--color-fg-tertiary)",
				}}
			>
				<div>
					<strong style={{ color: "var(--color-fg-secondary)" }}>
						Current:
					</strong>{" "}
					{theme} / {mode} / {contrast}
				</div>
			</div>
		</div>
	);
}
