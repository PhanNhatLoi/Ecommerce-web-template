const plugins = [];
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-react-remove-prop-types');
}
module.exports = {
  presets: ['react-app'],
  plugins: [
    ...plugins,
    ['macros'], // for font awesome
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathPrefix: '~',
            rootPathSuffix: 'src/'
          }
        ]
      }
    ],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-syntax-dynamic-import'],
    [
      'transform-imports',
      {
        lodash: {
          transform: 'lodash-es/${member}',
          preventFullImport: true
        }
      }
    ]
  ]
};
