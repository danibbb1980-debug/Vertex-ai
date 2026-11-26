import data from '../assets/logo-data.json';

/** Marcação das definições do logo (usada no prerender e, em dev, injetada pelo cliente). */
export const logoDefsHtml = () =>
  `<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs>` +
  `<symbol id="bb-pear" viewBox="${data.symbolViewBox}">${data.pear}</symbol>` +
  `<symbol id="bb-logo" viewBox="${data.viewBox}">${data.pear}<path d="${data.l1}"/><path d="${data.l2}"/></symbol>` +
  `</defs></svg>`;
