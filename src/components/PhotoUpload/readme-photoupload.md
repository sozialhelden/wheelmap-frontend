# Notes on implementing the upload photo feature

- MainView
  ...
  - [x] NodeToolbar
  - [x] BasicAccessibility <- component with details on a Feature's a11y
  - ...
  - [S] PhotoUploadButton <- Needs to be tabbable
    - [S] Name
    - [S] MotivationHint
  - [x] ThumbnailList <- Photowall with
    - [x] Gallery
    - [x] Lightbox
  - [ ] UploadConfirmation
  - [x] NodeFooter
    - [ ] LinkList <- list of blue utility links
    - [ ] ButtonList  <- With icons

- [ ] PhotoUploadInstructionsToolbar <- does not need to be modal, but could be
  - [.] CloseLink <- Could be named "CloseButton"
  - header <- check styles in other components
  - ul
      - li

  - [ ] Checkbox
  - [.] CTA-Buttons <- look at AccessibilityEditor
    - [.] button.link-button button.negative-button "Cancel"
    - [.] button.link-button button.primary-button "Continue"
  - [?] UploadPhotoCaptchaToolbar <- Henrik is working on this. Needs audio / speech accessibility
