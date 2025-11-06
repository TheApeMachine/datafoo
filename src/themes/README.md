# Theme System Documentation

## Overview

This project features a sophisticated theme system that separates **modes** from **themes**, with built-in accessibility through high-contrast variants.

### Modes vs Themes

**Modes** control the overall brightness/darkness:
- **Light**: Bright backgrounds, dark text
- **Dim**: Medium tones (between light and dark)
- **Dark**: Dark backgrounds, light text

**Contrast Levels**:
- **Normal**: Standard contrast ratios
- **High**: Enhanced contrast for accessibility (WCAG AAA compliant)

**Themes** control the visual aesthetic:
- **Default**: Clean, modern design
- **Glassmorphism**: Frosted glass effects with soft blurs
- **Cyberpunk**: Neon accents, electric blues and hot pinks
- **Neumorphism**: Soft, tactile depth through shadows

### Total Combinations
3 modes × 2 contrast levels × N themes = 6 variations per theme

## Architecture

### File Structure

```
src/
├── themes/
│   ├── tokens.css           # Token documentation
│   ├── default.css           # Default theme (all 6 variations)
│   ├── glassmorphism.css     # Glassmorphism theme
│   ├── cyberpunk.css         # Cyberpunk theme
│   └── neumorphism.css       # Neumorphism theme
├── integrations/
│   └── theme/
│       └── provider.tsx      # React context for theme management
└── styles.css               # Base styles using tokens
```

### How It Works

1. **CSS Custom Properties (Design Tokens)**: All themes define the same set of CSS variables
2. **Data Attributes**: Mode and contrast are controlled via `data-mode` and `data-contrast` attributes on `<html>`
3. **Dynamic CSS Loading**: Theme CSS files are loaded dynamically based on selection
4. **React Context**: Provides hooks for theme management throughout the app

## Usage

### Basic Setup

The theme provider is already configured in `__root.tsx`:

```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Using Theme Hooks

```tsx
import { useTheme, useIsDark, useIsHighContrast } from '@/integrations/theme/provider';

function MyComponent() {
  const { mode, contrast, theme, setMode, setContrast, setTheme, toggleMode } = useTheme();
  const isDark = useIsDark(); // true if mode is "dark" or "dim"
  const isHighContrast = useIsHighContrast();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Current theme: {theme}</p>

      <button onClick={() => setMode('light')}>Light</button>
      <button onClick={() => setMode('dim')}>Dim</button>
      <button onClick={() => setMode('dark')}>Dark</button>

      <button onClick={() => setTheme('default')}>Default</button>
      <button onClick={() => setTheme('cyberpunk')}>Cyberpunk</button>

      <button onClick={() => setContrast(isHighContrast ? 'normal' : 'high')}>
        Toggle High Contrast
      </button>
    </div>
  );
}
```

### Using Design Tokens in Components

#### In CSS/Inline Styles

```tsx
<div
  style={{
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-fg-primary)',
    border: '1px solid var(--color-border-primary)',
    borderRadius: 'var(--radius-md)',
  }}
>
  Content
</div>
```

#### With Tailwind (when available)

Tailwind utilities still work, but for theme-aware colors, use inline styles or custom CSS classes.

## Design Tokens

### Color Tokens

#### Backgrounds
- `--color-bg-primary`: Main background
- `--color-bg-secondary`: Secondary background (cards, panels)
- `--color-bg-tertiary`: Tertiary background (nested elements)
- `--color-bg-elevated`: Elevated surfaces (modals, dropdowns)
- `--color-bg-inverse`: Inverse background

#### Foreground/Text
- `--color-fg-primary`: Primary text
- `--color-fg-secondary`: Secondary text (less emphasis)
- `--color-fg-tertiary`: Tertiary text (least emphasis)
- `--color-fg-disabled`: Disabled text
- `--color-fg-inverse`: Inverse text
- `--color-fg-on-accent`: Text on accent colors

#### Borders
- `--color-border-primary`: Primary border
- `--color-border-secondary`: Secondary border
- `--color-border-focus`: Focus state
- `--color-border-hover`: Hover state

#### Accents
- `--color-accent-primary`: Main brand color
- `--color-accent-primary-hover`: Hover state
- `--color-accent-primary-active`: Active state
- `--color-accent-secondary`: Secondary accent
- `--color-accent-tertiary`: Tertiary accent

#### Semantic Colors
Each semantic type has four variations:
- `--color-success-*`: Success states (text, bg, border, primary)
- `--color-warning-*`: Warning states
- `--color-error-*`: Error states
- `--color-info-*`: Info states

### Spacing Tokens
- `--space-1` through `--space-24`: Consistent spacing scale

### Typography Tokens
- `--font-sans`, `--font-mono`: Font families
- `--text-xs` through `--text-5xl`: Font sizes
- `--font-normal`, `--font-medium`, `--font-semibold`, `--font-bold`: Font weights
- `--leading-tight`, `--leading-normal`, `--leading-relaxed`: Line heights

### Border & Radius
- `--border-width-1`, `--border-width-2`, `--border-width-4`: Border widths
- `--radius-sm` through `--radius-full`: Border radii

### Shadows
- `--shadow-sm` through `--shadow-xl`: Elevation shadows

### Transitions
- `--transition-fast`, `--transition-base`, `--transition-slow`: Durations
- `--transition-ease`: Easing function

### Z-Index
- `--z-base` through `--z-tooltip`: Stacking order

## Creating a New Theme

1. Create a new CSS file in `src/themes/`, e.g., `my-theme.css`

2. Define all 6 mode/contrast combinations:

```css
/* Light Mode - Normal */
:root[data-theme="my-theme"][data-mode="light"]:not([data-contrast]),
:root[data-theme="my-theme"][data-mode="light"][data-contrast="normal"],
:root[data-theme="my-theme"]:not([data-mode]):not([data-contrast]) {
  --color-bg-primary: /* your color */;
  /* ... all other tokens ... */
}

/* Light Mode - High Contrast */
:root[data-theme="my-theme"][data-mode="light"][data-contrast="high"] {
  /* ... */
}

/* Dim Mode - Normal */
:root[data-theme="my-theme"][data-mode="dim"]:not([data-contrast]),
:root[data-theme="my-theme"][data-mode="dim"][data-contrast="normal"] {
  /* ... */
}

/* Dim Mode - High Contrast */
:root[data-theme="my-theme"][data-mode="dim"][data-contrast="high"] {
  /* ... */
}

/* Dark Mode - Normal */
:root[data-theme="my-theme"][data-mode="dark"]:not([data-contrast]),
:root[data-theme="my-theme"][data-mode="dark"][data-contrast="normal"] {
  /* ... */
}

/* Dark Mode - High Contrast */
:root[data-theme="my-theme"][data-mode="dark"][data-contrast="high"] {
  /* ... */
}
```

3. Add the theme name to the `Theme` type in `src/integrations/theme/provider.tsx`:

```tsx
export type Theme = "default" | "glassmorphism" | "cyberpunk" | "neumorphism" | "my-theme";
```

4. Update the theme validation in `getInitialTheme()` function.

## Accessibility

### High Contrast Mode

High contrast mode increases color contrast ratios to meet WCAG AAA standards. It's automatically applied when:
- User manually enables it via the theme controls
- System preference `prefers-contrast: more` is detected

### System Preferences

The theme system automatically respects:
- `prefers-color-scheme: dark` → Sets initial mode to "dark"
- `prefers-contrast: more` → Sets initial contrast to "high"

Preferences are stored in localStorage and persist across sessions.

## Best Practices

1. **Always use design tokens**: Never hardcode colors, use `var(--token-name)`
2. **Test all 6 variations**: When creating components, verify they look good in all mode/contrast combinations
3. **Semantic over decorative**: Prefer semantic tokens (`--color-error-text`) over base colors
4. **Respect user preferences**: Don't force a specific theme/mode
5. **Maintain consistency**: When adding tokens, ensure they're defined in all themes

## Examples

### Theme Switcher Component

```tsx
export function ThemeSwitcher() {
  const { mode, contrast, theme, setMode, setContrast, setTheme } = useTheme();

  return (
    <div>
      <select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)}>
        <option value="light">Light</option>
        <option value="dim">Dim</option>
        <option value="dark">Dark</option>
      </select>

      <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
        <option value="default">Default</option>
        <option value="glassmorphism">Glassmorphism</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="neumorphism">Neumorphism</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={contrast === 'high'}
          onChange={(e) => setContrast(e.target.checked ? 'high' : 'normal')}
        />
        High Contrast
      </label>
    </div>
  );
}
```

### Button Component with Tokens

```tsx
export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      style={{
        backgroundColor: variant === 'primary'
          ? 'var(--color-accent-primary)'
          : 'var(--color-bg-secondary)',
        color: variant === 'primary'
          ? 'var(--color-fg-on-accent)'
          : 'var(--color-fg-primary)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-6)',
        border: '1px solid var(--color-border-primary)',
        transition: `all var(--transition-fast) var(--transition-ease)`,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Troubleshooting

### Theme not loading
- Check browser console for CSS loading errors
- Verify theme file exists in `src/themes/`
- Ensure theme name matches exactly (case-sensitive)

### Colors not updating
- Check that you're using CSS custom properties, not hardcoded values
- Verify data attributes are set on `<html>` element
- Clear localStorage if preferences seem stuck

### High contrast not working
- Ensure high contrast variations are defined in theme CSS
- Check that contrast level is properly set in React context
- Verify `data-contrast` attribute on `<html>`

