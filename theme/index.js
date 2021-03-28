const theme = require('jsonresume-theme-macchiato');

/**
 * Can use for print html also if https://github.com/jsonresume/resume-cli/pull/537 merged
 * */
module.exports = {
  ...theme,
  pdfRenderOptions: {
    format: 'A4',
    margin: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    mediaType: 'print',
    pdfViewport: 'width=device-width, initial-scale=1, minimal-ui',
  },
};
