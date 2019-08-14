# Testing Documentation

This document explains the steps to test the main functionality of the wheelmap react frontend application.

## First time usage

- 'welcome' dialog shown on first start
- 'welcome' dialog can be dismissed with the 'lets go' button
- tapping any button or the blurred does not trigger any reaction on other underlying components
- 'welcome' dialog can be re-opened by tapping the logo in the main menu
- 🖥  Browser(tab) title matches application name

## Positioning

- on first start the user is asked for location access

### Access granted

- on first start:
  - positioning is enabled
  - the map is centered at the device location
  - a blue circle & dot is displayed at the map center
- on subsequent starts:
  - positioning is in the same state as before
  - the map is centered at the last map center
  
- tapping the 'locate me' button when the blue dot is on screen disables positioning
- tapping the 'locate me' button otherwise enables positioning & moves the map to the device location 

- The map is never moved without user interaction, even when the device location changes

### Access denied

- on app start positioning is disabled, and no 'enable positioning' notification is shown
- on the first tap on the 'locate me' button an 'enable positioning' notification is shown
- on the second tap on the 'locate me' button or the 'enable positioning' notification 

### Access denied while app is running

- blue circle & position on map is not show
- positioning is automatically disabled

## Menu bar/Main menu

- tapping the hamburger menu button opens the 'main menu'
- 🖥 when the window size is large enough that all menu buttons fit
  no hamburger menu is displayed
- tapping the 'new place' button opens the 'new place' dialog
- tapping any other link opens the underlying web-page in a new browser tab
- 🖥  Browser(tab) title matches application name
- when online queries are executing a busy indicator is shown in the menu bar

## Main Menu
- tapping the 'close' button or the blurred area dismisses the 'main menu'
- tapping any button or the blurred are does not trigger any reaction on other underlying components
- 🖥 the tab key moves focus through those main menu links only

### New place dialog

- tapping the 'close' button or the blurred area dismisses the 'new place dialog'
- tapping 'add note in osm' opens the osm map in a new tab at the map center with the add note dialog open
- 📱 there are two additional apps listed under 'add place'
  - tapping 'Maps Me' opens the app-store page of the maps me application
  - tapping 'Go Map' opens the app-store page of the go map application 
- tapping 'iD Editor' opens the osm id editor (or a login dialog) in a new tab
- 🖥 the tab key moves focus through the dialog links only

## Map

- map tiles are loading & displaying correctly
- map has a mapbox tile attribution in the bottom left
- map has three/four links in the bottom right
  - tapping 'mapbox' opens mapbox website in new tab
  - tapping 'open-street-map' opens osm website in new tab
  - tapping 'improve this map' opens mapbox web reporter in new tab
  - 🖥 tapping 'sozialhelden' opens sozialhelden website in new tab
- click/single finger touch and drag pans the map
  - click dragging on an interactive comp
- 📱 two finger pinch zooms the map in fixed steps, not the application ui
- there are ac places visible on the map
- there are wheelmap places visible on the map
- the places on the map have icons & colors according to their accessibility
- places close by each other are grouped into clusters
  - cluster color has the average accessibility of the places inside
  - tapping the cluster zooms in closer
  - tapping the cluster, when on the closest zoom level, opens a radial menu of the places
  - tapping a place in the radial menu highlights the place and opens the place detail panel
- there can only be one highlighted place at a time, equipment can highlight multiple map icons
- 🖥 the map can be focused 
  - it can be moved with the arrow keys
  - it can be zoomed with the + and - keys
- 🖥 the tab key moves focus through the places on the map, pressing enter highlights and opens the place details panel
- when the map is zoomed out far, a 'zoom closer' notification is displayed
  - tapping on the 'zoom closer' notification zooms in one zoom level
  
## Filter & Search

- 📱 the filter button is collapsed and shows 'all places'
- 📱 tapping the filter button opens the filter dialog
- 📱 tapping the 'go' button or the map dismisses the filter dialog
- 📱 tapping any button or the map does not trigger any reaction on other underlying components
- 🖥 the tab key moves focus through the filter elements (but also through the rest of the page)

### Filter by category

- the top categories are displayed in a grid
- tapping on one of these categories 
  - shows only places belonging to this category (or children of this category) on the map
  - zooms out to a larger zoom level to display more places
  - collapses the grid into an item of the selected category
  - changes the accessibility filter icons to those matching the category
  - closes any previous open place details panels
- tapping on the selected category removes the category filter
- when closing the filter dialog, the selected category is displayed on the filter button
- when the filter dialog is reopened the formerly selected category is still selected

### Filter by accessibility

- different combinations of accessibility filters are shown in a list below the category grid
- tapping on one of the accessibility filters
  - shows only places matching the accessibility criteria of that filter on the map
  - collapses the list into an item of the selected category
  - changes the category icons to those matching the accessibility criteria
  - closes any previous open place details panels
- when the filter dialog is reopened the formerly selected filter is still selected

### Search

- 🖥 the search bar is focused when the page is opened
- 📱 the search bar is hidden when the page is opened
- when typing in the search bar a search is performed
  - while the search is ongoing a progress indicator is shown
  - if an error occurs it is displayed correctly
  - cities/towns/countries are displayed in bold
  - if a place has an osm id and can be found in wheelmap it is mapped to the right place and displays a correct icon 
  - tapping a place without an osm id moves the map to its location
  - tapping a place with an osm id moves the map to its location and opens the place details panel
    - 'S Hauptbahnhof Berlin' => nodes/3856100106
    - 'Franklin Retirement Community' => nodes/-427484087
  - accessibility cloud places cannot be found in search
  - tapping removes the search and clears the search field and any filters
  - no old results are shown in the search results even if network is slow and a long search string is slowly typed
- 🖥  Browser(tab) title changes to indicate search results
  
## Place Details Panel

- the place details panel opens immediately when accessed from the map
  some additional data may be loaded dynamically
  - images
  - source/license information
  - full wheelmap place info
- reopening the place details for a fully loaded place will not trigger any
  new requests if this happens within the caching duration (currently infinity)
- tapping the 'close' button dismisses the place details panel
- place details are opened by selecting a place in search or from the map
- when closing place details, the filter is left unchanged
- tapping report problem opens report dialog
- tapping report problem opens report dialog
- TODO a11y
- 🖥  Browser(tab) title matches place name

### Scroll/Drag Interaction

- 🖥 the place details panel opens below the filter button / search field
- 🖥 the position of the details panel is fixed, and the content below the header scrolls if needed
- 📱 the place details opens as a card at the bottom of the screen and is partially open
- 📱 the place details can be dragged down to just show the header
- 📱 the place details can be dragged up to fully open
- a very long places container is 'TRYP Berlin Mitte' => nodes/vnDZSz73newE2WmnJ

### Basic information

- the place icon matches the icon seen on the map
- the place icon indicates the accessibility of the place with color & shape
- the place name and localized category are displayed

### Accessibility information

- when changing the accessibility of a place it is directly reflected in the place header and on the map immediately
- extended accessibility cloud widget is shown on places that have this information
- places with extended ac information is 'TRYP Berlin Mitte' => nodes/vnDZSz73newE2WmnJ
- a wheelmap place that has no accessibility defined 
  - has three rating buttons inline
  - selecting any value will open the wheelchair-a11y dialog with the selected value pre-selected. 
- a wheelmap place that has wheelchair a11y defined
  - will ask for the toilet status if the wheelchair a11y is at least partial (yellow)
    - selecting the cta will open the toilet-a11y dialog with no value preselected 
  - when selecting the edit/current wheelchair a11y will open the wheelchair-a11y dialog with the current value pre-selected

### Wheelchair accessibility dialog
- when no value is selected the submit button is disabled
- submit changes the wheelchair a11y and returns to the place details panel
- cancel returns to the place details

### Toilet accessibility dialog
- when no value is selected the submit button is disabled
- submit changes the toilet a11y and returns to the place details panel
- cancel returns to the place details

### Photo gallery

- shows all uploaded thumbnails of related place photos in an embedded gallery
- place with photos 
  - 'Cube 3' in Berlin, => nodes/4733951222 
  - 'Bunte Schokowelt' in Berlin => nodes/619366460
- tapping on photo open large lightbox
- tapping on the x closes lightbox
- 🖥 with the arrow keys images can be switched
- there is a report button for images uploaded to ac
  - selecting report opens the report image dialog
- TODO

### Additional Information

- address, phone number, website
- places with this data is 'TRYP Berlin Mitte' => nodes/vnDZSz73newE2WmnJ
- tapping 'open in osm'
  - if wheelmap place opens osm for this place in new tab
  - if ac place opens osm at the coordinates of this place in new tab 
- tapping 'open on \<original source\>' opens on place details defined in accessibility cloud
- iOS, macOS: tapping 'open in maps app' opens native maps application
- android: tapping 'open in maps app' opens native maps application

### Share

- tapping share expands into 5 share providers
  - facebook, twitter, telegram, whatsapp
    - 🖥 each of the links opens a new share window
    - 📱 each of the links opens the native app, if they are installed, otherwise the browser opens 
  - email
- tapping back collapses the 5 share providers
- closing the place details panel also resets expanded share providers 

### Source Information

- shows license and data provider for places coming from accessibility cloud
- place from 'Reisen für alle' is 'TRYP Berlin Mitte' => nodes/vnDZSz73newE2WmnJ

## Reporting

- TODO

## Image Uploading

- TODO

## Language

- The application respects the system or browser language settings
- All texts are translated (at least into german)
- // TBD rtl support
- // TBD very long string i18n tests

## Server Side Rendering

- Prerender with javascript disabled
 - correct language is detected from headers
- Open graph tags
- GoogleAnalytics integration
- Matomo integration
- Twitter Meta data
- Facebook Meta data

## Whitelabel support

- Application links
- Application name, tagline & logo
- 