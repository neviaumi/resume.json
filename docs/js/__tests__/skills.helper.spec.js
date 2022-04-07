import { expect, test } from '@playwright/test';

import { groupByKeyword, sortSkills } from '../skills.helper.js';

test.describe('Skills helper', () => {
  [
    {
      input: {
        keywords: ['TDD', 'Cypress', 'Playwright', 'Integration Test', 'Mocha'],
        skills: [
          {
            keywords: ['TDD', 'Unit Test', 'Jest', 'Cypress'],
            level: 'Master',
            name: 'Automated testing',
          },
          {
            keywords: ['Playwright', 'Integration Test'],
            level: 'Intermediate',
            name: 'Automated testing',
          },
        ],
      },
      result: [
        ['TDD', 'Master'],
        ['Cypress', 'Master'],
        ['Playwright', 'Intermediate'],
        ['Integration Test', 'Intermediate'],
        ['Mocha', 'Unknown'],
      ],
    },
    {
      input: {
        keywords: ['TDD', 'Cypress', 'Playwright', 'Integration Test', 'Mocha'],
        skills: [
          {
            keywords: ['Playwright', 'Integration Test'],
            level: 'Intermediate',
            name: 'Automated testing',
          },
          {
            keywords: ['TDD', 'Unit Test', 'Jest', 'Cypress'],
            level: 'Master',
            name: 'Automated testing',
          },
        ],
      },
      result: [
        ['Playwright', 'Intermediate'],
        ['Integration Test', 'Intermediate'],
        ['TDD', 'Master'],
        ['Cypress', 'Master'],
        ['Mocha', 'Unknown'],
      ],
    },
  ].forEach(({ input, result }, index) => {
    test(`#${index} Mapping keywords with skill levels`, async () => {
      expect(groupByKeyword(input.skills, input.keywords)).toStrictEqual(
        result,
      );
    });
  });

  [
    {
      input: [
        ['Playwright', 'Intermediate'],
        ['Integration Test', 'Intermediate'],
        ['TDD', 'Master'],
        ['Cypress', 'Master'],
        ['Mocha', 'Unknown'],
      ],
      result: [
        ['Cypress', 'Master'],
        ['TDD', 'Master'],
        ['Integration Test', 'Intermediate'],
        ['Playwright', 'Intermediate'],
        ['Mocha', 'Unknown'],
      ],
    },
    {
      input: [
        ['Playwright', 'Intermediate'],
        ['TDD', 'Master'],
        ['Mocha', 'Unknown'],
        ['Integration Test', 'Intermediate'],
        ['Cypress', 'Master'],
      ],
      result: [
        ['Cypress', 'Master'],
        ['TDD', 'Master'],
        ['Integration Test', 'Intermediate'],
        ['Playwright', 'Intermediate'],
        ['Mocha', 'Unknown'],
      ],
    },
  ].forEach(({ input, result }, index) => {
    test(`#${index} Sorting skills`, async () => {
      expect(sortSkills(input)).toStrictEqual(result);
    });
  });
});
