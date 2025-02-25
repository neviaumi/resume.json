// helpers.test.js

import { describe, expect, it } from 'vitest';

import { date, skills } from './helpers.js';

describe('helpers.js', () => {
  // Tests for date
  describe('date.formatDate', () => {
    it('should format a valid date string', () => {
      const formattedDate = date.formatDate('2023-01-01');
      expect(formattedDate).toBe('Jan 2023');
    });

    it('should handle an invalid date string gracefully', () => {
      const formattedDate = date.formatDate('invalid-date');
      expect(formattedDate).toBe('Invalid Date');
    });
  });

  // Tests for skills
  describe('skills.categorizeKeywordsBySkillLevel', () => {
    it('should correctly categorize keywords by skill level', () => {
      const keywords = ['JavaScript', 'TypeScript', 'UnknownSkill'];
      const resumeSkills = [
        { keywords: ['JavaScript', 'React'], level: 'Expert' },
        { keywords: ['TypeScript', 'NodeJS'], level: 'Intermediate' },
      ];

      const result = skills.categorizeKeywordsBySkillLevel(
        keywords,
        resumeSkills,
      );

      expect(result).toEqual({
        Expert: ['JavaScript'],
        Intermediate: ['TypeScript'],
        Unknown: ['UnknownSkill'],
      });
    });

    it('should return an empty object for no input', () => {
      const result = skills.categorizeKeywordsBySkillLevel([], []);
      expect(result).toEqual({
        Unknown: [],
      });
    });
  });

  describe('skills.excludeHighlightedSkills', () => {
    it('should exclude highlighted skills', () => {
      const highlightedSkills = ['JavaScript', 'React'];
      const filterFunction = skills.excludeHighlightedSkills(highlightedSkills);

      const result = ['JavaScript', 'TypeScript', 'React'].filter(token =>
        filterFunction(token),
      );

      expect(result).toEqual(['TypeScript']);
    });
  });

  describe('skills.highlightedSkillsFirst', () => {
    it('should correctly sort highlighted skills first', () => {
      const highlightedSkills = ['React'];
      const sortFunction = skills.highlightedSkillsFirst(highlightedSkills);

      const sortedSkills = ['JavaScript', 'React', 'TypeScript'].sort(
        sortFunction,
      );

      expect(sortedSkills).toEqual(['React', 'JavaScript', 'TypeScript']);
    });
  });

  describe('skills.includeHighlightedSkills', () => {
    it('should include only highlighted skills', () => {
      const highlightedSkills = ['JavaScript', 'React'];
      const filterFunction = skills.includeHighlightedSkills(highlightedSkills);

      const result = ['TypeScript', 'JavaScript', 'React'].filter(
        filterFunction,
      );

      expect(result).toEqual(['JavaScript', 'React']);
    });
  });
});
