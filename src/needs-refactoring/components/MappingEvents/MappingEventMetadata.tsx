import Head from "next/head";
import useHostname from "~/hooks/useHostname";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import FacebookMeta from "~/needs-refactoring/components/App/FacebookMeta";
import OpenGraph from "~/needs-refactoring/components/App/OpenGraph";
import TwitterMeta from "~/needs-refactoring/components/App/TwitterMeta";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";
import { buildFullImageUrl } from "~/needs-refactoring/lib/model/ac/Image";
import type { MappingEvent } from "~/needs-refactoring/lib/model/ac/MappingEvent";

export function MappingEventMetadata({
  mappingEvent,
}: { mappingEvent: MappingEvent }) {
  const { clientSideConfiguration } = useAppContext();
  const productName =
    clientSideConfiguration?.textContent?.product?.name || "Wheelmap";
  const translatedProductName = useTranslations(productName);

  const pageTitle = translatedProductName
    ? `${mappingEvent.name} - ${translatedProductName}`
    : mappingEvent.name;
  const pageDescription = mappingEvent.description;
  const mappingEventImage = mappingEvent.images?.[0];
  const mappingEventImageUrl =
    mappingEventImage && buildFullImageUrl(mappingEventImage);
  const imageURL = mappingEventImageUrl || "/images/eventPlaceholder.png";
  // 2048x1288 is the dimension of the placeholder image
  const imageWidth = mappingEventImage
    ? mappingEventImage.dimensions.width
    : 2048;
  const imageHeight = mappingEventImage
    ? mappingEventImage.dimensions.height
    : 1288;
  const facebookMetaData = {
    imageURL,
    imageWidth,
    imageHeight,
  };

  const twitterMetaData = {
    imageURL,
  };
  const hostName = useHostname();
  const baseUrl = `https://${hostName}`;
  const ogUrl = `${baseUrl}/events/${mappingEvent._id}`;
  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta content={pageDescription} name="description" key="description" />
      </Head>
      <FacebookMeta facebook={facebookMetaData} />
      <OpenGraph
        productName={translatedProductName}
        title={pageTitle}
        description={pageDescription}
        url={ogUrl}
      />
      <TwitterMeta
        shareHost={baseUrl}
        productName={translatedProductName}
        description={pageDescription}
        twitter={twitterMetaData}
      />
    </>
  );
}
