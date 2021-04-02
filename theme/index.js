const theme = require('jsonresume-theme-macchiato');

/**
 * Can use for print html also if https://github.com/jsonresume/resume-cli/pull/537 merged
 * */
module.exports = {
  ...theme,
  pdfRenderOptions: {
    preferCSSPageSize: true,
  },
};
