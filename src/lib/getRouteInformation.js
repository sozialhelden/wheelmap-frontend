import includes from 'lodash/includes';
import parseQueryParams from './parseQueryParams';

export type RouteInformation = {
  featureId: ?string,
  category: ?string,
  isEditMode: boolean,
  searchQuery: ?string,
  equipmentInfoId: ?string,
};

export default function getRouteInformation(props: Props): ?RouteInformation {
  const location = props.location;
  const allowedResourceNames = ['nodes', 'categories', 'search'];
  const match = location.pathname.match(/(?:\/beta)?\/?(?:(-?\w+)(?:\/([-\w\d]+)(?:\/([-\w\d]+)(?:\/([-\w\d]+))?)?)?)?/i);
  if (match) {
    if (match[1] && !includes(allowedResourceNames, match[1])) return null;
    return {
      featureId: (match[1] === 'nodes' && match[2] !== 'new') ? match[2] : null,
      equipmentInfoId: (match[1] === 'nodes' && match[3] === 'equipment') ? match[4] : null,
      category: match[1] === 'categories' ? match[2] : null,
      searchQuery: match[1] === 'search' ? parseQueryParams(location.search).q : null,
      isEditMode: (match[3] === 'edit'),
      isCreateMode: (match[1] === 'nodes' && match[2] === 'new'),
      toilet: parseQueryParams(location.search).toilet,
      status: parseQueryParams(location.search).status,
    };
  }
  return null;
}
