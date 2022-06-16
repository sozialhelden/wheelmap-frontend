function Search() {
  // if (this.mainView) this.mainView.focusSearchToolbar();

  // onSearchResultClick = (feature: SearchResultFeature, wheelmapFeature: PlaceInfo | null) => {
  //   const params = this.getCurrentParams() as any;
  //   let routeName = 'map';

  //   if (wheelmapFeature) {
  //     let id = getFeatureId(wheelmapFeature);
  //     if (id) {
  //       params.id = id;
  //       delete params.eid;
  //       routeName = 'placeDetail';
  //     }
  //   }

  //   if (routeName === 'map') {
  //     delete params.id;
  //     delete params.eid;
  //   }

  //   if (feature.properties.extent) {
  //     const extent = feature.properties.extent;
  //     this.setState({ lat: null, lon: null, extent });
  //   } else {
  //     const [lon, lat] = feature.geometry.coordinates;
  //     this.setState({ lat, lon, extent: null });
  //   }

  //   this.props.routerHistory.push(routeName, params);
  // };

  return (
    <div>
      <h1>Search goes here!</h1>
    </div>
  );
}

export default Search;
