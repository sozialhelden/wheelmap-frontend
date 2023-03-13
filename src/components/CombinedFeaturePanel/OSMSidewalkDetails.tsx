import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";

export default function OSMSidewalkDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  return <section>
    <h2>{t`Sidewalk`}</h2>
    <dl>
      {feature.properties.surface && <> <dt>{t`Surface`}</dt><dd>{feature.properties.surface}</dd></>}
      {feature.properties.lit === 'yes' && <> <dt>{t`The sidewalk is lit.`}</dt></>}
    </dl>
  </section>
}