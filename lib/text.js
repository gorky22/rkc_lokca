/** Turns stored HTML into a short plain-text excerpt for cards and previews. */
function excerpt(html, max = 160) {
  if (!html) return '';
  const text = String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8222;|&#8220;/g, '„')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max) > 0 ? text.lastIndexOf(' ', max) : max) + '…';
}

module.exports = { excerpt };
