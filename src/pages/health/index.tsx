import { ReactElement } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { t } from "ttag";
import LayoutHealthPage from "../../components/App/LayoutHealthPage";
import { placeNameCSS } from "../../components/shared/PlaceName";
import FilterSection from "./components/FilterSection";
import SearchResults from "./components/SearchResults";
import { fetcher } from "./components/helpers";

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


  summary details
  oder dialog 
  cards: keine bubbles- nur für filter-a11y labels auf den cards
*/

const StyledPage = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .health-site-content {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255, 0.95);
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .health-site-h1 {
    ${placeNameCSS}
    margin-top: calc(50px + 1rem);
    margin-inline: 2rem;
  }

  .search-filter-section {
    margin-left: 1rem;
    margin-right: 1rem;
    background-color: rgb(255, 255, 255, 1);
    margin-top: 1rem; 
    height: auto;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  }
  
  .search-results-section {
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
    margin: 1rem;
    background-color: rgb( 255, 255, 255,  1);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .search-filter-h2 {
    margin-top: 1rem;
    margin-inline: 1rem;

  }

  .search-filter-container {
    width: min(100% - 2rem, max(800px, 70%));
    height: fit-content;
    margin-inline: 1rem;
    display: flex;
    flex-direction: row;
  }
  
  .input-choices {
    height: auto;
    width: 50%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    
    .survey-form-titel {
      font-size: 110%;
      margin-bottom: 0.5rem;
    }
   
    .search-filter-inputs {
      display: flex;
      flex-direction: column;
      width: 90%;
    }
  }

  .preference-choices {
    height: auto;
    width: 50%;
  }

  .search-filter-details {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  
  .search-filter-details[open] > .search-filter-summary::marker {
    transform: rotate(90deg);
  }

  .disabled-filter-button {
    display: none
  }

  .active-filter-button {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }

  .active-filters-bar {
    min-height: 2rem;
    max-height: fit-content;
    list-style-type: none; 
    display: flex;
    flex-wrap: wrap;
  }

  @media screen and (max-width: 600px) {
    .search-filter-container {
      flex-direction: column;

      .input-choices,
      .preference-choices {
        width: auto;
      }
    }
  }

  .search-results-container {
    width: min(100% - 2rem, max(600px, calc(100vw - 1rem)));
    margin-inline: auto;
    margin-bottom: 1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }

  .search-results-list {
    list-style-type: none;
  }

  .search-result {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin-block: 0.7rem;
    
    height: fit-content;
    background-color: beige;
    border-radius: 0.3rem;
    padding: 0.4rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  }
  
  .search-results-h2 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .search-result-address,
  .search-result-heading,
  .search-result-description {
    font-size: 1rem;
    line-height: 1.2;  
  }
  
  .search-result-heading {
    font-weight: 500;
    margin-bottom: 0.4rem;
  }
  
  .search-result-address {

  }

`;

export default function Page() {  

  // TODOS: get photon api bbox for query
  // const [searchResult, setSearchResult] = React.useState<any>([]);
  // const memoizedSearchResultsContext = React.useMemo(() => ({ searchResult, setSearchResult }), [searchResult, setSearchResult]);

  const staticdataURL = '/api/staticdata';
  const url = staticdataURL;
  
  const { data, error } = useSWR( url, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const mockedData: MockData[] = JSON.parse(data);
  const labels = ["Aufzug", "Ebenerdiger Eingang", "Parkplatz", "Leichte Sprache", "Gebärdensprache"];
  
  

  return (
      <StyledPage>
        <div className="health-site-content">
          <h1 className="health-site-h1">{t`Praxissuche`}</h1>
          <FilterSection data={mockedHealthcareFacilities} labels={labels} />
          <SearchResults data={mockedData} />
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