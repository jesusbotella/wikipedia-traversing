const axios = require('axios');
const cheerio = require('cheerio');

function filterUnwantedLinks(link) {
  const containsHashtag = link.indexOf('#') > -1;
  const containsColon = link.indexOf(':') > -1;
  const isArticlePage = link.indexOf('/wiki/') > -1;

  return !containsHashtag && !containsColon && isArticlePage;
}

function concatURLOrigin(urlObject) {
  return function concatOrigin(link) {
    if (link[0] === '/') {
      return urlObject.origin + link;
    }

    return link;
  };
}

function getLinksFromDOMNodes(pageContent) {
  const $ = cheerio.load(pageContent.data);
  const pageLinks = [];

  $('a', '#bodyContent').each((_, value) => {
    const link = $(value).attr('href');

    if (!link) {
      return;
    }

    pageLinks.push(link);
  });

  return pageLinks;
}

exports.getLinksFromPage = async function getLinksFromPage(url) {
  const pageContent = await axios.get(url);
  const urlObject = new URL(url);

  return getLinksFromDOMNodes(pageContent)
    .filter(filterUnwantedLinks)
    .map(concatURLOrigin(urlObject));
};
