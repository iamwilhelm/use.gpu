process.env.BROWSERSLIST_IGNORE_OLD_DATA = 1;
module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "chrome": 102,
        "firefox": 102,
      },
      "modules": process.env.MODULE_ENV === 'cjs' ? 'commonjs' : false,
    }],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ]
}
