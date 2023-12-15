import { LocalizedString, translatedStringFromObject } from './i18n';
import { LinkData } from '../App';
import { IBranding } from './IBranding';
import { Point, Polygon } from 'geojson';

export interface TwitterConfiguration {
  siteHandle?: string;
  creatorHandle?: string;
  imageURL?: string;
}

export interface FacebookConfiguration {
  appId?: string;
  admins?: string;
  imageURL?: string;
}

export interface LinkDescription {
  label?: LocalizedString;
  url?: LocalizedString;
  order?: number;
  type?: string;
  tags?: string[];
}

export interface EmbedToken {
  token: string;
  expiresOn: string;
}

export interface ClientSideConfiguration {
  branding?: IBranding;
  allowedBaseUrls?: Array<string>;
  embedTokens?: EmbedToken[];
  includeSourceIds?: Array<string>;
  excludeSourceIds?: Array<string>;
  disableWheelmapSource?: boolean;
  disableGrayPlacesFilter?: boolean;
  associatedGeometries?: {
    centerPoint?: Point;
    regionPolygon?: Polygon;
    usesCenterPointAsSearchBias?: boolean;
  };
  textContent?: {
    onboarding?: {
      headerMarkdown?: LocalizedString;
    };
    product?: {
      name?: LocalizedString;
      claim?: LocalizedString;
      description?: LocalizedString;
    };
    accessibilityNames?: {
      long?: {
        unknown?: LocalizedString;
        yes?: LocalizedString;
        limited?: LocalizedString;
        no?: LocalizedString;
      };
      short?: {
        unknown?: LocalizedString;
        yes?: LocalizedString;
        limited?: LocalizedString;
        no?: LocalizedString;
      };
    };
    filterNames?: {
      partiallyAccessiblePlaces?: LocalizedString;
      partiallyAccessiblePlacesWithAccessibleWC?: LocalizedString;
      onlyFullyAccessiblePlaces?: LocalizedString;
      onlyFullyAccessiblePlacesWithAccessibleWC?: LocalizedString;
      placesWithMissingAccessibilityInfo?: LocalizedString;
      inaccessiblePlaces?: LocalizedString;
    };
  };
  meta: {
    twitter?: TwitterConfiguration;
    facebook?: FacebookConfiguration;
  };
  customMainMenuLinks?: LinkData[];
  addPlaceURL?: string;
}

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title?: string
): string {
  const { product } = clientSideConfiguration.textContent || {
    product: {
      name: 'Wheelmap',
      claim: 'Find wheelchair accessible places',
    },
  };
  const { name, claim } = product;

  if (!title) {
    return `${translatedStringFromObject(name)} – ${translatedStringFromObject(claim)}`;
  }

  return `${title} – ${translatedStringFromObject(name)}`;
}
