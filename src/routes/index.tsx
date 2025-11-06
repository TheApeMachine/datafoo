import { createFileRoute } from "@tanstack/react-router";
import { Flex } from "@/components/youi/flex";
import { Page } from "@/components/youi/page";
import { type TabOption, Tabs } from "@/components/youi/tabs";
import { Text } from "@/components/youi/text";

const App = () => {
	const pricingTabs: TabOption[] = [
		{
			id: "free",
			label: "Free",
		},
		{
			id: "premium",
			label: "Premium",
			subTabs: [
				{ id: "premium.solo", label: "Solo" },
				{ id: "premium.team", label: "Team" },
			],
		},
	];

	return (
		<Page>
			<Tabs defaultValue="free" options={pricingTabs}>
				<Tabs.Panel value="free">
					<Flex.Column gap="md" className="p-6 bg-secondary rounded-lg">
						<Text.Heading4>Free Plan</Text.Heading4>
					</Flex.Column>
				</Tabs.Panel>

				<Tabs.Group value="premium">
					<Tabs.Panel value="premium.solo">
						<Flex.Column gap="md" className="p-6 bg-secondary rounded-lg">
							<Text.Heading4>Premium Solo</Text.Heading4>
						</Flex.Column>
					</Tabs.Panel>

					<Tabs.Panel value="premium.team">
						<Flex.Column gap="md" className="p-6 bg-secondary rounded-lg">
							<Text.Heading4>Premium Team</Text.Heading4>
						</Flex.Column>
					</Tabs.Panel>
				</Tabs.Group>
			</Tabs>
		</Page>
	);
};

export const Route = createFileRoute("/")({ component: App });
