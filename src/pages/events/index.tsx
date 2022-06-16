import Link from 'next/link';

// showSelectedMappingEvent = (eventId: string) => {
//   const event =
//     this.state.mappingEvents && this.state.mappingEvents.find(event => event._id === eventId);
//   const extent = event && event.area && event.area.properties.extent;

//   if (extent) {
//     this.setState({ extent });
//   }

//   const params = this.getCurrentParams() as any;
//   params.id = eventId;
//   this.props.routerHistory.push('mappingEventDetail', params);
// };

// setupMappingEvents() {
//   const mappingEvents = filterMappingEvents(
//     this.props.mappingEvents,
//     this.props.app._id,
//     this.props.mappingEvent && this.props.mappingEvent._id
//   );
//   this.setState({ mappingEvents });
//   this.initializeJoinedMappingEvent();
// }

// initializeJoinedMappingEvent() {
//   const {
//     mappingEvents,
//     routeName,
//     router: { query },
//   } = this.props;

//   let joinedMappingEventId = readStoredJoinedMappingEventId();
//   const joinedMappingEvent = joinedMappingEventId
//     ? mappingEvents.find(event => event._id === joinedMappingEventId)
//     : null;
//   const state = {
//     joinedMappingEvent,
//     joinedMappingEventId,
//     isMappingEventWelcomeDialogVisible: false,
//   };

//   if (routeName === 'mappingEventJoin') {
//     const mappingEventIdToJoin = query.id;
//     const mappingEventToJoin = mappingEvents.find(event => event._id === mappingEventIdToJoin);
//     if (mappingEventToJoin && canMappingEventBeJoined(mappingEventToJoin)) {
//       state.isMappingEventWelcomeDialogVisible = true;
//     }
//   }

//   // invalidate already locally stored mapping event if it already expired
//   if (!joinedMappingEvent || !canMappingEventBeJoined(joinedMappingEvent)) {
//     joinedMappingEventId = null;
//     storeJoinedMappingEventId(joinedMappingEventId);
//     setJoinedMappingEventData();
//   }

//   this.setState(state);
// }

// trackMappingEventMembershipChanged = (
//   reason: 'url' | 'button',
//   joinedMappingEventId?: string,
//   emailAddress?: string
// ) => {
//   storeJoinedMappingEventId(joinedMappingEventId);
//   const search: string = window.location.search;

//   if (joinedMappingEventId) {
//     const token = this.props.router.query.token;
//     const invitationToken = Array.isArray(token) ? token[0] : token;
//     setJoinedMappingEventData(emailAddress, invitationToken);

//     trackingEventBackend.track(this.props.app, {
//       invitationToken,
//       emailAddress,
//       type: 'MappingEventJoined',
//       joinedMappingEventId: joinedMappingEventId,
//       joinedVia: reason,
//       query: queryString.parse(search),
//     });
//     trackEvent({
//       category: 'MappingEvent',
//       action: 'Joined',
//       label: joinedMappingEventId,
//     });
//   }
// };

// onMappingEventLeave = () => {
//   this.trackMappingEventMembershipChanged('button');
//   this.setState({ joinedMappingEventId: null });
// };

// onMappingEventJoin = (joinedMappingEventId: string, emailAddress?: string) => {
//   this.trackMappingEventMembershipChanged('button', joinedMappingEventId, emailAddress);
//   this.setState({
//     joinedMappingEventId,
//   });
//   const params = this.getCurrentParams();
//   this.props.routerHistory.replace('mappingEventDetail', params);
// };

// onMappingEventWelcomeDialogOpen = () => {
//   const params = this.getCurrentParams();
//   this.props.routerHistory.replace('mappingEventJoin', params);
// };

// onMappingEventWelcomeDialogClose = () => {
//   const params = this.getCurrentParams();
//   this.props.routerHistory.replace('mappingEventDetail', params);
// };

const Events = () => {
  // const { mappingEvents, onCloseMappingEventsToolbar, onMappingEventClick, app } = this.props;
  //   return (
  //     <MappingEventsToolbar
  //       app={app}
  //       mappingEvents={mappingEvents}
  //       onClose={onCloseMappingEventsToolbar}
  //       onMappingEventClick={onMappingEventClick}
  //       minimalTopPosition={this.getMinimalToolbarTopPosition()}
  //     />
  //   );
  return (
    <>
      <header />
      <h1>All Events</h1>
      <ul>
        <li>
          <Link href="/events/1" as={`/events/1/`}>
            <a>#1</a>
          </Link>
        </li>
        <li>
          <Link href="/events/2" as={`/events/2/`}>
            <a>#2</a>
          </Link>
        </li>
        <li>
          <Link href="/events/3" as={`/events/3/`}>
            <a>#3</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Events;
