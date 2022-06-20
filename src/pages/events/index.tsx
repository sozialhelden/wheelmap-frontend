import Link from "next/link";

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

import React from "react";
import Layout from "../../components/App/Layout";
import MappingEventsToolbar from "../../components/MappingEvents/MappingEventsToolbar";

export default () => {
  return (
    <Layout>
      <MappingEventsToolbar />
    </Layout>
  );
};
