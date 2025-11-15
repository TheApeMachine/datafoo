import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { useLayerWorkspace } from "./context";

interface LayerViewportProps extends ComponentProps<"div"> {
	className?: string;
}

export const LayerWorkspaceViewport = ({
	className,
	...props
}: LayerViewportProps) => {
	const { getActiveLayer } = useLayerWorkspace();
	const active = getActiveLayer();

	if (!active) {
		return (
			<div
				className={className}
				{...props}
			/>
		);
	}

	return (
		<motion.section
			key={active.id}
			className={className}
			initial={false}
			animate={{ opacity: 1 }}
			transition={{ duration: 0 }}
			{...props}
		>
			{active.render()}
		</motion.section>
	);
};


