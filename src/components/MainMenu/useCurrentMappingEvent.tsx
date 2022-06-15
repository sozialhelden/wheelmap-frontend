import { MappingEvent } from '../../lib/MappingEvent';

export function useCurrentMappingEvent(): MappingEvent | undefined {
  // TODO: Replace mock implementation;

  return {
    _id: 'thCm5j88sPmF3BZ5g',
    organizationId: 'ZoF23MQmr82zmB87o',
    status: 'completed',
    startTime: '2019-05-06T09:00:00.000Z',
    area: {
      geometry: {
        coordinates: [4.8936041, 52.3727598],
        type: 'Point',
      },
      properties: {
        osm_id: 47811,
        osm_type: 'R',
        extent: [4.7292418, 52.4310638, 5.0791622, 52.2781742],
        country: 'The Netherlands',
        osm_key: 'place',
        osm_value: 'city',
        name: 'Amsterdam',
        state: 'North Holland',
      },
    },
    meetingPoint: {
      geometry: {
        coordinates: [4.898208, 52.3654428],
        type: 'Point',
      },
      properties: {
        osm_id: 1796008490,
        osm_type: 'N',
        country: 'The Netherlands',
        osm_key: 'office',
        housenumber: '597',
        city: 'Amsterdam',
        street: 'Herengracht',
        osm_value: 'it',
        postcode: '1017CE',
        name: 'Booking.com',
        state: 'North Holland',
      },
    },
    appId: 'wheelmap.org',
    name: 'Booking Cares Amsterdam test',
    description: 'this is a test version of the event to try around if everything works correctly.',
    welcomeMessage: "Welcome to the Booking Cares! Let's find accessible places together!",
    statistics: {
      fullParticipantCount: 1,
      invitedParticipantCount: 1,
      draftParticipantCount: 0,
      acceptedParticipantCount: 0,
      mappedPlacesCount: 0,
      attributeChangedCount: 0,
      surveyCompletedCount: 0,
      joinedParticipantCount: 0,
    },
  };
}
