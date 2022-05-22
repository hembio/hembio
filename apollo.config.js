module.exports = {
  client: {
    service: {
      name: "hembio",
      url: "https://hembio.local:3443/graphql",
      includes: ["./packages/apps/**/*.ts"],
      excludes: ["**/__tests__/**"],
    },
  },
};
