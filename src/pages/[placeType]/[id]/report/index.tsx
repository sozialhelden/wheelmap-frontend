import { useRouter } from 'next/router';
import React from 'react';
import { useCurrentApp } from '../../../../lib/context/AppContext';

function Report() {
  // onOpenReportMode = () => {
  //   if (this.props.featureId) {
  //     this.setState({ modalNodeState: 'report' });
  //     trackModalView('report');
  //   }
  // };

  const router = useRouter();
  const { placeType, id } = router.query;
  const app = useCurrentApp();

  return (
    <div>
      <h1>
        Report Index Page: ID:
        {id}
      </h1>
      <h2>
        Report Index Page: Place Type:
        {placeType}
      </h2>
    </div>
  );
}

export default Report;
