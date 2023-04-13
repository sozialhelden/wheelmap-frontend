/**
 * @jest-environment jsdom
 */
import { configureAxe, toHaveNoViolations } from "jest-axe";
import { axe } from "../helpers/axe-helper";
expect.extend(toHaveNoViolations);

/**
 * This is an example of a failing test. The image has no alt-text, so it should fail.
 * This is also an example of how to use the axe helper to test isolated components.
 */
describe("Example Jest Axe Test", () => {
  it("should always fail because the image has no alt-text", async () => {
    const render = () => '<img src="#" />';

    // pass anything that outputs html to axe
    const html = render();

    const results = await axe(html, {
      rules: {
        // disable landmark rules when testing isolated components.
        region: { enabled: false },
      },
    });

    expect(await results).toHaveNoViolations();
  });
});
