module.exports = {
  client: {
    service: "hembio",
    url: "https://hembio.local:3443/api/graphql",
    includes: ["./src/**/*.ts"],
    excludes: ["**/__tests__/**"],
  },
};
