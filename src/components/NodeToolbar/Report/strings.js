// @flow

import { t } from 'c-3po';

export default function strings() {
  return {
    // translator: Header of the report dialog
    reportIssueHeader: t`Gibt es ein Problem mit diesem Ort?`,
    // translator: Explains that Wheelmap's data comes from OpenStreetMap.
    osmHint: t`Wheelmap verwendet Daten von OpenStreetMap, um Orte anzuzeigen.`,
    // translator: Explains that you need to go to OSM to remove places.
    osmRemoveHint: t`Du kannst Orte, die nicht mehr existieren, auf OpenStreetMap entfernen.`,
    // translator: Explains that you need to go to OSM to change a place's position on the map.
    osmPositionHint: t`Du kannst die Position dieses Ortes auf OpenStreetMap verändern.`,
    // translator: Explains that you need to go to OSM to mark a place as closed.
    osmPermanentlyClosedHint: t`Wenn der Ort dauerhaft geschlossen ist, kannst du auf OpenStreetMap die Kennzeichnung ‚disused‘ verwenden.`,
    // translator: Link caption to the explanatory article that shows how to mark a place as closed.
    osmPermanentlyClosedHowtoLinkCaption: t`So geht’s`,
    // translator: Points the user to OSM for changing place details
    osmEditHint: t`Wusstest du, dass du diesen Ort auf OpenStreetMap direkt bearbeiten kannst?`,
    // translator: Explains that you have to log in before editing places on OSM and that edits don't get propagated back directly
    osmLoginHint: t`(Dafür musst du dich auf OpenStreetMap einloggen. Es kann eine Weile dauern, bis der Ort auch auf Wheelmap aktualisiert wird.)`,
    // translator: Button caption in report dialog
    editButtonCaption: t`Diesen Ort auf OpenStreetMap bearbeiten`,
    // translator: Button caption in report dialog
    noteButtonCaption: t`Notiz auf OpenStreetMap hinterlassen`,
    // translator: Button caption in report dialog
    backButtonCaption: t`Zurück`,
    // translator: Gives credits to the external organization this place comes from. The organization's name is mentioned after this text.
    externalDataHint: t`Die Informationen über diesen Ort wurden netterweise von einer anderen Organisation zur Verfügung gestellt.`,
    // translator: Explains how to reach the place details on the external page the place comes from (for example Jaccede).
    useLinkExplanation: t`Benutze den folgenden Link für Details über den Ort und zum Bearbeiten.`,
    // translator: Explains that edits don't get propagated back to Wheelmap directly after editing
    editingDelayExplanation: t`(Es kann danach eine Weile dauern, bis der Ort auch auf Wheelmap aktualisiert wird.)`,
    // translator: Button caption in report dialog
    contactButtonCaption: t`Wheelmap-Team kontaktieren`,
    // translator: Apologizes for the issue and mentions that the support team can help you.
    apologyAndSolution: t`Das tut uns leid! Schreib’ uns einfach, damit wir dir helfen können, das Problem zu beheben.`,
    reportBody(url: string) {
      // translator: Report email body with place URL
      return t`(Bitte schreib’ uns auf Englisch oder Deutsch!)\n\nLiebe Sozialhelden,\n\nan diesem Ort ist etwas falsch: ${url}\n\nDas Problem ist:\n\nBrowser:\n\n${navigator.userAgent}`;
    },
    reportSubject(placeName: ?string, categoryName: ?string) {
      // translator: Report email subject if place name is known
      if (placeName) return t`[Wheelmap] Problem mit ${placeName} auf Wheelmap`;
      // translator: Report email subject if place name is unknown, but place category name (for example ‘toilet’) is known (don't use an indefinite article if it would need to be inflected in the target language)
      if (categoryName) return t`[Wheelmap] Problem mit ${categoryName} auf Wheelmap`;
      // translator: Report email subject if neither place name nor category name is known
      return t`[Wheelmap] Problem mit einem Ort auf Wheelmap`;
    }
  };
}