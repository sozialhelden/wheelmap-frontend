import includes from 'lodash/includes';
import parseQueryParams from './parseQueryParams';
import type { ModalNodeState } from './queryParams';

export type RouteInformation = {
  featureId: ?string,
  category: ?string,
  modalNodeState: ModalNodeState,
  searchQuery: ?string,
  equipmentInfoId: ?string,
};

function getModalNodeState(match: string[]) {
  if (match[1] === 'nodes') {
    for (let mode of ['edit-toilet-accessibility', 'edit-wheelchair-accessibility', 'report']) {
      if (match[3] === mode) {
        return mode;
      }
    }
    if (match[2] === 'new') {
      return 'create';
    }
  }
}

export default function getRouteInformation(props: Props): ?RouteInformation {
  const location = props.location;
  const allowedResourceNames = ['nodes', 'categories', 'search'];
  const match = location.pathname.match(
    /(?:\/beta)?\/?(?:(-?\w+)(?:\/([-\w\d]+)(?:\/([-\w\d]+)(?:\/([-\w\d]+))?)?)?)?/i
  );

  if (!match) {
    return null;
  }

  if (match[1] && !includes(allowedResourceNames, match[1])) {
    return null;
  }

  return {
    featureId: match[1] === 'nodes' && match[2] !== 'new' ? match[2] : null,
    equipmentInfoId: match[1] === 'nodes' && match[3] === 'equipment' ? match[4] : null,
    modalNodeState: getModalNodeState(match),
    category: match[1] === 'categories' ? match[2] : null,
    searchQuery: match[1] === 'search' ? parseQueryParams(location.search).q : null,
    toilet: parseQueryParams(location.search).toilet,
    status: parseQueryParams(location.search).status,
  };
}
