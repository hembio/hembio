# hembio monorepo

This is the main [Yarn v2][yarn] monorepo for hembio.

## Tech stack

- [Node.js v14][node] or later
- Backend:
  - [Nestjs v7][nestjs]
  - [MikroORM v4][mikroorm]
  - [Mercurius v8][mercurius]
- Frontend:
  - [React v17][react]
  - [Material UI v5][material-ui]
- Tooling:
  - [Yarn v2][yarn]
  - [Jest][jest]
  - [Vite v2][vite]
  - [Electron v13][electron]

## File structure

```
packages
   |
   ├── apps
   |    ├── desktop     // Electron-powered desktop app
   |    ├── mobile      // TBD
   |    ├── server      // Standalone server
   |    ├── web         // React + Vite
   |    └── xbox        // TBD
   |
   ├── configs
   |    ├── babel       // Shared babel config
   |    ├── eslint      // Shared eslint config
   |    ├── typescript  // Shared tsconfig
   |    └── webpack     // Shared webpack config
   |
   ├── libs
   |    ├── core        // Core functionality and data entities
   |    ├── discovery   // Network zero-config
   |    ├── fs          // Experimental FS wrapper
   |    ├── matcher     // Filename matcher
   |    ├── mediainfo   // Mediainfo wrapper
   |    └── logger      // Shared Pino logger
   |
   └── services
        ├── api         // API gateway
        ├── images      // Images microservice
        ├── indexer     // Indexer microservice
        └── transcoder  // Transcoder microservice
```

[node]: https://nodejs.org/en/download/
[nestjs]: https://nestjs.com/
[mikroorm]: https://mikro-orm.io/
[mercurius]: https://mercurius.dev/
[vite]: https://vitejs.dev/
[react]: https://reactjs.org/
[material-ui]: https://next.material-ui.com/
[electron]: https://www.electronjs.org/
[yarn]: https://yarnpkg.com/
[jest]: https://jestjs.io/
