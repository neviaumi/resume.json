import { expect, test } from '@playwright/test';

import { formatDate } from '../date.helper.js';

test.describe('Date helper', () => {
  [
    { inputStr: '2014-05-01', resultStr: '05/14' },
    { inputStr: '1990-01-01', resultStr: '01/90' },
  ].forEach(({ inputStr, resultStr }) => {
    test(`format date ${inputStr}`, async () => {
      expect(formatDate(inputStr)).toStrictEqual(resultStr);
    });
  });
});
