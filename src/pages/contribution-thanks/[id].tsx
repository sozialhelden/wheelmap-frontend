import { useRouter } from 'next/router'

function Contribs() {
  const router = useRouter()
  const { id } = router.query

  // TODO: trackModalView('contribution-thanks');

  // <FocusTrap active={this.props.modalNodeState === 'contribution-thanks'}>
  //   <ContributionThanksDialog
  //     hidden={this.props.modalNodeState !== 'contribution-thanks'}
  //     onClose={this.props.onCloseModalDialog}
  //     featureId={this.props.featureId as string}
  //     onSelectFeature={id => {
  //       this.props.onCloseModalDialog();
  //       this.props.onMarkerClick(id);
  //     }}
  //   />
  // </FocusTrap>

  return (
    <>
      <header />
      <h1>
        Contrib:
        {id}
      </h1>
    </>
  )
}

export default Contribs
