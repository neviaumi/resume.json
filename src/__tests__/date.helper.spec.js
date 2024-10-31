import { describe, expect, test } from 'vitest';

import { formatDate } from '../date.helper.js';

describe('Date helper', () => {
  [
    { inputStr: '2014-05-01', resultStr: 'May 2014' },
    { inputStr: '1990-01-01', resultStr: 'Jan 1990' },
  ].forEach(({ inputStr, resultStr }) => {
    test(`format date ${inputStr}`, async () => {
      expect(formatDate(inputStr)).toStrictEqual(resultStr);
    });
  });
});
