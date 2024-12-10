import { omit } from "lodash";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";
import { Button, Code, Popover, Text } from "@radix-ui/themes";

export default function FeaturesDebugJSON(props: { features: AnyFeature[] }) {
	return (
		<Popover.Root>
			<Popover.Trigger>
				<Button variant="soft" highContrast>Show JSON</Button>
			</Popover.Trigger>
			<Popover.Content size="1" maxWidth="300px">
				<Text asChild={true} size="1">
          <pre>
					{JSON.stringify(
						props.features.map((f) =>
							omit(f, "geometry.coordinates", "centroid", "type"),
						),
						null,
						2,
					)}
          </pre>
				</Text>
				<Popover.Close>
					<Button size="1">Close</Button>
				</Popover.Close>
			</Popover.Content>
		</Popover.Root>
	);
}
