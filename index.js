const axios = require('axios');
const debug = require('debug')('wikipedia-traversing');

debug('Starting');

// Create Graph
const { Graph } = require('graphlib');
