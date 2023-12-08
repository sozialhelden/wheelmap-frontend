import * as React from 'react';
import { RouteConsumer } from '../Link/Link';
import AppContext from '../../AppContext';
import env from '../../lib/env';
import { TextPlaceholder } from './TextPlaceholder';
import { EquipmentInfo } from '../../lib/EquipmentInfo';
import StyledEquipmentItem from './Equipment/EquipmentItem';

export default function EquipmentInfoLink({ _id }: { _id: string | null; }) {

  const [equipmentInfo, setEquipmentInfo] = React.useState<EquipmentInfo | null>(null);
  const appContext = React.useContext(AppContext);
  const appToken = appContext.app.tokenString;

  React.useEffect(() => {
    if (!_id) return;
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL;
    fetch(`${baseUrl}/equipment-infos/${_id}.json?appToken=${appToken}`)
      .then(response => response.json())
      .then(setEquipmentInfo);
  }, [_id, appToken]);
  return <RouteConsumer>
    {context => {
      let params = { ...context.params, id: equipmentInfo?.properties?.placeInfoId, eid: _id };
      
      const handleSelected = (placeInfoId: string, equipmentInfo: EquipmentInfo) => {
        context.history.push('equipment', params);  
      };

      if(!equipmentInfo) {return <TextPlaceholder>EG, UG</TextPlaceholder>}
      return (
        <StyledEquipmentItem 
          equipmentInfos={[equipmentInfo]}
          
          placeInfoId={equipmentInfo.properties.placeInfoId}
          onSelected={handleSelected}
        />
      );
    }}
  </RouteConsumer>;
}
