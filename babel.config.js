module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: ["react-native-reanimated/plugin"],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
    ],
    //'react-native-reanimated/plugin'
  ],
};
