import React, { useMemo } from "react";
import styled from "styled-components";
import type { RenderedFeature } from "~/layouts/DefaultLayout";
import { ListItem } from "~/modules/list/components/ListItem";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";
import { getExternalSources } from "~/modules/map/utils/sources";

const StyledList = styled.ul`
    box-sizing: border-box;
    margin: 0 calc(var(--space-3) * -1) calc(var(--space-3) * -1) calc(var(--space-3) * -1);

    li {
        border-bottom: 2px solid var(--gray-3);
        &:last-child {
            border-bottom: none;
        }
    }
`;

export function List() {
  const { features } = useRenderedFeatures();

  // TODO: sort features by distance from the center of the map
  const renderedFeatures: RenderedFeature[] = useMemo(
    () =>
      features
        // TODO: add pagination and virtualization
        .slice(0, 20)
        .map((feature) => {
          // TODO: this is a workaround to ensure that the feature has an _id and @type in order
          //  to use existing components. ideally, this should be either handled in the backend
          //  or not be necessary at all.
          return {
            ...feature,
            _id: feature.properties?.id,
            "@type":
              feature.layer?.id &&
              getExternalSources(feature.layer.id)?.[0]["@type"],
          };
        }),
    [features],
  );

  return (
    <StyledList>
      {renderedFeatures.map((feature) => (
        <li key={feature._id}>
          <ListItem feature={feature} />
        </li>
      ))}
    </StyledList>
  );
}
