import { t } from 'ttag'
import { LocalizedString } from '../../../lib/i18n/LocalizedString'

export default function strings() {
  return {
    // translator: Header of the report dialog
    reportIssueHeader: t`Is there a problem with this place?`,
    // translator: Explains that Wheelmap's data comes from OpenStreetMap.
    osmHint: t`Many places on Wheelmap.org come from OpenStreetMap.`,
    // translator: Explains that you need to go to OSM to remove places.
    osmRemoveHint: t`You can remove non-existing places on OpenStreetMap.`,
    // translator: Explains that you need to go to OSM to change a place's position on the map.
    osmPositionHint: t`You can change this place’s location on OpenStreetMap.`,
    // translator: Explains that you need to go to OSM to mark a place as closed.
    osmPermanentlyClosedHint: t`If the place has closed permanently, you can tag the place as ‘disused’ on OpenStreetMap.`,
    // translator: Link caption to the explanatory article that shows how to mark a place as closed.
    osmPermanentlyClosedHowtoLinkCaption: t`Find out how`,
    // translator: Points the user to OSM for changing place details
    osmEditHint: t`You can change this place’s information on OpenStreetMap directly.`,
    // translator: Explains that you have to log in before editing places on OSM and that edits don't get propagated back directly
    osmLoginHint: t`(Note that you need to log in to do this, and that it can take some time until the place is updated on Wheelmap.)`,
    // translator: Button caption in report dialog
    editButtonCaption: t`Edit this place on OpenStreetMap`,
    // translator: Button caption in report dialog
    noteButtonCaption: t`Leave a note on OpenStreetMap`,
    // translator: Button caption in report dialog
    backButtonCaption: t`Back`,
    // translator: Explains how to reach the place details on the external page the place comes from (for example Jaccede).
    useLinkExplanation: t`Click the link below for details about the place and for editing.`,
    // translator: Explains that edits don't get propagated back to Wheelmap directly after editing
    editingDelayExplanation: t`(Note that it can take some time after editing until the place is updated on Wheelmap.)`,
    // translator: Button caption in report dialog
    contactButtonCaption: t`Contact the Wheelmap support team`,
    // translator: Apologizes for the issue and mentions that the support team can help you.
    apologyAndSolution: t`Sorry about that! Just drop us a line so we can help you to fix the problem.`,
    reportBody(url: string) {
      // translator: Report email body with place URL
      return t`(Please only write in English or German.)\n\nDear Sozialhelden,\n\nsomething about this place is wrong: ${url}\n\nThe problem is:\n\nMy browser:\n\n${navigator.userAgent}`
    },
    reportSubject(
      placeName: LocalizedString | string | null,
      categoryName: string | null,
    ) {
      // translator: Report email subject if place name is known
      if (placeName) return t`[Wheelmap] Problem with ${placeName} on Wheelmap`
      // translator: Report email subject if place name is unknown, but place category name (for example ‘toilet’) is known (don't use an indefinite article if it would need to be inflected in the target language)
      if (categoryName) return t`[Wheelmap] Problem with a ${categoryName} on Wheelmap`
      // translator: Report email subject if neither place name nor category name is known
      return t`[Wheelmap] Problem with a place on Wheelmap`
    },
  }
}
