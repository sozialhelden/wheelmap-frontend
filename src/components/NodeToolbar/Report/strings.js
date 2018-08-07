// @flow

import { t } from 'ttag';


export default function strings() {
  return {
    // translator: Header of the report dialog
    reportIssueHeader: t`Is there an issue with this place?`,
    // translator: Explains that Wheelmap's data comes from OpenStreetMap.
    osmHint: t`Wheelmap uses data from OpenStreetMap to display places.`,
    // translator: Explains that you need to go to OSM to remove places.
    osmRemoveHint: t`You can remove non-existing places on OpenStreetMap.`,
    // translator: Explains that you need to go to OSM to change a place's position on the map.
    osmPositionHint: t`You can change this place’s position on OpenStreetMap.`,
    // translator: Explains that you need to go to OSM to mark a place as closed.
    osmPermanentlyClosedHint: t`If the place closed permanently, you can tag the place as ‘disused’ on OpenStreetMap.`,
    // translator: Link caption to the explanatory article that shows how to mark a place as closed.
    osmPermanentlyClosedHowtoLinkCaption: t`Find out how`,
    // translator: Points the user to OSM for changing place details
    osmEditHint: t`Did you know you can change this place’s information on OpenStreetMap directly?`,
    // translator: Explains that you have to log in before editing places on OSM and that edits don't get propagated back directly
    osmLoginHint: t`(Note that you need to log in first to do this, and that it can take a while until the place is updated on Wheelmap.)`,
    // translator: Button caption in report dialog
    editButtonCaption: t`Edit this place on OpenStreetMap`,
    // translator: Button caption in report dialog
    noteButtonCaption: t`Leave a note on OpenStreetMap`,
    // translator: Button caption in report dialog
    backButtonCaption: t`Back`,
    // translator: Gives credits to the external organization this place comes from. The organization's name is mentioned after this text.
    externalDataHint: t`Information about this place has kindly been provided by another organization`,
    // translator: Explains how to reach the place details on the external page the place comes from (for example Jaccede).
    useLinkExplanation: t`Use the link below for details about the place and editing.`,
    // translator: Explains that edits don't get propagated back to Wheelmap directly after editing
    editingDelayExplanation: t`(Note that it can take a while until the place is updated on Wheelmap after editing.)`,
    // translator: Button caption in report dialog
    contactButtonCaption: t`Contact the Wheelmap support team`,
    // translator: Apologizes for the issue and mentions that the support team can help you.
    apologyAndSolution: t`Sorry for that! Just drop us a line so we can help you to fix the issue.`,
    reportBody(url: string) {
      // translator: Report email body with place URL
      return t`(Please only write in English or German.)\n\nHi Sozialhelden,\n\nsomething is wrong with this place: ${url}\n\nThe problem is:\n\nBrowser:\n\n${navigator.userAgent}`;
    },
    reportSubject(placeName: ?string, categoryName: ?string) {
      // translator: Report email subject if place name is known
      if (placeName) return t`[Wheelmap] Problem with ${placeName} on Wheelmap`;
      // translator: Report email subject if place name is unknown, but place category name (for example ‘toilet’) is known (don't use an indefinite article if it would need to be inflected in the target language)
      if (categoryName) return t`[Wheelmap] Problem with a ${categoryName} on Wheelmap`;
      // translator: Report email subject if neither place name nor category name is known
      return t`[Wheelmap] Problem with a place on Wheelmap`;
    },
  };
}
