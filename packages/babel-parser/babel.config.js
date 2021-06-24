module.exports = {
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-flow", { allowDeclareFields: true }],
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}