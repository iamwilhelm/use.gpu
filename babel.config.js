module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "chrome": 102,
        "firefox": 102,
      },
      "modules": process.env.MODULE_ENV === 'umd' ? 'commonjs' : false,
    }],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ]
}
