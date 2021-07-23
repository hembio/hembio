module.exports = {
  client: {
    service: {
      name: "hembio",
      url: "http://localhost:4000/graphql",
      includes: ["./packages/apps/**/*.ts"],
      excludes: ["**/__tests__/**"],
    },
  },
};
