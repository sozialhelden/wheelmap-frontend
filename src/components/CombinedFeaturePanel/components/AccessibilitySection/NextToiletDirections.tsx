function NearbyToiletButton() {
  // const { feature, toiletsNearby, onOpenToiletNearby } = this.props;
  //   if (!toiletsNearby) {
  //     return;
  //   }

  //   const featureCoords = normalizedCoordinatesForFeature(feature);
  //   // for now render only the closest toilet
  //   return toiletsNearby.slice(0, 1).map((toiletFeature, i) => {
  //     const toiletCoords = normalizedCoordinatesForFeature(toiletFeature);
  //     const distanceInMeters = geoDistance(featureCoords, toiletCoords);
  //     const formattedDistance = formatDistance(distanceInMeters);
  //     const { distance, unit } = formattedDistance;
  //     const caption = t`Show next wheelchair accessible toilet`;
  //     return (
  //       <button key={i} onClick={() => onOpenToiletNearby(toiletFeature)} className="toilet-nearby">
  //         {caption}
  //         <span className="subtle distance">
  //           &nbsp;{distance}&nbsp;
  //           {unit}&nbsp;→
  //         </span>
  //       </button>
  //     );
  //   });

  return <Callout intent="warning">Nearby toilets go here.</Callout>;
}
