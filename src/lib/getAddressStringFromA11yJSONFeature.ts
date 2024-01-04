import { isString } from "lodash"
import { LocalizedString } from "./i18n"

type Address ={
  areas?:	LocalizedString[] | undefined	        // An array of named areas below the district and above street. In some regions such areas might also contain street names, when individual street segments have names separate from the name of the whole road.     
  building?:	LocalizedString | undefined	    // Building name         
  city?:	LocalizedString | undefined	        // The name of the primary locality of the place.     
  countryCode?:	string | undefined    // A three-letter country code in ISO 3166-1 alpha-3, see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3	         
  county?:	LocalizedString | undefined	      // A division of a state; typically a secondary-level administrative division of a country or equivalent.       
  district?:	LocalizedString | undefined	    // A division of city; typically an administrative unit within a larger city or a customary name of a city's neighborhood.         
  house?:	LocalizedString | undefined	        // House or street number.     
  levelIndex?:	number | undefined    // Relative in relation to other levels. 0 for ground level must have index 0, 1 for first level, etc. You can use half numbers for levels like 1.5.	         
  levelName?:	LocalizedString | undefined	    // Name of the level. Example: { en: "Floor 1" }, { en: "Ground level" }.         
  postalCode?:	LocalizedString | undefined    // An alphanumeric LocalizedString included in a postal address to facilitate mail sorting (a.k.a. post code, postcode, or ZIP code).	         
  regions?:	LocalizedString[] | undefined	      // For address conventions where more than to levels of named areas above the city level are in use, the regions attribute provides an array with all additional area names, ordered by decreasing size (starting with the highest subdivision below state)       
  room?:	LocalizedString | undefined	        // Room name. Example: { en: "Meeting room ‘Rome’" }.     
  roomNumber?:	LocalizedString | undefined    // Room number. Example: { en: "B-101" }.	         
  state?:	LocalizedString | undefined	        // A division of a country; typically a first-level administrative division of a country and/or a geographical region.     
  stateCode?:	string | undefined	    // A code/abbreviation for the state division of a country.         
  street?:	LocalizedString | undefined	      // Street name (in practice may also contain street number).       
  text?:	LocalizedString | undefined	        // A displayable, formatted address as rich text.     

}

// function isString(localizedString: LocalizedString): localizedString is string {
//   return typeof localizedString === 'string';
// }

/**
 * 
 * @param address 
 * @returns a string or first value from a LocalizedString object, regardless of the language
 */
function getFirstValueFromLocalizedString(localizedString: LocalizedString | undefined): string {

  if (!localizedString) {
    return '';
  }

  return isString(localizedString) ? localizedString : Object.values(localizedString).shift(); 
}

/**
 * 
 * @param address 
 * @returns a string or undefined from structuredAddress A11yJSON feature address object
 */
export default function getAddressStringFromA11yJSONFeature(address: Address): string | undefined {
  return [
    [
      getFirstValueFromLocalizedString(address.street), 
      getFirstValueFromLocalizedString(address.house), 
    ].filter(Boolean).join(' '),
    [
      getFirstValueFromLocalizedString(address.postalCode), 
      getFirstValueFromLocalizedString(address.city), 
    ].filter(Boolean).join(' '),
    getFirstValueFromLocalizedString(address.state),
    address.countryCode,
  ]
    .filter(Boolean)
    .join(', ');
}



















