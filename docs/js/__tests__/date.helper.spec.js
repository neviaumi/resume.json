import { expect, test } from '@playwright/test';

import { formatDate } from '../date.helper.js';

test.describe('Date helper', () => {
  [
    { inputStr: '2014-05-01', resultStr: 'May 2014' },
    { inputStr: '1990-01-01', resultStr: 'Jan 1990' },
  ].forEach(({ inputStr, resultStr }) => {
    test(`format date ${inputStr}`, async () => {
      expect(formatDate(inputStr)).toStrictEqual(resultStr);
    });
  });
});
