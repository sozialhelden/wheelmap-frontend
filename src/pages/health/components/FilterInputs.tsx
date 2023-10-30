import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { MockFacility } from "..";
import { OSM_DATA, fetcher } from "./helpers";

type Props = {
  mockedFacilities: MockFacility[]
}

function FilterInputs ({ mockedFacilities }: Props) {
  // const rounter = useRouter();
  //todo params as search query
  
  const photonURL = (query: string) => `https://photon.komoot.io/api/?q=${query}&limit=30&lang=de`;
  const [extent, setExtent] = React.useState<[number,number,number,number,]>(null);
  const [placeQuery, setPlaceQuery] = React.useState<string>("");
  const [queryData, setQueryData] = React.useState<OSM_DATA>(null); 

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlaceQuery(e.target.value);

  const { data, error } = useSWR<OSM_DATA, Error>(photonURL(placeQuery), fetcher);
  
  React.useEffect(() => {
    if (data) {
      setQueryData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (queryData) {
      const [features] = queryData?.features
      .filter((item) => item.properties.osm_key === "place")
      .filter((item) => item.properties.osm_type === "R");
      features?.properties?.extent && setExtent(features.properties.extent);
    }
  }, [queryData]);
  
  if (error) return <div>{t`Es gab einen Fehler beim Laden der Daten. Refresh & Retry. 
                            Error: ${error.name}
                            ErrorMSG: ${error.message}
                            `}</div>  

  console.log(`extent: ${extent}`);
  
  return (
    <React.Fragment>
      <div id="survey-form-titel" className="survey-form-titel">Allgemeine Angaben</div>
      <div className="search-filter-inputs" role="group" aria-labelledby="survey-form-titel">
        <label htmlFor="place">{t`Ort`}</label>
        <input type="text" name="" id="place" onChange={handleOnChange}/>
        <label htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</label>
        <select name="facilities" id="facilities-select">
            <option value="">{t`--Bitte Option auswählen--`}</option>
            {mockedFacilities.map((item, index) => <option key={item.de+(index++).toString()} value={item.de}>{item.de}</option>)}
        </select>
        <label htmlFor="insurance-type">{t`Versicherungsart`}</label>
        <select name="insurance-type" id="insurance-type">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="privat">{t`Private Krankenversicherung`}</option>
          <option value="öffentlich">{t`Öffentliche Krankenversicherung`}</option>
        </select>      
      </div>
    </React.Fragment>
  );
}

export default FilterInputs;