import Head from "next/head";
import FacebookMeta from "../App/FacebookMeta";
import OpenGraph from "../App/OpenGraph";
import TwitterMeta from "../App/TwitterMeta";
import { useCurrentApp } from "../../lib/context/AppContext";
import useHostname from "../../lib/context/HostnameContext";
import { translatedStringFromObject } from "../../lib/i18n/translatedStringFromObject";
import { buildFullImageUrl } from "../../lib/model/ac/Image";
import { MappingEvent } from "../../lib/model/ac/MappingEvent";

export function MappingEventMetadata({ mappingEvent }: { mappingEvent: MappingEvent; }) {
  const { clientSideConfiguration } = useCurrentApp();
  const productName = clientSideConfiguration?.textContent?.product?.name || 'Wheelmap';
  const translatedProductName = translatedStringFromObject(productName);

  const pageTitle = translatedProductName
    ? `${mappingEvent.name} - ${translatedProductName}`
    : mappingEvent.name;
  const pageDescription = mappingEvent.description;
  const mappingEventImage = mappingEvent.images && mappingEvent.images[0];
  const mappingEventImageUrl = mappingEventImage && buildFullImageUrl(mappingEventImage);
  const imageURL = mappingEventImageUrl || `/images/eventPlaceholder.png`;
  // 2048x1288 is the dimension of the placeholder image
  const imageWidth = mappingEventImage ? mappingEventImage.dimensions.width : 2048;
  const imageHeight = mappingEventImage ? mappingEventImage.dimensions.height : 1288;
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
  return <>
    <Head>
      <title key="title">{pageTitle}</title>
      <meta
        content={pageDescription}
        name="description"
        key="description"
      />
    </Head>
    <FacebookMeta facebook={facebookMetaData} />
    <OpenGraph
      productName={translatedProductName}
      title={pageTitle}
      description={pageDescription}
      url={ogUrl} />
    <TwitterMeta
      shareHost={baseUrl}
      productName={translatedProductName}
      description={pageDescription}
      twitter={twitterMetaData} />
  </>;
}
