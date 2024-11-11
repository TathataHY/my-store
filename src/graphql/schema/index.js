const { loadFiles } = require('@graphql-tools/load-files');
const { typeDefs: scalarsTypeDefs } = require('graphql-scalars');

const loadTypeDefs = async () => {
  const loadedFiles = await loadFiles('./src/**/*.graphql');
  return [...loadedFiles, scalarsTypeDefs];
};

module.exports = loadTypeDefs();
