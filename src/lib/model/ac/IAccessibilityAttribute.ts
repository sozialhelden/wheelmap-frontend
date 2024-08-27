import { LocalizedString } from '@sozialhelden/a11yjson'
import { IPersonalProfile } from './IPersonalProfile'
import ISVGOResult from './ISVGOResult'

export default interface IAccessibilityAttribute {
  _id: string,
  label: LocalizedString,
  shortLabel: LocalizedString,
  summary: LocalizedString,
  details: LocalizedString,
  context: LocalizedString,
  deprecatedInfo: LocalizedString,
  discouragedInfo: LocalizedString,
  isDeprecated: boolean,
  isDiscouraged: boolean,
  canBePositive: boolean,
  canBeNegative: boolean,
  isHazard: boolean,
  isNoHazard: boolean,
  helpfulFor: IPersonalProfile,
  harmfulFor: IPersonalProfile,
  hazardousFor: IPersonalProfile,
  describesPeople: boolean,
  describesFeatures: boolean,
  describesFurniture: boolean,
  describesArchitecture: boolean,
  isMachineData: boolean,
  vectorIconSVG: ISVGOResult,
}
