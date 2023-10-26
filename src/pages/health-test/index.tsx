import React, { ReactElement } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { t } from "ttag";
import LayoutHealthPage from "../../components/App/LayoutHealthPage";
import PreferencesFilter from "./components/PreferencesFilter";

/*
  A11y Design considerations
  - https://www.w3.org/WAI/tutorials/forms/
  - https://www.w3.org/WAI/tutorials/forms/labels/
  - https://www.w3.org/WAI/tutorials/forms/grouping/
  - https://www.w3.org/WAI/tutorials/forms/controls/
  - https://www.w3.org/WAI/tutorials/forms/notifications/
  - https://www.w3.org/WAI/tutorials/forms/inputs/
  - https://www.w3.org/WAI/tutorials/forms/inputs/select/
  ...
  --- 

  pagination? 

*/

const StyledPage = styled.div`
  
  /* header bar */
  height: calc(100vh - 50px); //margin-top: 50px 
  
  overflow-y: scroll;

  .layout {
    display: flex;
    flex-direction: column;
  }

  div {
    border: 1px solid red;
  }

  /** 
   * breakpoint for wrap based on WCAG reflow test with desired pixel width at 400% zoomfaktor by 1280*1024 vp.
   * This width is 320px vp plus 7px on both sides for bars, i.e.: space on mobile or scrollbars. 
   * 334px is the min-width of the input cards, they will stack as soon as the viewport is smaller than two times 334px.
   * The cards will not be smaller than 334px, the viewport as well. This is the smallest WCAG-compliant viewport width value 
   * that has to be supported by any application. 
  */
  .top-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
  }

  .stack {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .stack > * {
    margin-block: 0;
  } 
  
  .stack > * + * {
    margin-block-start: var(--space, 1.2rem);
  }

`;

const renderMockedJSONSearchResults = (data) => {
  return (
    <React.Fragment>
      <h2>Search Results</h2>
      <ul>{data.map((item: any) => <li key={item._id}>{JSON.stringify(item)}</li>)}</ul>
    </React.Fragment>
  )
}

const renderMockedDetailedSearchResults = (data: MockData[]) => {
  return (
      <ul className="search-results-list">
        {data.map((item: MockData) => {
          const name = typeof item.properties.name === 'string' ? item.properties.name : item.properties.name?.en ?? "Praxis Dr. Linker Platzhalter";
          const { street, city, house, postalCode, text } = item.properties.address || {};
          const description = item.properties.description?.en ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
          return (
            <li key={item._id}>
              <div className="search-result">
                <h3 className="search-result-heading">{name}</h3>
                <p className="search-result-address">{text ? text : "Keine Adresse"}</p>
                <p className="search-result-description">{ description ? description : t`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</p>
              </div>
            </li>
          );
        })}
      </ul>
  );

}

const renderSurveyForm = () => {
  // Todo: Custom Select for large select menu
  return (
    <React.Fragment>
      <div id="survey-form-titel" className="survey-form-titel">Allgemeine Angaben</div>
        <div className="search-filter-inputs" role="group" aria-labelledby="survey-form-titel">
          <label htmlFor="place">{t`Ort`}</label>
          <input type="text" name="" id="place" />
          <label htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</label>
          <select name="facilities" id="facilities-select">
              <option value="">{t`--Bitte Option auswählen--`}</option>
              {mockedHealthcareFacilities.map((item, index) => <option key={item.de+(index++).toString()} value={item.de}>{item.de}</option>)}
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

export default function Page() {  

  const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR('/api/staticdata', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const mockedData: MockData[] = JSON.parse(data);

  return (
    <StyledPage>
      <div className="layout">
        <div className="top">Praxissuche
          <div className="top-grid">
            <div className="left">
              <div id="survey-form-titel" className="survey-form-titel">Allgemeine Angaben</div>
                <div className="stack" role="group" aria-labelledby="survey-form-titel">
                  <label htmlFor="place">{t`Ort`}</label>
                  <input type="text" name="" id="place" />
                  <label htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</label>
                  <select name="facilities" id="facilities-select">
                    <option value="">{t`--Bitte Option auswählen--`}</option>
                    {mockedHealthcareFacilities.map((item, index) => <option key={item.de+(index++).toString()} value={item.de}>{item.de}</option>)}
                  </select>
                  <label htmlFor="insurance-type">{t`Versicherungsart`}</label>
                  <select name="insurance-type" id="insurance-type">
                    <option value="">{t`--Bitte Option auswählen--`}</option>
                    <option value="privat">{t`Private Krankenversicherung`}</option>
                    <option value="öffentlich">{t`Öffentliche Krankenversicherung`}</option>
                  </select>      
              </div>
            </div>
            <div className="right">
              <PreferencesFilter />
            </div>
          </div>
        </div>
        <div className="bottom">Ergebnisse</div>
      </div>

    </StyledPage>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};


// Mocked Data  
export type localizedName = {
  de?: string;
  en?: string;
}

export type MockData = {
  _id: string;
  properties: {
    originalId: string;
    infoPageUrl?: string;
    placeWebsiteUrl?: string;
    sourceId?: string;
    sourceImportId?: string;
    sourceName?: string;
    organizationName?: string;
    hasAccessibility?: boolean;
    phoneNumber?: string;
    description?: {
      en?: string;
      de?: string;
    };
    name?: localizedName | string;
    address?: {
      street?: string | null;
      city?: string | null;
      house?: string | null;
      postalCode?: string | null;
      text?: string | null;
    };
    category: string;
    accessibility?: {
      accessibleWith?: {
        wheelchair: boolean;
      };
      partiallyAccessibleWith?: {
        wheelchair: boolean;
      };
      areas?: any
      entrance?: {
        wheelchair: boolean;
      };
    };
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

const mockedHealthcareFacilities: MockFacility[] =[
  {
    "en": "alternative",
    "de": "Alternativmedizin"
  },
  {
    "en": "audiologist",
    "de": "Hörakustik"
  },
  {
    "en": "birthing_centre",
    "de": "Geburtshaus"
  },
  {
    "en": "blood_bank",
    "de": "Blutbank"
  },
  {
    "en": "blood_donation",
    "de": "Blut- / Plasma-/ Zellspende"
  },
  {
    "en": "counselling",
    "de": "Gesundheitsberatung"
  },
  {
    "en": "dialysis",
    "de": "Dialyse"
  },
  {
    "en": "hospice",
    "de": "Hospiz (Palliativmedizin)"
  },
  {
    "en": "laboratory",
    "de": "Labor"
  },
  {
    "en": "midwife",
    "de": "Hebamme(n)"
  },
  {
    "en": "nurse",
    "de": "Gesundheits- und Krankenpflege"
  },
  {
    "en": "occupational_therapist",
    "de": "Ergotherapie"
  },
  {
    "en": "optometrist",
    "de": "Optik"
  },
  {
    "en": "physiotherapist",
    "de": "Physiotherapie"
  },
  {
    "en": "podiatrist",
    "de": "Podologie"
  },
  {
    "en": "psychotherapist",
    "de": "Psychotherapie"
  },
  {
    "en": "rehabilitation",
    "de": "Rehabilitation"
  },
  {
    "en": "sample_collection",
    "de": "Probenentnahme"
  },
  {
    "en": "speech_therapist",
    "de": "Logopädie"
  },
  {
    "en": "vaccination_centre",
    "de": "Impfstelle"
  },
  {
    "en": "centre",
    "de": "Gesundheitszentrum (nichtnäher spezifiziert)"
  },
  {
    "en": "allergology",
    "de": "Allergologie"
  },
  {
    "en": "anaesthetics",
    "de": "Anästhesie"
  },
  {
    "en": "cardiology",
    "de": "Kardiologie"
  },
  {
    "en": "cardiothoracic_surgery",
    "de": "Herz- und Thoraxchirurgie"
  },
  {
    "en": "child_psychiatry",
    "de": "Kinder- und Jugendpsychiatrie"
  },
  {
    "en": "community",
    "de": "Medizin im öffentlichen Gesundheitswesen"
  },
  {
    "en": "dermatology",
    "de": "Dermatologie"
  },
  {
    "en": "dermatovenereology",
    "de": "Dermatologie und Venerologie"
  },
  {
    "en": "diagnostic_radiology",
    "de": "Klinische Radiologie"
  },
  {
    "en": "emergency",
    "de": "Unfall- und Notfallmedizin"
  },
  {
    "en": "endocrinology",
    "de": "Endokrinologie und Diabetologie"
  },
  {
    "en": "gastroenterology",
    "de": "Gastroenterologie"
  },
  {
    "en": "general",
    "de": "Allgemein"
  },
  {
    "en": "geriatrics",
    "de": "Geriatrie"
  },
  {
    "en": "gynaecology",
    "de": "Geburtshilfe und Gynäkologie"
  },
  {
    "en": "haematology",
    "de": "Hämatologie"
  },
  {
    "en": "hepatology",
    "de": "Hepatologie"
  },
  {
    "en": "infectious_diseases",
    "de": "Infektiöse Krankheiten"
  },
  {
    "en": "intensive",
    "de": "Intensive Pflege"
  },
  {
    "en": "internal",
    "de": "Allgemeine (innere) Medizin"
  },
  {
    "en": "dental_oral_maxillo_facial_surgery",
    "de": "Mund-, Kiefer- und Gesichtschirurgie"
  },
  {
    "en": "neonatology",
    "de": "Pädiatrische Abteilung für Neugeborene"
  },
  {
    "en": "nephrology",
    "de": "Nierenheilkunde"
  },
  {
    "en": "neurology",
    "de": "Neurologie"
  },
  {
    "en": "neuropsychiatry",
    "de": "Neuropsychiatrie"
  },
  {
    "en": "neurosurgery",
    "de": "Neurochirurgie"
  },
  {
    "en": "nuclear",
    "de": "Nuklearmedizin"
  },
  {
    "en": "occupational",
    "de": "Arbeitsmedizin"
  },
  {
    "en": "oncology",
    "de": "Onkologie"
  },
  {
    "en": "ophthalmology",
    "de": "Ophthalmologie"
  },
  {
    "en": "orthodontics",
    "de": "Kieferorthopädie"
  },
  {
    "en": "orthopaedics",
    "de": "Orthopädie"
  },
  {
    "en": "otolaryngology",
    "de": "Hals-Nasen-Ohren-Heilkunde"
  },
  {
    "en": "paediatric_surgery",
    "de": "Pädiatrische Chirurgie"
  },
  {
    "en": "paediatrics",
    "de": "Pädiatrie"
  },
  {
    "en": "palliative",
    "de": "Palliativmedizin (Hospiz)"
  },
  {
    "en": "pathology",
    "de": "Pathologie"
  },
  {
    "en": "physiatry",
    "de": "Physikalische Medizin und Rehabilitation (Sportmedizin)"
  },
  {
    "en": "plastic_surgery",
    "de": "Plastische Chirurgie"
  },
  {
    "en": "podiatry",
    "de": "Podologie"
  },
  {
    "en": "proctology",
    "de": "Proktologie"
  },
  {
    "en": "psychiatry",
    "de": "Allgemeine Psychiatrie"
  },
  {
    "en": "pulmonology",
    "de": "Medizin der Atemwege"
  },
  {
    "en": "radiology",
    "de": "Radiologie"
  },
  {
    "en": "radiotherapy",
    "de": "Strahlentherapie"
  },
  {
    "en": "rheumatology",
    "de": "Rheumatologie"
  },
  {
    "en": "stomatology",
    "de": "Stomatologie"
  },
  {
    "en": "surgery",
    "de": "Allgemeine Chirurgie"
  },
  {
    "en": "transplant",
    "de": "Transplantationschirurgie"
  },
  {
    "en": "trauma",
    "de": "Unfallchirurgie"
  },
  {
    "en": "tropical",
    "de": "Tropenmedizin"
  },
  {
    "en": "urology",
    "de": "Urologie"
  },
  {
    "en": "vascular_surgery",
    "de": "Gefäßchirurgie"
  },
  {
    "en": "venereology",
    "de": "Venerologie"
  },
  {
    "en": "abortion",
    "de": "Schwangerschaftsabbruch"
  },
  {
    "en": "fertility",
    "de": "Fruchtbarkeit"
  },
  {
    "en": "vaccination",
    "de": "Impfungen"
  },
  {
    "en": "behavior",
    "de": "Verhaltenstherapeutische Psychotherapie"
  },
  {
    "en": "body",
    "de": "Körperorientierte Psychotherapie"
  },
  {
    "en": "depth",
    "de": "Tiefenpsychologie / Psychoanalyse"
  },
  {
    "en": "humanistic",
    "de": "Therapie auf der Grundlage der humanistischen Psychologie"
  },
  {
    "en": "other",
    "de": "Anderes (z.B. Kunsttherapie)"
  },
  {
    "en": "systemic",
    "de": "Systemische Therapie"
  },
  {
    "en": "biology",
    "de": "Biologie (unspezifisch)"
  },
  {
    "en": "biochemistry",
    "de": "Biochemie"
  },
  {
    "en": "blood_check",
    "de": "Blutuntersuchung"
  },
  {
    "en": "clinical_pathology",
    "de": "Klinische Pathologie"
  },
  {
    "en": "addiction",
    "de": "Sucht"
  },
  {
    "en": "antenatal",
    "de": "Schwangerschafts- und Schwangerenberatung"
  },
  {
    "en": "dietitian",
    "de": "Diätetiker"
  },
  {
    "en": "nutrition",
    "de": "Ernährung"
  },
  {
    "en": "sexual",
    "de": "Sexualberatung"
  }
]
export type MockFacility = {
  en: string,
  de: string
}

// const mockedData: MockData[] = [
//   {
//     "_id": "23DTJQgjmxg9gy2BP",
//     "properties": {
//       "originalId": "4724173877",
//       "infoPageUrl": "https://wheelmap.org/nodes/4724173877",
//       "category": "doctor",
//       "name": {
//         "en": "Zentrum für Pränataldiagnostik"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         13.3201621,
//         52.5013845
//       ]
//     }
//   },
//   {
//     "_id": "23YuKviQHcPMwsq7Q",
//     "properties": {
//       "sourceId": "axsmapv2",
//       "originalId": "ChIJw-9blHbxNIgRQ-Ka_DuW6xQ",
//       "infoPageUrl": "https://axsmap.com/venues/ChIJw-9blHbxNIgRQ-Ka_DuW6xQ",
//       "address": {
//         "text": "2615 East Carson Street, Pittsburgh, Pennsylvania"
//       },
//       "name": {
//         "en": "Neovision"
//       },
//       "category": "doctor",
//       "accessibility": {
//         "areas": [
//           {
//             "entrances": [
//               {
//                 "stairs": {
//                   "count": 0
//                 },
//                 "ratingForWheelchair": 0.8
//               }
//             ]
//           }
//         ],
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceImportId": "n29G2TBfikpq7gDbn",
//       "sourceName": "AXSMap",
//       "organizationName": "AXSMap",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "coordinates": [
//         -79.9679074,
//         40.4275744
//       ],
//       "type": "Point"
//     }
//   },
//   {
//     "_id": "22PWKQPfr7oid59NT",
//     "properties": {
//       "sourceId": "axsmapv2",
//       "originalId": "ChIJv4a-Lw3JJIgRBLgdpT7CdY0",
//       "infoPageUrl": "https://axsmap.com/venues/ChIJv4a-Lw3JJIgRBLgdpT7CdY0",
//       "address": {
//         "text": "21040 Greenfield Road, Oak Park, Michigan"
//       },
//       "name": {
//         "en": "Betts Medical Group LLC"
//       },
//       "category": "doctor",
//       "accessibility": {
//         "areas": [
//           {
//             "entrances": [
//               {
//                 "ratingForWheelchair": 0.8
//               }
//             ],
//             "restrooms": [
//               {
//                 "ratingForWheelchair": 0.8
//               }
//             ]
//           }
//         ],
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceImportId": "n29G2TBfikpq7gDbn",
//       "sourceName": "AXSMap",
//       "organizationName": "AXSMap",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "coordinates": [
//         -83.19988219999999,
//         42.4479245
//       ],
//       "type": "Point"
//     }
//   },
//   {
//     "_id": "24gWQtCR2EW8h8jNr",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         6.9779014,
//         50.821803
//       ]
//     },
//     "properties": {
//       "originalId": "1748320999",
//       "infoPageUrl": "https://wheelmap.org/nodes/1748320999",
//       "category": "doctor",
//       "name": {
//         "en": "HNO Dr. Reichel"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "26TXNaQo7gX34mRFN",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "-122924933",
//       "infoPageUrl": "https://wheelmap.org/nodes/-122924933",
//       "category": "doctor",
//       "name": {
//         "en": "Детская поликлиника"
//       },
//       "address": {
//         "street": "улица Барсукова",
//         "city": "Белоярский",
//         "house": "6",
//         "text": "улица Барсукова 6, Белоярский"
//       },
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         66.6593791,
//         63.7183907
//       ]
//     }
//   },
//   {
//     "_id": "25cWjprFnXkn2Y2c8",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         19.3728239,
//         51.3649231
//       ]
//     },
//     "properties": {
//       "originalId": "169712113",
//       "infoPageUrl": "https://wheelmap.org/nodes/169712113",
//       "category": "doctor",
//       "name": {
//         "en": "Twoje Centrum Medyczne"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "26vGz7kMn9WRrtvYZ",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         30.6213649,
//         50.4000914
//       ]
//     },
//     "properties": {
//       "originalId": "1334995166",
//       "infoPageUrl": "https://wheelmap.org/nodes/1334995166",
//       "category": "doctor",
//       "name": {
//         "en": "Дитяча поліклініка"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "274Ks6htpeoCHKxyW",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "-247238326",
//       "infoPageUrl": "https://wheelmap.org/nodes/-247238326",
//       "category": "doctor",
//       "name": {
//         "en": "Cabinet Médical-Dr.Rigaud,Dr.Catrysse,Dr.Lesur,Dr.Philippe"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         2.9488843,
//         50.3105026
//       ]
//     }
//   },
//   {
//     "_id": "27nRT5cn8htWM9N5i",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.4798343,
//         49.4562645
//       ]
//     },
//     "properties": {
//       "originalId": "2232267619",
//       "infoPageUrl": "https://wheelmap.org/nodes/2232267619",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Harald Schleyer & Andreas Legler-Görke"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "0621 814283",
//       "placeWebsiteUrl": "http://www.hausaerzte-neckarau.de/"
//     }
//   },
//   {
//     "_id": "27fttShFCScm7iFqg",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.4492448,
//         49.4826277
//       ]
//     },
//     "properties": {
//       "originalId": "2474007054",
//       "infoPageUrl": "https://wheelmap.org/nodes/2474007054",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Madsen Kieferorthopäde"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "0621 / 59 16 80",
//       "placeWebsiteUrl": "http://www.madsen.de/"
//     }
//   },
//   {
//     "_id": "27gkrxaYyPoqFYTEq",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.4255002,
//         49.3477452
//       ]
//     },
//     "properties": {
//       "originalId": "2376919790",
//       "infoPageUrl": "https://wheelmap.org/nodes/2376919790",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Roya Jalilzadeh"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "06232/42045",
//       "description": {
//         "en": "Behinderten Parkplätze sind vorhanden, aber leider gibt es 40 Sufen und 5 Schwellen"
//       }
//     }
//   },
//   {
//     "_id": "27yW4EDy48R5afwcy",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "4690061777",
//       "infoPageUrl": "https://wheelmap.org/nodes/4690061777",
//       "category": "doctor",
//       "name": {
//         "en": "Доверие"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         56.2261477,
//         58.0056522
//       ]
//     }
//   },
//   {
//     "_id": "283v36Xgs4tBZjqwx",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.4645513,
//         49.4856256
//       ]
//     },
//     "properties": {
//       "originalId": "3213730474",
//       "infoPageUrl": "https://wheelmap.org/nodes/3213730474",
//       "category": "doctor",
//       "name": {
//         "en": "Praxis Walter Schwarz"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "0621 1 09 98",
//       "placeWebsiteUrl": "http://www.facharztwalterschwarz.de"
//     }
//   },
//   {
//     "_id": "2A93Txz5S9esZakFT",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.3536373,
//         49.526367
//       ]
//     },
//     "properties": {
//       "originalId": "1342178636",
//       "infoPageUrl": "https://wheelmap.org/nodes/1342178636",
//       "category": "doctor",
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "29H9fibe8fwcZWkwm",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         13.5423988,
//         52.526867
//       ]
//     },
//     "properties": {
//       "originalId": "2021506140",
//       "infoPageUrl": "https://wheelmap.org/nodes/2021506140",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. med. Christiane Sachse und Dr. med. Stefan Prollius Urologie"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2AEuTHfaYdszbLPFZ",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         7.0884312,
//         52.4405333
//       ]
//     },
//     "properties": {
//       "originalId": "2084785085",
//       "infoPageUrl": "https://wheelmap.org/nodes/2084785085",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. med. Hans-Jörg Trenkner"
//       },
//       "address": {
//         "street": "Wasserstraße",
//         "city": "Nordhorn",
//         "house": "2",
//         "postalCode": "48531",
//         "text": "Wasserstraße 2, 48531, Nordhorn"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         },
//         "areas": [
//           {
//             "restrooms": [
//               {
//                 "isAccessibleWithWheelchair": true
//               }
//             ]
//           }
//         ],
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "KfjzByRrBWbs6kJiS",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "28k6j9zb2Bua82YjP",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         7.573571,
//         51.4443635
//       ]
//     },
//     "properties": {
//       "originalId": "824917180",
//       "infoPageUrl": "https://wheelmap.org/nodes/824917180",
//       "category": "doctor",
//       "name": {
//         "en": "Frauenärztin (Dr. med. Christa Smitka)"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2BhBA3q9MprwoftfE",
//     "properties": {
//       "sourceId": "axsmapv2",
//       "originalId": "ChIJJa6TXYf-84gRMNHpmFkcpWM",
//       "infoPageUrl": "https://axsmap.com/venues/ChIJJa6TXYf-84gRMNHpmFkcpWM",
//       "address": {
//         "text": "770 Pine Street, Macon, Georgia"
//       },
//       "name": {
//         "en": "Ekeledo Brown N MD"
//       },
//       "category": "doctor",
//       "accessibility": {
//         "areas": [
//           {
//             "entrances": [
//               {
//                 "ratingForWheelchair": 0.8
//               }
//             ],
//             "restrooms": [
//               {
//                 "ratingForWheelchair": 0.8
//               }
//             ]
//           }
//         ],
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceImportId": "n29G2TBfikpq7gDbn",
//       "sourceName": "AXSMap",
//       "organizationName": "AXSMap",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "coordinates": [
//         -83.63546610000002,
//         32.8339639
//       ],
//       "type": "Point"
//     }
//   },
//   {
//     "_id": "2B6xST7SBp2rhB6yS",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         7.9784101,
//         50.9614456
//       ]
//     },
//     "properties": {
//       "originalId": "415362838",
//       "infoPageUrl": "https://wheelmap.org/nodes/415362838",
//       "category": "doctor",
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2AnxnJborhkhHbAzT",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "3767970163",
//       "infoPageUrl": "https://wheelmap.org/nodes/3767970163",
//       "category": "doctor",
//       "name": {
//         "en": "Erste Hilfe Entbindung"
//       },
//       "phoneNumber": "+49 30 450 564 025",
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceImportId": "yN6s9ygzQzsnMJu6f",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         13.3433152,
//         52.5421641
//       ]
//     }
//   },
//   {
//     "_id": "2BhGW6naZSuWn3saX",
//     "properties": {
//       "originalId": "490955961",
//       "infoPageUrl": "https://wheelmap.org/nodes/490955961",
//       "category": "doctor",
//       "name": {
//         "en": "Arztpraxis Dr. Armin El-Omari"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         },
//         "areas": [
//           {
//             "restrooms": [
//               {
//                 "isAccessibleWithWheelchair": true
//               }
//             ]
//           }
//         ]
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         12.0465356,
//         54.050326
//       ]
//     }
//   },
//   {
//     "_id": "2ARazYdQMiF9RjLQh",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "-173081532",
//       "infoPageUrl": "https://wheelmap.org/nodes/-173081532",
//       "category": "doctor",
//       "name": {
//         "en": "Gesundheitszentrum"
//       },
//       "address": {
//         "street": "Karl-Krische-Straße",
//         "city": "Backnang",
//         "house": "4",
//         "postalCode": "71522",
//         "text": "Karl-Krische-Straße 4, 71522, Backnang"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceImportId": "yN6s9ygzQzsnMJu6f",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.4391882,
//         48.9408221
//       ]
//     }
//   },
//   {
//     "_id": "2Aa9GSQqw4mn9trJr",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.9872717,
//         53.4568973
//       ]
//     },
//     "properties": {
//       "originalId": "4168200194",
//       "infoPageUrl": "https://wheelmap.org/nodes/4168200194",
//       "category": "doctor",
//       "name": {
//         "en": "Hanseatische Radiologie"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2BJDXDuq44vp3vcbd",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.6381119,
//         49.5428657
//       ]
//     },
//     "properties": {
//       "originalId": "2079670890",
//       "infoPageUrl": "https://wheelmap.org/nodes/2079670890",
//       "category": "doctor",
//       "name": {
//         "en": "Adolf E. Kritsch"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2CBpM8yL7Cg5MYrtf",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         7.4264443,
//         51.0466764
//       ]
//     },
//     "properties": {
//       "originalId": "417406648",
//       "infoPageUrl": "https://wheelmap.org/nodes/417406648",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Keuthage"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2Cy76mKXMhYyTc7kM",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         12.4876025,
//         50.7293286
//       ]
//     },
//     "properties": {
//       "originalId": "4049884272",
//       "infoPageUrl": "https://wheelmap.org/nodes/4049884272",
//       "category": "doctor",
//       "name": {
//         "en": "Praxis für Psychotherapie"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2CuKY4xRzYgD7zM5t",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         12.4921332,
//         50.7287063
//       ]
//     },
//     "properties": {
//       "originalId": "4217576517",
//       "infoPageUrl": "https://wheelmap.org/nodes/4217576517",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Gernot Hertel"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2CuXp3RA2xxDXx4zm",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         10.5215624,
//         51.7141321
//       ]
//     },
//     "properties": {
//       "originalId": "1416992657",
//       "infoPageUrl": "https://wheelmap.org/nodes/1416992657",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Fischer"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         },
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2DD5my4HQgpK4dFTF",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         10.0056393,
//         48.3746866
//       ]
//     },
//     "properties": {
//       "originalId": "85077606",
//       "infoPageUrl": "https://wheelmap.org/nodes/85077606",
//       "category": "doctor",
//       "name": {
//         "en": "Mehnert Dres. Gemeinschaftspraxis für Genetik Mikrobiologie, Molekulargenetik"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2DPPmzDdXeaTvTXGo",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         11.694817,
//         47.8851542
//       ]
//     },
//     "properties": {
//       "originalId": "38657577",
//       "infoPageUrl": "https://wheelmap.org/nodes/38657577",
//       "category": "doctor",
//       "name": {
//         "en": "Atrium"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2Dhqw7pRvAfEMYJD6",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.5569829,
//         52.2098989
//       ]
//     },
//     "properties": {
//       "originalId": "221051912",
//       "infoPageUrl": "https://wheelmap.org/nodes/221051912",
//       "category": "doctor",
//       "name": {
//         "en": "ReAktiv"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2DstTrodF6BaH7hqC",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         13.0658583,
//         50.8581039
//       ]
//     },
//     "properties": {
//       "originalId": "3782963202",
//       "infoPageUrl": "https://wheelmap.org/nodes/3782963202",
//       "category": "doctor",
//       "name": {
//         "en": "Gemeinschaftspraxis Dr.med. Gudrun Schirmer und Dipl.-Med. U. Schirmer"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2E6SoMo468nNhoz3L",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "-247201919",
//       "infoPageUrl": "https://wheelmap.org/nodes/-247201919",
//       "category": "doctor",
//       "name": {
//         "en": "Centre Médical Privé"
//       },
//       "address": {
//         "street": "Route Nationale",
//         "city": "Dembéni",
//         "house": null,
//         "postalCode": "97660"
//       },
//       "sourceImportId": "ZGehdHQMiBrhJWJGJ",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         45.176021,
//         -12.8369578
//       ]
//     }
//   },
//   {
//     "_id": "2DsNoTXCkevTTpi4y",
//     "properties": {
//       "originalId": "-467685042",
//       "infoPageUrl": "https://wheelmap.org/nodes/-467685042",
//       "category": "doctor",
//       "name": {
//         "en": "みやけ医院"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "csGPDtu2mBTAsaFXG",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         143.8848683,
//         43.8011982
//       ]
//     }
//   },
//   {
//     "_id": "2FQHeySFd9HWsFqeP",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.8899339,
//         53.0611743
//       ]
//     },
//     "properties": {
//       "originalId": "442297586",
//       "infoPageUrl": "https://wheelmap.org/nodes/442297586",
//       "category": "doctor",
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2EYXYwB5YtMEkmvPZ",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.3436582,
//         49.298001
//       ]
//     },
//     "properties": {
//       "originalId": "1832002667",
//       "infoPageUrl": "https://wheelmap.org/nodes/1832002667",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Bohlender"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         },
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "4963445655"
//     }
//   },
//   {
//     "_id": "2FbKrsXJrsJyfbJQx",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         10.0999852,
//         48.8236255
//       ]
//     },
//     "properties": {
//       "originalId": "2039632734",
//       "infoPageUrl": "https://wheelmap.org/nodes/2039632734",
//       "category": "doctor",
//       "name": {
//         "en": "Dipl. Psych. Astrid Triebel"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "07361526870",
//       "description": {
//         "en": "Stufe mit 16 cm Höhe, Türbreite 80 cm"
//       }
//     }
//   },
//   {
//     "_id": "2G4ywGaGZNjoXju3M",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.140753,
//         48.997145
//       ]
//     },
//     "properties": {
//       "originalId": "3896211667",
//       "infoPageUrl": "https://wheelmap.org/nodes/3896211667",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. med. Hiemer (Orthopäde)"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GgEqwjtJhhhB3fDs",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         -4.0224524,
//         51.6178361
//       ]
//     },
//     "properties": {
//       "originalId": "96001063",
//       "infoPageUrl": "https://wheelmap.org/nodes/96001063",
//       "category": "doctor",
//       "name": {
//         "en": "Killay Medical Centre"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GcPhbXNHqi6uPcA3",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.8714182,
//         51.2717926
//       ]
//     },
//     "properties": {
//       "originalId": "594990639",
//       "infoPageUrl": "https://wheelmap.org/nodes/594990639",
//       "category": "doctor",
//       "name": {
//         "en": "Chirurg Lamprousis"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         },
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GZpNFerAB879u8Kj",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.3574352,
//         49.5357493
//       ]
//     },
//     "properties": {
//       "originalId": "835056909",
//       "infoPageUrl": "https://wheelmap.org/nodes/835056909",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. med. Mike Bucher"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         },
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GHa9HXYFQDesR5wX",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         10.52679,
//         52.2591748
//       ]
//     },
//     "properties": {
//       "originalId": "2245012735",
//       "infoPageUrl": "https://wheelmap.org/nodes/2245012735",
//       "category": "doctor",
//       "name": {
//         "en": "Andreas Pies (Hämatologe)"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "05321 2406640"
//     }
//   },
//   {
//     "_id": "2GXfPkCPzH5gJW9yM",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         8.5098719,
//         51.63629
//       ]
//     },
//     "properties": {
//       "originalId": "233974565",
//       "infoPageUrl": "https://wheelmap.org/nodes/233974565",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Morgner"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GhWCbQi3uKDRETQm",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.0601359,
//         48.4065144
//       ]
//     },
//     "properties": {
//       "originalId": "3193650058",
//       "infoPageUrl": "https://wheelmap.org/nodes/3193650058",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Monika Schäfer"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GosbRRcxjLM3eFZw",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         9.2790497,
//         50.2064923
//       ]
//     },
//     "properties": {
//       "originalId": "692206796",
//       "infoPageUrl": "https://wheelmap.org/nodes/692206796",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Leolea"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         },
//         "partiallyAccessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2GjuJaTZBescm27mE",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         12.1181317,
//         54.0856103
//       ]
//     },
//     "properties": {
//       "originalId": "3203815062",
//       "infoPageUrl": "https://wheelmap.org/nodes/3203815062",
//       "category": "doctor",
//       "name": {
//         "en": "Radiologie am Lindenpark"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true,
//       "phoneNumber": "+49 (0381) 3779390",
//       "placeWebsiteUrl": "www.radiologie-am-lindenpark.de"
//     }
//   },
//   {
//     "_id": "2HABx4pWBS585LgEw",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "3491570645",
//       "infoPageUrl": "https://wheelmap.org/nodes/3491570645",
//       "category": "doctor",
//       "name": {
//         "en": "Кардиоэксперт"
//       },
//       "phoneNumber": "+7 8182 480707",
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         40.5134341,
//         64.5439405
//       ]
//     }
//   },
//   {
//     "_id": "2HCsq59t2ijNvikwr",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         6.3086516,
//         51.1309121
//       ]
//     },
//     "properties": {
//       "originalId": "271803975",
//       "infoPageUrl": "https://wheelmap.org/nodes/271803975",
//       "category": "doctor",
//       "name": {
//         "en": "Gemeinschaftspraxis Stilling, Felix-Dalichow"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2HmjWFLLr7gwgFxH5",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         11.163921,
//         50.3550322
//       ]
//     },
//     "properties": {
//       "originalId": "155262296",
//       "infoPageUrl": "https://wheelmap.org/nodes/155262296",
//       "category": "doctor",
//       "name": {
//         "en": "Orthopädische Gemeinschaftspraxis"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": true
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2JLFrcdLqAhQq3RmN",
//     "properties": {
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "originalId": "-78535075",
//       "infoPageUrl": "https://wheelmap.org/nodes/-78535075",
//       "category": "doctor",
//       "name": {
//         "en": "Cabinet medical"
//       },
//       "address": {
//         "street": null,
//         "city": null,
//         "house": null,
//         "text": ""
//       },
//       "sourceImportId": "9J9zWJ42XLXSaeziJ",
//       "sourceName": "Wheelmap OSM Mirror",
//       "organizationName": "Sozialhelden e.V."
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         4.8053149,
//         44.1348724
//       ]
//     }
//   },
//   {
//     "_id": "2JDDiRwMNnFaBEbjN",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         11.0945019,
//         49.2503455
//       ]
//     },
//     "properties": {
//       "originalId": "3121337129",
//       "infoPageUrl": "https://wheelmap.org/nodes/3121337129",
//       "category": "doctor",
//       "name": {
//         "en": "Dr. Stefan Wanke"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "rp34Lwek8Fhtmkuqf",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   },
//   {
//     "_id": "2J25KoZF2SHXEM3Td",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [
//         3.7043802,
//         43.7424135
//       ]
//     },
//     "properties": {
//       "originalId": "4004798174",
//       "infoPageUrl": "https://wheelmap.org/nodes/4004798174",
//       "category": "doctor",
//       "name": {
//         "en": "Infirmière"
//       },
//       "accessibility": {
//         "accessibleWith": {
//           "wheelchair": false
//         }
//       },
//       "sourceId": "LiBTS67TjmBcXdEmX",
//       "sourceImportId": "fCcoz2Bn3YftLnQSP",
//       "sourceName": "Wheelmap",
//       "organizationName": "Sozialhelden e.V.",
//       "hasAccessibility": true
//     }
//   }
// ]