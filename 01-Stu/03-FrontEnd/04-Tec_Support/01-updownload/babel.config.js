// 1. presets新增["@babel/preset-env", { modules: false }]
// 2. 新增 plugins: [ [ "component", { libraryName: "element-ui", styleLibraryName: "theme-chalk" } ] ]
module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    ["@babel/preset-env", { modules: false }]
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};