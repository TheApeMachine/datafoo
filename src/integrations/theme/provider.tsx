import {
	createContext,
	type ReactNode,
	Suspense,
	use,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

/**
 * Available theme modes
 */
export type ThemeMode = "light" | "dim" | "dark";

/**
 * Available contrast levels
 */
export type ThemeContrast = "normal" | "high";

/**
 * Available themes
 */
export type Theme = "default" | "glassmorphism" | "cyberpunk" | "neumorphism";

/**
 * Theme context value
 */
interface ThemeContextValue {
	/** Current theme mode (light/dim/dark) */
	mode: ThemeMode;
	/** Current contrast level */
	contrast: ThemeContrast;
	/** Current theme name */
	theme: Theme;
	/** Set theme mode */
	setMode: (mode: ThemeMode) => void;
	/** Set contrast level */
	setContrast: (contrast: ThemeContrast) => void;
	/** Set theme */
	setTheme: (theme: Theme) => void;
	/** Toggle between light/dim/dark modes */
	toggleMode: () => void;
	/** Toggle contrast */
	toggleContrast: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEYS = {
	MODE: "theme-mode",
	CONTRAST: "theme-contrast",
	THEME: "theme-name",
} as const;

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== "undefined";

/**
 * Theme settings type
 */
type ThemeSettings = {
	mode: ThemeMode;
	contrast: ThemeContrast;
	theme: Theme;
};

/**
 * Cached resource for loading theme settings once
 */
const themeSettingsCache = new Map<string, Promise<ThemeSettings>>();

/**
 * Get theme settings from localStorage (cached)
 */
function getThemeSettings(
	cacheKey: string,
	defaults: ThemeSettings,
): Promise<ThemeSettings> {
	if (!isBrowser) {
		// On server, return defaults immediately
		return Promise.resolve(defaults);
	}

	let promise = themeSettingsCache.get(cacheKey);
	if (!promise) {
		promise = Promise.resolve().then(() => {
			try {
				// Check localStorage
				const storedMode = localStorage.getItem(STORAGE_KEYS.MODE) as
					| ThemeMode
					| null;
				const storedContrast = localStorage.getItem(
					STORAGE_KEYS.CONTRAST,
				) as ThemeContrast | null;
				const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as
					| Theme
					| null;

				// Determine mode: stored > system preference > default
				let mode = defaults.mode;
				if (storedMode && ["light", "dim", "dark"].includes(storedMode)) {
					mode = storedMode;
				} else if (
					window.matchMedia("(prefers-color-scheme: dark)").matches
				) {
					mode = "dark";
				}

				// Determine contrast: stored > system preference > default
				let contrast = defaults.contrast;
				if (storedContrast && ["normal", "high"].includes(storedContrast)) {
					contrast = storedContrast;
				} else if (window.matchMedia("(prefers-contrast: more)").matches) {
					contrast = "high";
				}

				// Determine theme: stored > default
				let theme = defaults.theme;
				if (
					storedTheme &&
					["default", "glassmorphism", "cyberpunk", "neumorphism"].includes(
						storedTheme,
					)
				) {
					theme = storedTheme;
				}

				return { mode, contrast, theme };
			} catch {
				return defaults;
			}
		});
		themeSettingsCache.set(cacheKey, promise);
	}
	return promise;
}

/**
 * Apply theme attributes to document root
 */
const applyThemeToDocument = (
	mode: ThemeMode,
	contrast: ThemeContrast,
	theme: Theme,
) => {
	if (!isBrowser) return;
	document.documentElement.setAttribute("data-mode", mode);
	document.documentElement.setAttribute("data-contrast", contrast);
	document.documentElement.setAttribute("data-theme", theme);
};

/**
 * Load theme CSS dynamically
 */
const loadThemeCSS = async (theme: Theme) => {
	if (!isBrowser) return;

	// Remove any existing theme link
	const existingLink = document.querySelector('link[data-theme-css="true"]');
	if (existingLink) {
		existingLink.remove();
	}

	// Create and append new theme link
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `/src/themes/${theme}.css`;
	link.setAttribute("data-theme-css", "true");
	document.head.appendChild(link);
};

interface ThemeProviderProps {
	children: ReactNode;
	/** Default mode (useful for testing or forced modes) */
	defaultMode?: ThemeMode;
	/** Default contrast */
	defaultContrast?: ThemeContrast;
	/** Default theme */
	defaultTheme?: Theme;
	/** Storage cache key (for testing/multiple instances) */
	cacheKey?: string;
}

/**
 * Theme Provider Component
 *
 * Provides theme context to the entire application.
 * Handles persistence via localStorage and syncs with system preferences.
 * Uses Suspense to prevent flash by blocking render until theme is loaded.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = ({
	children,
	defaultMode = "light",
	defaultContrast = "normal",
	defaultTheme = "default",
	cacheKey = "theme-settings",
}: ThemeProviderProps) => {
	// Wrap in Suspense to block render until theme loads
	return (
		<Suspense fallback={null}>
			<InnerThemeProvider
				defaultMode={defaultMode}
				defaultContrast={defaultContrast}
				defaultTheme={defaultTheme}
				cacheKey={cacheKey}
			>
				{children}
			</InnerThemeProvider>
		</Suspense>
	);
};

/**
 * Inner theme provider that uses React.use() to load settings
 */
function InnerThemeProvider({
	children,
	defaultMode = "light",
	defaultContrast = "normal",
	defaultTheme = "default",
	cacheKey = "theme-settings",
}: ThemeProviderProps) {
	// Load settings via cached promise - Suspense will handle pending state
	const loaded = use(
		getThemeSettings(cacheKey, {
			mode: defaultMode,
			contrast: defaultContrast,
			theme: defaultTheme,
		}),
	);

	const [mode, setModeState] = useState<ThemeMode>(loaded.mode);
	const [contrast, setContrastState] = useState<ThemeContrast>(loaded.contrast);
	const [theme, setThemeState] = useState<Theme>(loaded.theme);

	// Apply theme on mount and when values change
	useEffect(() => {
		if (!isBrowser) return;
		applyThemeToDocument(mode, contrast, theme);
		localStorage.setItem(STORAGE_KEYS.MODE, mode);
		localStorage.setItem(STORAGE_KEYS.CONTRAST, contrast);
		localStorage.setItem(STORAGE_KEYS.THEME, theme);
	}, [mode, contrast, theme]);

	// Load theme CSS when theme changes
	useEffect(() => {
		if (!isBrowser) return;
		loadThemeCSS(theme);
	}, [theme]);

	// Listen for system preference changes
	useEffect(() => {
		if (!isBrowser) return;

		const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const contrastQuery = window.matchMedia("(prefers-contrast: more)");

		const handleDarkModeChange = (e: MediaQueryListEvent) => {
			// Only auto-switch if user hasn't manually set a preference
			if (!localStorage.getItem(STORAGE_KEYS.MODE)) {
				setModeState(e.matches ? "dark" : "light");
			}
		};

		const handleContrastChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem(STORAGE_KEYS.CONTRAST)) {
				setContrastState(e.matches ? "high" : "normal");
			}
		};

		darkModeQuery.addEventListener("change", handleDarkModeChange);
		contrastQuery.addEventListener("change", handleContrastChange);

		return () => {
			darkModeQuery.removeEventListener("change", handleDarkModeChange);
			contrastQuery.removeEventListener("change", handleContrastChange);
		};
	}, []);

	// Memoize setters to prevent unnecessary context changes
	const setMode = useCallback((newMode: ThemeMode) => {
		setModeState(newMode);
	}, []);

	const setContrast = useCallback((newContrast: ThemeContrast) => {
		setContrastState(newContrast);
	}, []);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
	}, []);

	const toggleMode = useCallback(() => {
		setModeState((current) => {
			if (current === "light") return "dim";
			if (current === "dim") return "dark";
			return "light";
		});
	}, []);

	const toggleContrast = useCallback(() => {
		setContrastState((current) => (current === "normal" ? "high" : "normal"));
	}, []);

	// Memoize context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			mode,
			contrast,
			theme,
			setMode,
			setContrast,
			setTheme,
			toggleMode,
			toggleContrast,
		}),
		[mode, contrast, theme, setMode, setContrast, setTheme, toggleMode, toggleContrast],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, setMode, toggleMode } = useTheme();
 *
 *   return (
 *     <button onClick={toggleMode}>
 *       Current mode: {mode}
 *     </button>
 *   );
 * }
 * ```
 */
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

/**
 * Hook to check if current mode is dark or dim
 */
export const useIsDark = () => {
	const { mode } = useTheme();
	return mode === "dark" || mode === "dim";
};

/**
 * Hook to check if high contrast is enabled
 */
export const useIsHighContrast = () => {
	const { contrast } = useTheme();
	return contrast === "high";
};
