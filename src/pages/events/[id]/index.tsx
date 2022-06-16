import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  // <MappingEventToolbar
  //       mappingEventHandlers={mappingEventHandlers}
  //       mappingEvent={mappingEvent}
  //       joinedMappingEventId={joinedMappingEventId}
  //       onMappingEventWelcomeDialogOpen={onMappingEventWelcomeDialogOpen}
  //       onMappingEventLeave={onMappingEventLeave}
  //       onClose={onCloseMappingEventsToolbar}
  //       onHeaderClick={this.onMappingEventHeaderClick}
  //       minimalTopPosition={this.getMinimalToolbarTopPosition()}
  //     />
  return (
    <>
      <header />
      <h1>Event with ID: {id}</h1>
    </>
  );
};

export default Event;
