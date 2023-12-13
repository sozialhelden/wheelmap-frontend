import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { MockFacility } from "../mocks";
import { StyledLabel, StyledLegend, StyledSearchFilterInputs, StyledSelect, StyledTextInput } from "../styles";
import { FilterContext, FilterContextType } from "./FilterContext";
import { OSM_DATA, fetcher } from "./helpers";

type Props = {
  mockedFacilities: MockFacility[];
};

function FilterInputs({ mockedFacilities }: Props) {
  // const rounter = useRouter();
  //todo params as search query

  const fc: FilterContextType = React.useContext(FilterContext);

  const photonURL = (query: string) => `https://photon.komoot.io/api/?q=${query}&limit=30&lang=de`;
  const [extent, setExtent] = React.useState<[number, number, number, number]>(null);
  const [placeQuery, setPlaceQuery] = React.useState<string>("");
  const [queryData, setQueryData] = React.useState<OSM_DATA>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlaceQuery(e.target.value);

  const { data, error } = useSWR<OSM_DATA, Error>(photonURL(placeQuery), fetcher);

  React.useEffect(() => {
    if (extent) {
      fc.setExtent(extent);
    }
  }, [extent, fc, placeQuery]);

  React.useEffect(() => {
    if (data) {
      setQueryData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (queryData) {
      const [features] = queryData?.features.filter((item) => item.properties.osm_key === "place").filter((item) => item.properties.osm_type === "R");
      features?.properties?.extent && setExtent(features.properties.extent);
    }
  }, [queryData]);

  if (error)
    return (
      <div>{t`Es gab einen Fehler beim Laden der Daten. Refresh & Retry. 
                            Error: ${error.name}
                            ErrorMSG: ${error.message}
                            `}</div>
    );

  console.log(`extent: ${extent}`);

  return (
    <React.Fragment>
      <StyledLegend>{t`Allgemeine Angaben`}</StyledLegend>
      <StyledSearchFilterInputs role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place">{t`Ort`}</StyledLabel>
        <StyledTextInput type="text" name="" id="place" onChange={handleOnChange} />
        <StyledLabel htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</StyledLabel>

        <StyledSelect name="facilities" id="facilities-select">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          {mockedFacilities.map((item, index) => (
            <option key={item.de + (index++).toString()} value={item.de}>
              {item.de}
            </option>
          ))}
        </StyledSelect>

        <StyledLabel htmlFor="insurance-type">{t`Versicherungsart`}</StyledLabel>

        <StyledSelect name="insurance-type" id="insurance-type">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="privat">{t`Private Krankenversicherung`}</option>
          <option value="öffentlich">{t`Öffentliche Krankenversicherung`}</option>
        </StyledSelect>
      </StyledSearchFilterInputs>
    </React.Fragment>
  );
}

export default FilterInputs;
