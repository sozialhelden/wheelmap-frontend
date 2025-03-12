# TODOs

## Interface

* [x] Sidebar component
    * [x] Toggle
    * [x] Mobile gestures
    * [x] fix all other toolbar users
    * [ ] make wider on big viewports
* [x] Place list component
* [x] Place Item component
    * [x] Name/Title
    * [x] Image
    * [x] Category / Subtitle
    * [x] a11y stuff
    * [x] Opening Hours
* [ ] Anbindung an Filterung und Backend
  * [x] Wenn wir filtern, wird die Liste angezeit
  * [x] Die Daten in der Liste kommen aus dem Backend
  * [ ] Es gibt Pagination in der Liste
  * [ ] Wir zeigen auch a11ycloud Orte in der Liste an
* [ ] Refactoring
  * [x] url und coordinates in funktionen auslagern
  * [ ] Opening Hours: Komplexe Öffnungszeiten handlen. "Wahrscheinlich offen" sollte checken, ob der nächste Change am 
selben Tag stattfindet oder nicht. Saisonale Öffnungszeiten: Einige Orte sind evtl. saisonal geschlossen. "Next Change" sollte auf Monatsebene abgeglichen werden.
  * [ ] Der Opening-Hours-Komponenten Code ist gedoppelt
  * [ ] Die Lokalisierung in der OH-Komponente sollte den Kontext benutzen
  * [ ] Die WikidaraEntityImage Komponente evtl in einen Hook und eine Renderfunction splitten
  * [ ] alles hübsch machen
  * [ ] statt bounding box sollten tiles zun laden der orte benutzt werden (mit tilebelt findet man kleineste teil zu einer bounding box: https://github.com/mapbox/tilebelt)
* [ ] Usability
  * [ ] wenn ich in der Karte navigiere auf mobile, collapsed die sidebar/das sheet
  * [ ] wenn ich auf ein list-item klicke, panned die karte langsam
  * [ ] wenn ich auf ein list-item klicke, wird das in der karte in der mitte des ausschnitts angezeigt (karten-padding)
  * [ ] wenn ich über ein list-item auf dem desktop hovere, möchte ich, dass der marker auf der karte hervorgehoben wird
  * [ ] Sortierung nach Mittelpunkt des Kartenausschnitts
  * [ ] Error handling

## Für später

* distance to current location
* wie viele orte gefunden wurden, text-anzeige
* info button mit dialog, der erklärt, wie wir orte anzeigen und filtern
* wenn ich ein list item öffne, wird es neben und nicht über der liste angezeigt auf desktop
* eventuell pfeile in den place details, um schnell zum nächsten list-item springen zu können


