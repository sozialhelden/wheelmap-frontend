type StreamParams = { inputMimeType: string; [key: string]: any };
type StreamDefinition = {
  parameters: StreamParams;
  type: string;
  [key: string]: any;
};

export type TrackingEventStatistics = {
  statistics: {
    attributeChangedCount: number;
    surveyCompletedCount: number;
    joinedParticipantCount: number;
  };
};

type ISource = {
  _id?: string;
  organizationId: string;
  name: string;
  shortName: string;
  licenseId: string;
  description?: string;
  originWebsiteURL?: string;
  'translations.additionalAccessibilityInformation.en_US'?: string;
  isDraft?: boolean;
  streamChain: StreamDefinition[];
  isFreelyAccessible: boolean;
  accessRestrictedTo: string[];
  hasRunningImport?: boolean;
  documentCount: number;
  isShownOnStartPage?: boolean;
  lastImportId?: string;
  lastSuccessfulImportId?: string;
  lastImportType?: 'placeInfos' | 'equipmentInfos' | 'disruptions' | 'images';
  usesCustomAccessibilityTrafficLightSystem?: boolean;
  attributeDistribution?: string;
  canonicalOSMRefTag?: string;
  allowedImportStreamUnits?: string[];
} & TrackingEventStatistics;

export default ISource;
