import { configureAxe } from "jest-axe";

// configure a global axe-object
// individual rules can be added in a setup/teardown process
// or in a beforeEach/afterEach process

export const axe = configureAxe({
  // all default options
  rules: {
    // disable landmark rules when testing isolated components.
    region: { enabled: true },
    // for demonstration only, don't disable rules that need fixing.
    "image-alt": { enabled: true },
  },
});
