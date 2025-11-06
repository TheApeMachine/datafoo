import { useEffect, useRef, useState } from "react";

// Types
export interface TreeItem {
	id: string;
	label: string;
	href: string;
	current?: boolean;
	items?: TreeItem[];
}

export interface TreeGroup {
	title: string;
	items: TreeItem[];
}

export interface TreeData {
	label: string;
	groups: TreeGroup[];
}

interface SidebarProps {
	data: TreeData;
	onPinnedChange?: (pinned: boolean) => void;
}

// Sample tree data
export const SAMPLE_TREE_DATA: TreeData = {
	label: "Navigation",
	groups: [
		{
			title: "Base",
			items: [
				{
					id: "intro",
					label: "Introduction",
					href: "#introduction",
					current: true,
				},
				{
					id: "getting-started",
					label: "Getting Started",
					href: "#getting-started",
				},
			],
		},
		{
			title: "Modules",
			items: [
				{
					id: "foundations",
					label: "Foundations",
					href: "#foundations",
					items: [
						{
							id: "overview",
							label: "Overview",
							href: "#overview",
						},
						{
							id: "css-animation",
							label: "CSS Animation",
							href: "#css-animation",
							items: [
								{
									id: "css-animation-anatomy",
									label: "Anatomy",
									href: "#css-animation-anatomy",
								},
								{
									id: "first-keyframe",
									label: "Keyframes",
									href: "#keyframes",
								},
							],
						},
					],
				},
			],
		},
	],
};

// Tree Item Component
interface TreeItemProps {
	item: TreeItem;
	level: number;
	setSize: number;
	posInSet: number;
	onToggle: (id: string) => void;
	onActivate: (id: string) => void;
	expandedItems: Set<string>;
	onKeyDown: (e: React.KeyboardEvent, item: TreeItem) => void;
	searchMatch?: boolean;
	searchRelated?: boolean;
	filtered?: boolean;
}

function TreeItemComponent({
	item,
	level,
	setSize,
	posInSet,
	onToggle,
	onActivate,
	expandedItems,
	onKeyDown,
	searchMatch,
	searchRelated,
	filtered,
}: TreeItemProps) {
	const hasChildren = item.items && item.items.length > 0;
	const isExpanded = expandedItems.has(item.id);
	const itemId = `tree-item-${item.id}`;
	const groupId = hasChildren ? `tree-group-${item.id}` : undefined;

	const handleClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		const isIconClick = target.closest(".tree-icon");

		if (isIconClick && hasChildren) {
			e.preventDefault();
			onToggle(item.id);
		} else if (!isIconClick) {
			onActivate(item.id);
		}
	};

	return (
		<li role="none">
			<a
				id={itemId}
				role="treeitem"
				href={item.href}
				tabIndex={item.current ? 0 : -1}
				aria-level={level}
				aria-setsize={setSize}
				aria-posinset={posInSet}
				aria-current={item.current ? "page" : undefined}
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-owns={groupId}
				onClick={handleClick}
				onKeyDown={(e) => onKeyDown(e, item)}
				data-search-match={searchMatch || undefined}
				data-search-related={searchRelated || undefined}
				data-filtered={filtered || undefined}
				className="inline-flex items-center text-inherit no-underline py-1 pr-2 pl-4 leading-normal w-full gap-2 relative"
			>
				{item.current && (
					<span className="absolute left-0 top-0 bottom-0 w-1 bg-(--tree-focus-color) -translate-x-1/2" />
				)}
				<span className="flex-1">{item.label}</span>
				{hasChildren && (
					<span
						className="tree-icon grid place-items-center w-6 h-6 cursor-pointer rounded"
						aria-hidden="true"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className={`w-4 transition-transform duration-260 ease-out ${
								isExpanded ? "rotate-135" : ""
							}`}
						>
							<title>Toggle expand</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4.5v15m7.5-7.5h-15"
							/>
						</svg>
					</span>
				)}
			</a>
			{hasChildren && (
				<div
					className="grid transition-[grid-template-rows] overflow-hidden"
					style={{
						gridTemplateRows: isExpanded ? "1fr" : "0fr",
						transitionDuration: "var(--duration, 0.18s)",
						transitionTimingFunction: "var(--timing, ease-out)",
					}}
					{...(!isExpanded && { inert: true })}
				>
					{/* biome-ignore lint/a11y/useSemanticElements: role="group" is correct for ARIA tree pattern */}
					<ul
						id={groupId}
						role="group"
						className="min-h-0 relative ml-4 list-none m-0 p-0 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-current before:opacity-35"
						style={{
							opacity: isExpanded ? 1 : "var(--opacity, 0.4)",
							transform: isExpanded
								? "translateY(0)"
								: "translateY(var(--translate, 12px))",
							filter: isExpanded ? "blur(0)" : "blur(var(--blur, 10px))",
							transition:
								"transform var(--duration, 0.18s) var(--timing, ease-out), opacity var(--duration, 0.18s) var(--timing, ease-out), filter var(--duration, 0.18s) var(--timing, ease-out)",
						}}
					>
						{item.items?.map((child, index) => (
							<TreeItemComponent
								key={child.id}
								item={child}
								level={level + 1}
								setSize={item.items?.length ?? 0}
								posInSet={index + 1}
								onToggle={onToggle}
								onActivate={onActivate}
								expandedItems={expandedItems}
								onKeyDown={onKeyDown}
								searchMatch={searchMatch}
								searchRelated={searchRelated}
								filtered={filtered}
							/>
						))}
					</ul>
				</div>
			)}
		</li>
	);
}

// Main Sidebar Component
export function Sidebar({ data, onPinnedChange }: SidebarProps) {
	const [isPinned, setIsPinned] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const [searchTerm, setSearchTerm] = useState("");
	const [searchMatches, setSearchMatches] = useState<Set<string>>(new Set());
	const [searchRelated, setSearchRelated] = useState<Set<string>>(new Set());
	const searchInputRef = useRef<HTMLInputElement>(null);
	const asideRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const safetyTriangleRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	const isOpen = isPinned || isHovering;

	// Notify parent when pinned state changes
	useEffect(() => {
		onPinnedChange?.(isPinned);
	}, [isPinned, onPinnedChange]);

	// Check if mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.matchMedia("(max-width: 768px)").matches);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Handle search
	useEffect(() => {
		if (!searchTerm || searchTerm.length < 3) {
			setSearchMatches(new Set());
			setSearchRelated(new Set());
			return;
		}

		const term = searchTerm.toLowerCase();
		const matches = new Set<string>();
		const related = new Set<string>();

		const searchItems = (items: TreeItem[], ancestors: string[] = []) => {
			for (const item of items) {
				const text = item.label.toLowerCase();
				if (text.includes(term)) {
					matches.add(item.id);
					for (const id of ancestors) {
						related.add(id);
						setExpandedItems((prev) => new Set(prev).add(id));
					}
					if (item.items) {
						const addDescendants = (children: TreeItem[]) => {
							for (const child of children) {
								related.add(child.id);
								if (child.items) addDescendants(child.items);
							}
						};
						addDescendants(item.items);
						setExpandedItems((prev) => new Set(prev).add(item.id));
					}
				}
				if (item.items) {
					searchItems(item.items, [...ancestors, item.id]);
				}
			}
		};

		for (const group of data.groups) {
			searchItems(group.items);
		}
		setSearchMatches(matches);
		setSearchRelated(related);
	}, [searchTerm, data]);

	// Keyboard shortcut for search
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === "/" &&
				document.activeElement?.tagName !== "INPUT" &&
				document.activeElement?.tagName !== "TEXTAREA"
			) {
				e.preventDefault();
				setIsPinned(true);
				setTimeout(() => {
					searchInputRef.current?.focus();
				}, 100);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const toggleExpanded = (id: string) => {
		setExpandedItems((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const activateItem = (id: string) => {
		console.log("Navigate to:", id);
	};

	const handleTreeKeyDown = (e: React.KeyboardEvent, item: TreeItem) => {
		switch (e.key) {
			case "Enter":
			case " ":
				e.preventDefault();
				activateItem(item.id);
				break;
			case "ArrowRight":
				if (item.items && !expandedItems.has(item.id)) {
					e.preventDefault();
					toggleExpanded(item.id);
				}
				break;
			case "ArrowLeft":
				if (item.items && expandedItems.has(item.id)) {
					e.preventDefault();
					toggleExpanded(item.id);
				}
				break;
		}
	};

	return (
		<div className="relative h-full w-full">
			{/* Toggle Button - always visible and above sidebar */}
			<button
				ref={toggleRef}
				type="button"
				onClick={() => setIsPinned(!isPinned)}
				onMouseEnter={() => !isMobile && !isPinned && setIsHovering(true)}
				className="absolute left-full top-0 ml-2 w-11 h-11 grid place-items-center rounded-lg border-0 bg-transparent cursor-pointer outline-(--tree-focus-color) z-1001
					after:content-[''] after:bg-[color-mix(in_hsl,canvas,canvasText_25%)] after:opacity-0 after:absolute after:inset-2 after:pointer-events-none after:rounded-lg after:transition-opacity
					hover:after:opacity-100 focus-visible:after:opacity-100"
				aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-[22px]"
				>
					<title>Sidebar toggle</title>
					<path
						d="M3 8.25V18C3 18.5967 3.23705 19.169 3.65901 19.591C4.08097 20.0129 4.65326 20.25 5.25 20.25H18.75C19.3467 20.25 19.919 20.0129 20.341 19.591C20.7629 19.169 21 18.5967 21 18V8.25M3 8.25V6C3 5.40326 3.23705 4.83097 3.65901 4.40901C4.08097 3.98705 4.65326 3.75 5.25 3.75H18.75C19.3467 3.75 19.919 3.98705 20.341 4.40901C20.7629 4.83097 21 5.40326 21 6V8.25M3 8.25H21M5.25 6H5.258V6.008H5.25V6ZM7.5 6H7.508V6.008H7.5V6ZM9.75 6H9.758V6.008H9.75V6Z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						className={`transition-[transform] origin-[0_50%] duration-(--speed,0.16s) ease-(--timing,ease-out) ${isOpen ? "scale-x-100" : "scale-x-[0.3]"}`}
						d="M4.75 10H11V18.5H5.75C5.19772 18.5 4.75 18.0523 4.75 17.5V10Z"
						fill="currentColor"
					/>
				</svg>
			</button>

			{/* Safety Triangle for hover - only active when not pinned */}
			{!isMobile && !isPinned && (
				<div
					aria-hidden="true"
					ref={safetyTriangleRef}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					className="absolute left-12 top-0 h-11 pointer-events-auto z-998"
					style={{
						width: "calc(var(--sidebar-width, 260px) - 3rem)",
						clipPath: "polygon(0 50%, 0 0, 100% 0, 100% 100%, 0 100%)",
						pointerEvents: isHovering ? "auto" : "none",
					}}
				/>
			)}

			{/* Sidebar */}
			<aside
				ref={asideRef}
				onMouseEnter={() => !isMobile && setIsHovering(true)}
				onMouseLeave={() => !isMobile && setIsHovering(false)}
				className={`bg-primary grid grid-rows-[auto_1fr_auto] text-sm text-(--text) transition-transform ease-(--timing,ease-out)
					${
						isPinned
							? "relative w-full h-full border-0"
							: `fixed left-0 top-(--header-height,60px) min-w-[250px] w-(--sidebar-width,260px) border-2 border-l-0 border-(--border-color) rounded-r-xl
							after:content-[''] after:absolute after:-inset-px after:border-2 after:border-(--border-color) after:border-l-transparent after:rounded-r-xl after:pointer-events-none after:transition-opacity
							${isMobile ? "top-0 h-screen rounded-none border-t-0 border-b-0 after:rounded-none after:border-t-0 after:border-b-0" : "h-[calc(100vh-var(--header-height,60px)-1rem)]"}`
					}
					${isOpen ? "translate-x-0" : "-translate-x-full"}
					${isOpen && !isPinned ? "after:opacity-0" : "after:opacity-100"}`}
				style={{
					transitionDuration: "var(--speed, 0.16s)",
					zIndex: isPinned ? 1 : 1000,
				}}
			>
				{/* Header */}
				<header
					className="p-2 grid gap-2 transition-[padding]"
					style={{ transitionDuration: "var(--speed, 0.16s)" }}
				>
					{isMobile && (
						<>
							<a
								className="absolute top-0 left-0 text-fg-primary grid place-items-center w-10 aspect-square"
								href="/"
								aria-label="Home"
							>
								{/* Logo would go here */}
							</a>
							<button
								type="button"
								onClick={() => setIsPinned(false)}
								className="w-10 aspect-square absolute z-2 top-0 right-0 bg-transparent border-0 cursor-pointer grid place-items-center p-0 rounded-md
									after:content-[''] after:absolute after:inset-1.5 after:rounded-[inherit] after:opacity-0 after:bg-[color-mix(in_hsl,canvas,canvasText_10%)]
									hover:after:opacity-100 focus-visible:after:opacity-100"
								aria-label="Close sidebar"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="w-[22px] rotate-45"
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									/>
								</svg>
							</button>
						</>
					)}

					<button
						type="button"
						className="h-8 rounded-md border-0 cursor-pointer text-fg-secondary bg-tertiary relative outline-(--tree-focus-color)
							after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:bg-[color-mix(in_hsl,canvas,canvasText_10%)]
							hover:text-fg-primary hover:after:opacity-100"
					>
						New Request
					</button>

					<form>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-4 absolute top-1/2 left-2 -translate-y-1/2"
								aria-hidden="true"
							>
								<title>Search icon</title>
								<path
									fillRule="evenodd"
									d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Find"
								aria-label={`Filter navigation tree${searchTerm.length >= 3 ? ` - ${searchMatches.size} items found` : ""} - Press slash to focus`}
								className="w-full leading-8 border border-(--border-color) rounded-md bg-[color-mix(in_srgb,canvas_90%,canvasText_10%)] text-fg-primary pl-7 pr-7
									focus-visible:outline-none focus-visible:border-(--tree-focus-color)
									selection:bg-(--tree-focus-color) selection:text-white"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										setSearchTerm("");
										e.currentTarget.blur();
									}
								}}
							/>
							<kbd className="border border-(--border-color) absolute top-1/2 w-4 h-4 text-[0.625rem] rounded-sm text-fg-primary bg-[color-mix(in_hsl,var(--border-color),transparent)] place-items-center right-2 -translate-y-1/2 hidden md:grid">
								/
							</kbd>
						</div>
					</form>
				</header>

				{/* Navigation Tree */}
				<nav aria-label={data.label} className="overflow-hidden">
					<div className="block h-full overflow-auto">
						<div
							role="tree"
							className="list-none m-0 p-0 grid h-full grid-rows-[auto_1fr]"
							data-filtering={searchTerm.length >= 3 ? "true" : undefined}
						>
							{data.groups.map((group) => (
								<div
									key={group.title}
									role="none"
									className="tree-group-container"
								>
									{/* biome-ignore lint/a11y/useSemanticElements: role="group" is correct for ARIA tree pattern */}
									<ul role="group" className="list-none m-0 p-0">
										{group.items.map((item, index) => (
											<TreeItemComponent
												key={item.id}
												item={item}
												level={1}
												setSize={group.items.length}
												posInSet={index + 1}
												onToggle={toggleExpanded}
												onActivate={activateItem}
												expandedItems={expandedItems}
												onKeyDown={handleTreeKeyDown}
												searchMatch={searchMatches.has(item.id)}
												searchRelated={searchRelated.has(item.id)}
												filtered={
													searchTerm.length >= 3 &&
													!searchMatches.has(item.id) &&
													!searchRelated.has(item.id)
												}
											/>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</nav>

				{/* Footer */}
				<footer className="p-2 grid gap-1 w-full relative mt-2 before:content-[''] before:absolute before:top-0 before:-translate-y-1/2 before:left-2 before:right-2 before:h-0.5 before:opacity-50 before:bg-(--border-color)">
					<button
						type="button"
						className="flex gap-1 items-center h-8 rounded-md bg-transparent border-0 text-(--text) cursor-pointer relative outline-(--tree-focus-color)
							after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[color-mix(in_hsl,canvas,canvasText_10%)] after:opacity-0
							hover:text-fg-primary hover:after:opacity-100 focus-visible:text-fg-primary focus-visible:after:opacity-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-7 h-[22px]"
							aria-hidden="true"
						>
							<title>Feedback icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
						<span>Feedback</span>
					</button>
					<button
						type="button"
						className="flex gap-1 items-center h-8 rounded-md bg-transparent border-0 text-(--text) cursor-pointer relative outline-(--tree-focus-color)
							after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[color-mix(in_hsl,canvas,canvasText_10%)] after:opacity-0
							hover:text-fg-primary hover:after:opacity-100 focus-visible:text-fg-primary focus-visible:after:opacity-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-7 h-6"
							aria-hidden="true"
						>
							<title>Settings icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
							/>
						</svg>
						<span>Settings</span>
					</button>
				</footer>
			</aside>

			{/* Mobile Backdrop */}
			{isMobile && isPinned && (
				<button
					type="button"
					className="fixed inset-0 bg-[color-mix(in_hsl,canvas,canvasText_60%)] animate-[fadeIn_0.16s_ease-out] z-999 border-0 cursor-pointer"
					onClick={() => setIsPinned(false)}
					aria-label="Close sidebar"
				/>
			)}
		</div>
	);
}
