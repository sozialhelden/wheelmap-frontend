function SearchButtonOrToolbar() {
  newState.isSearchBarVisible = isStickySearchBarSupported()
    && !isAccessibilityFiltered(accessibilityFilter)
    && !isToiletFiltered(toiletFilter)
    && !category
}

onAccessibilityFilterButtonClick = (filter: PlaceFilter) => {
  const { routeName } = this.props
  const params = this.getCurrentParams() as any

  delete params.accessibility
  delete params.toilet

  if (filter.accessibilityFilter.length > 0) {
    params.accessibility = filter.accessibilityFilter.join(',')
  }

  if (filter.toiletFilter.length > 0) {
    params.toilet = filter.toiletFilter.join(',')
  }

  this.props.routerHistory.push(routeName, params)
}
