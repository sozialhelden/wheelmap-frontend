import { useRouter } from 'next/router';

const EventWelcome = () => {
  const router = useRouter();
  const { id } = router.query;

  //   <MappingEventWelcomeDialog
  //   mappingEvent={mappingEvent}
  //   onJoin={onMappingEventJoin}
  //   onClose={onMappingEventWelcomeDialogClose}
  //   invitationToken={invitationToken}
  // />

  return (
    <>
      <header />
      <h1>Welcome at Event #: {id}</h1>
    </>
  );
};

export default EventWelcome;
