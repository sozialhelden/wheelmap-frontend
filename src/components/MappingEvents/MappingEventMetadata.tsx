import Head from "next/head";
import { useAppContext } from "../../lib/context/AppContext";
import useHostnameContext from "../../lib/context/HostnameContext";
import { useTranslatedStringFromObject } from "../../lib/i18n/useTranslatedStringFromObject";
import { buildFullImageUrl } from "../../lib/model/ac/Image";
import type { MappingEvent } from "../../lib/model/ac/MappingEvent";
import FacebookMeta from "../App/FacebookMeta";
import OpenGraph from "../App/OpenGraph";
import TwitterMeta from "../App/TwitterMeta";

export function MappingEventMetadata({
  mappingEvent,
}: { mappingEvent: MappingEvent }) {
  const { clientSideConfiguration } = useAppContext();
  const productName =
    clientSideConfiguration?.textContent?.product?.name || "Wheelmap";
  const translatedProductName = useTranslatedStringFromObject(productName);

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
  const hostName = useHostnameContext();
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
