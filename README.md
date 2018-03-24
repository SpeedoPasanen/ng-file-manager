# Angular File Manager

- A file manager for Angular which will feature:
    - Router Support
    - Angular Material design UI/UX
    - Easy file picker dialog (pluggable to TinyMCE etc...)
    - Swappable API connectors
        - In-memory connector for testing & getting started quickly
        - REST connector for the out-of-the-box Express app/middleware: [ng-file-manager-express](https://github.com/funkizer/ng-file-manager-express)
        - Write your own? Toss me a message at [Gitter](https://gitter.im/ng-file-manager/Lobby) if you need help!
    - Multiple root directories (eg. private/personal, public, etc.)
    - Localization
    - Customizability powered by Angular Material Theming
    - More ...
- On the ToDo-list:
    - More connectors - popular cloud storages etc.
    - Better documentation, tutorials, examples

##  WIP
Things may change a bit on the NgfmConnector side if you want to make your own connectors, but other than that you could probably already pop this into an app.

Demo: https://funkizer.github.io

[![ng-file-manager Gitter https://gitter.im/ng-file-manager/Lobby](https://badges.gitter.im/ng-file-manager/Lobby.svg)](https://gitter.im/ng-file-manager/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


# Get Started
1. If you don't have an Angular project, create one by running `ng new my-project`.
2. Say `npm install ng-file-manager --save` in your project's root folder.
3. Follow the guide at https://material.angular.io for installing Angular Material and a theme. TODO: I may come back to this later and say it's not necessary unless you want to add a custom theme, needs further investigation.
4. Provide an `NgfmConnector` in your AppModule. If you use the built-in REST connector, provide also the configuration for it. While developing and using `ng serve`, provide a full absolute URL (using environment would be more ideal than this example): 
```
import NgfmRestConnector from 'ngfm-file-browser';
// @NgModule
providers: [
    {
      provide: NGFM_REST_CONFIG, useValue: new NgfmRestConfig({
        baseUrl: 'http://localhost:3000/files'
      })
    },
    { provide: NGFM_CONNECTOR, useClass: NgfmRestConnector },
  ]
```

## Support & Questions
Feel free to give me a shout at [Gitter](https://gitter.im/ng-file-manager/Lobby)!

Twitter: [@funkizer](https://twitter.com/funkizer)