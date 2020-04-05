const debug = require('debug')('wikipedia-traversing');
const { Graph } = require('graphlib');
const { getLinksFromPage } = require('./src/links');

const initialPage = 'https://es.wikipedia.org/wiki/Juego_de_mesa';
const targetPage = 'https://es.wikipedia.org/wiki/Adventure_Time';

const wikipediaTree = new Graph({ compound: true });

debug('Starting');

// Set root node in Tree
wikipediaTree.setNode(initialPage);

const elementsToVisit = [initialPage];

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

async function whileFunction() {
  while (!wikipediaTree.hasNode(targetPage)) {
    const currentElement = elementsToVisit.shift();

    // eslint-disable-next-line no-await-in-loop
    const links = await getLinksFromPage(currentElement);
    createTreeNodesFromURLs(links, currentElement);

    elementsToVisit.push(...links);
  }

  let currentURL = targetPage;

  console.log('Hemos recorrido', wikipediaTree.nodes().length, 'páginas');

  console.log('Pasos del crawler:');
  console.log(currentURL);
  while (wikipediaTree.parent(currentURL)) {
    const parentURL = wikipediaTree.parent(currentURL);
    console.log(parentURL);
    currentURL = parentURL;
  }
}

whileFunction();
