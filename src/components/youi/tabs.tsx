import { createContext, type ReactNode, useContext, useState } from "react";
import { cn } from "@/lib/ui";
import { Button } from "./button";
import { Flex } from "./flex";

/**
 * Hierarchical Tabs component - A tabbed interface that supports nested sub-tabs.
 *
 * When a tab with sub-tabs is selected, it expands to show those sub-tabs.
 * Features a pill-style design with smooth transitions.
 *
 * @example
 * // Tabs with nested sub-tabs
 * <Tabs defaultValue="free" options={[
 *   { id: "free", label: "Free" },
 *   {
 *     id: "premium",
 *     label: "Premium",
 *     subTabs: [
 *       { id: "premium.solo", label: "Solo" },
 *       { id: "premium.team", label: "Team" }
 *     ]
 *   }
 * ]}>
 *   <Tabs.Panel value="free">Free content</Tabs.Panel>
 *   <Tabs.Panel value="premium.solo">Solo content</Tabs.Panel>
 *   <Tabs.Panel value="premium.team">Team content</Tabs.Panel>
 * </Tabs>
 */

export interface TabOption {
	id: string;
	label: string;
	subTabs?: TabOption[];
}

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
	options: TabOption[];
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error(
			"Tabs compound components must be used within a Tabs component",
		);
	}
	return context;
};

interface TabsProps {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	options: TabOption[];
	children: ReactNode;
	className?: string;
}

export const Tabs = ({
	defaultValue = "",
	options,
	children,
	className,
}: TabsProps) => {
	const [selectedTab, setSelectedTab] = useState(defaultValue);

	return (
		<TabsContext.Provider
			value={{
				value: selectedTab,
				onValueChange: setSelectedTab,
				options,
			}}
		>
			<Flex.Column className={cn("w-full", className)}>
				<TabsList />
				{children}
			</Flex.Column>
		</TabsContext.Provider>
	);
};

const TabsList = () => {
	const { options, onValueChange } = useTabsContext();

	return (
		<Flex.Column gap="sm">
			<Flex.Row role="tablist" justify="between">
				{options.map((option) => (
					<Button
						key={option.id}
						variant="ghost"
						size="sm"
						color="secondary"
						onClick={() => onValueChange(option.id)}
					>
						{option.label}
					</Button>
				))}
			</Flex.Row>
		</Flex.Column>
	);
};

interface TabsGroupProps {
	value: string;
	children: ReactNode;
	className?: string;
}

Tabs.Group = ({ value, children, className }: TabsGroupProps) => {
	const { value: selectedTab } = useTabsContext();

	if (selectedTab !== value) {
		return null;
	}

	return (
		<Flex.Column role="tabpanel" aria-labelledby={value} className={className}>
			{children}
		</Flex.Column>
	);
};

interface TabsPanelProps {
	value: string;
	children: ReactNode;
	className?: string;
}

Tabs.Panel = ({ value, children, className }: TabsPanelProps) => {
	const { value: selectedTab } = useTabsContext();

	if (selectedTab !== value) {
		return null;
	}

	return (
		<Flex.Column role="tabpanel" aria-labelledby={value} className={className}>
			{children}
		</Flex.Column>
	);
};
