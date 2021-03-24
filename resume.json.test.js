const resume = require('./resume.json');

const { describe, expect, it } = require('@jest/globals');
const resumeSchema = require('resume-schema');
const { promisify } = require('util');

describe('Validate json resume', () => {
  it('Should have validate json resume', async () => {
    const report = await promisify(resumeSchema.validate)(resume);
    expect(report).toStrictEqual({
      valid: true,
    });
  });
});
