export type BaseTrackingEvent = {
  geometry?: {
    type: 'Point';
    coordinates: number[];
  };
  longitude?: number;
  latitude?: number;
};

export type AttributeChangedTrackingEvent = BaseTrackingEvent & {
  type: 'AttributeChanged';
  attributePath: string;
  previousValue?: any;
  newValue: any;
  category: string;
  parentCategory?: string;
  placeInfoId?: string | number;
  organizationId?: string;
  appId?: string;
};

export type SurveyCompletedTrackingEvent = BaseTrackingEvent & {
  type: 'SurveyCompleted';
  uniqueSurveyId: string;
};

export type AppOpenedTrackingEvent = BaseTrackingEvent & {
  type: 'AppOpened';
  query: Query;
};

export type MappingEventJoinedTrackingEvent = BaseTrackingEvent & {
  type: 'MappingEventJoined';
  joinedMappingEventId: string;
  joinedVia: 'url' | 'button';
  query: Query;
  emailAddress?: string | null;
  invitationToken?: string | null;
};

export type MappingEventLeftTrackingEvent = BaseTrackingEvent & {
  type: 'MappingEventLeft';
  leftMappingEventId: string;
  query: Query;
  emailAddress?: string | null;
  invitationToken?: string | null;
};

export type TrackingEvent =
  | AttributeChangedTrackingEvent
  | SurveyCompletedTrackingEvent
  | AppOpenedTrackingEvent
  | MappingEventJoinedTrackingEvent
  | MappingEventLeftTrackingEvent;
