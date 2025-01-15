import { test } from '@playwright/test';

export function skipOnMobiles() {
  if (test.info().project.name.match(/mobile/i)) {
    test.skip(true, 'Skipped on mobiles');
  }
}
export function skipOnDesktops() {
  if (!test.info().project.name.match(/mobile/i)) {
    test.skip(true, 'Skipped on desktops');
  }
}