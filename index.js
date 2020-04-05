const debug = require('debug')('wikipedia-traversing');
const { Graph } = require('graphlib');
const { getLinksFromPage } = require('./src/links');

const sourcePage = 'https://es.wikipedia.org/wiki/Adventure_Time';
const targetPage = 'https://es.wikipedia.org/wiki/Ringo_Starr';

debug(`Source: ${sourcePage}`);
debug(`Target: ${targetPage}`);

const wikipediaTree = new Graph({ compound: true });

debug('Starting');

// Set root node in Tree
wikipediaTree.setNode(sourcePage);

const elementsToVisit = [sourcePage];

function createTreeNodesFromURLs(urls, parentPage) {
  urls.forEach((url) => {
    const nodeExists = wikipediaTree.hasNode(url);

    if (nodeExists) {
      return;
    }

    wikipediaTree.setNode(url);
    wikipediaTree.setParent(url, parentPage);
  });
}

async function start() {
  while (!wikipediaTree.hasNode(targetPage)) {
    const currentElement = elementsToVisit.shift();

    // eslint-disable-next-line no-await-in-loop
    const links = await getLinksFromPage(currentElement);
    createTreeNodesFromURLs(links, currentElement);

    elementsToVisit.push(...links);
  }

  let currentURL = targetPage;
  const urlSteps = [currentURL];

  debug(`There are ${wikipediaTree.nodeCount()} nodes within the tree`);

  while (wikipediaTree.parent(currentURL)) {
    const parentURL = wikipediaTree.parent(currentURL);
    urlSteps.push(parentURL);
    currentURL = parentURL;
  }

  debug('Steps to follow from origin to target:');
  urlSteps.reverse().map((urlStep) => debug(`${urlStep}`));
}

start();
