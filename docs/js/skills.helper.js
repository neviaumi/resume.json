export function groupByKeyword(resumeSkills, keywords) {
  const skillAndLevels = resumeSkills.reduce(
    (acc, { keywords: skillNames, level }) => {
      skillNames.forEach(skillName => {
        if (!keywords.includes(skillName)) return;
        acc[skillName] = level;
      });
      return acc;
    },
    {},
  );
  keywords.forEach(keyword => {
    if (!skillAndLevels[keyword]) {
      skillAndLevels[keyword] = 'Unknown';
    }
  });
  return Object.entries(skillAndLevels);
}

export function sortSkills(skillGroupedByKeywords) {
  return skillGroupedByKeywords.sort(
    ([keywordA, keywordALevel], [keywordB, keywordBLevel]) => {
      const isKeyWordAMaster = keywordALevel === 'Master';
      const isKeyWordBMaster = keywordBLevel === 'Master';
      const isKeyWordAIntermediate = keywordALevel === 'Intermediate';
      const isKeyWordBIntermediate = keywordBLevel === 'Intermediate';
      const isKeyWordALevelUnknown = keywordALevel === 'Unknown';
      const isKeyWordBLevelUnknown = keywordBLevel === 'Unknown';

      if (isKeyWordAMaster && isKeyWordBMaster)
        return keywordA.localeCompare(keywordB);
      if (isKeyWordAIntermediate && isKeyWordBIntermediate)
        return keywordA.localeCompare(keywordB);
      if (isKeyWordALevelUnknown && isKeyWordBLevelUnknown)
        return keywordA.localeCompare(keywordB);
      if (isKeyWordALevelUnknown && !isKeyWordBLevelUnknown) return 1;
      if (isKeyWordBLevelUnknown && !isKeyWordALevelUnknown) return -1;
      if (isKeyWordAMaster) return -1;
      return 1;
    },
  );
}
