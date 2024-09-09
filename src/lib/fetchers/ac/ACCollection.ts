export type ACCollection = {
  '@type'?: string;
  kebabName: string;
};

export const acCollections: Record<string, ACCollection> = {
  AccessibilityAttributes: {
    '@type': 'a11yjson:AccessibilityAttribute',
    kebabName: 'accessibility-attributes',
  },
  AppLinks: {
    '@type': 'ac:AppLink',
    kebabName: 'app-links',
  },
  Apps: {
    '@type': 'ac:App',
    kebabName: 'apps',
  },
  Categories: {
    '@type': 'ac:Category',
    kebabName: 'categories',
  },
  Disruptions: {
    '@type': 'a11yjson:Disruption',
    kebabName: 'disruptions',
  },
  EquipmentInfos: {
    '@type': 'a11yjson:EquipmentInfo',
    kebabName: 'equipment-infos',
  },
  EquipmentStatusReports: {
    '@type': 'ac:EquipmentStatusReport',
    kebabName: 'equipment-status-reports',
  },
  EquipmentStatusSamples: {
    '@type': 'ac:EquipmentStatusSample',
    kebabName: 'equipment-status-samples',
  },
  EquipmentSubscriptions: {
    '@type': 'ac:EquipmentSubscription',
    kebabName: 'equipment-subscriptions',
  },
  GlobalStats: {
    '@type': 'ac:GlobalStat',
    kebabName: 'global-stats',
  },
  HardwareSensors: {
    '@type': 'ac:HardwareSensor',
    kebabName: 'hardware-sensors',
  },
  HardwareSensorSamples: {
    '@type': 'ac:HardwareSensorSample',
    kebabName: 'hardware-sensor-samples',
  },
  IOTEvents: {
    '@type': 'ac:IOTEvent',
    kebabName: 'iot-events',
  },
  Images: {
    '@type': 'ac:Image',
    kebabName: 'images',
  },
  ImportFlows: {
    '@type': 'ac:ImportFlow',
    kebabName: 'import-flows',
  },
  Languages: {
    '@type': 'ac:Language',
    kebabName: 'languages',
  },
  Licenses: {
    '@type': 'ac:License',
    kebabName: 'licenses',
  },
  MappingEvents: {
    '@type': 'ac:MappingEvent',
    kebabName: 'mapping-events',
  },
  Organizations: {
    '@type': 'ac:Organization',
    kebabName: 'organizations',
  },
  OntologyDomains: {
    '@type': 'ac:OntologyDomain',
    kebabName: 'ontology-domains',
  },
  PlaceInfos: {
    '@type': 'a11yjson:PlaceInfo',
    kebabName: 'place-infos',
  },
  Products: {
    '@type': 'ac:Product',
    kebabName: 'products',
  },
  ProductVariants: {
    '@type': 'ac:ProductVariant',
    kebabName: 'product-variants',
  },
  RDFBaseQuads: {
    '@type': 'ac:RDFBaseQuad',
    kebabName: 'rdf-base-quads',
  },
  RDFGraphs: {
    '@type': 'ac:RDFGraph',
    kebabName: 'rdf-graphs',
  },
  SourceImports: {
    '@type': 'ac:SourceImport',
    kebabName: 'source-imports',
  },
  Sources: {
    '@type': 'ac:Source',
    kebabName: 'sources',
  },
  SurveyProjects: {
    '@type': 'ac:SurveyProject',
    kebabName: 'survey-projects',
  },
  SurveyFormRevisions: {
    '@type': 'ac:SurveyFormRevision',
    kebabName: 'survey-form-revisions',
  },
  SurveyResults: {
    '@type': 'ac:SurveyResult',
    kebabName: 'survey-results',
  },
  TrackingEvents: {
    '@type': 'ac:TrackingEvent',
    kebabName: 'tracking-events',
  },
};

export type CollectionName = keyof typeof acCollections;
