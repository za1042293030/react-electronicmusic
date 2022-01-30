const {
  override,
  addLessLoader,
  addWebpackAlias,
  fixBabelImports
} = require("customize-cra");

const path = require("path");

function pathResolve(pathUrl) {
  return path.join(__dirname, pathUrl);
}
module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1379cc'
    }
  }),
  addWebpackAlias({
    "@": pathResolve("./src")
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
);