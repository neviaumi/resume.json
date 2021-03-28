const theme = require('jsonresume-theme-macchiato');

/**
 * Can use for print html also if https://github.com/jsonresume/resume-cli/pull/537 merged
 * */
module.exports = {
  ...theme,
  pdfRenderOptions: {
    format: 'a4',
    margin: 0, // https://github.com/puppeteer/puppeteer/issues/393
    mediaType: 'print',
    preferCSSPageSize: true,
  },
};
