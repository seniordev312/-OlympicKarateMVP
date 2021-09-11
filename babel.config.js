module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@services': './src/services',
          '@utils': './src/utils',
          '@common': './src/common.ts',
          '@shared': './src/shared/index.ts',
          '@store': './src/store/index.ts',
          '@models': './src/models/index.ts',
          '@routes': './src/Routes.ts',
        },
      },
    ],
  ],
};
