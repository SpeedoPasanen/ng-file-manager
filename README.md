# Angular File Manager

- A file manager for Angular which will feature:
    - Router Support
    - Angular Material design UI/UX
    - Easy file picker dialog (pluggable to TinyMCE etc...)
    - Extendable API connectors
    - In-memory connector for testing & getting started quickly
    - Multiple root directories (eg. private/personal, public, etc.)
    - Localization
    - Customizability as far as Material Theming goes. Off course you can override styles if you want.
    - More ...
- Some time in further future:
    - ExpressJS middleware / router for the backend
    - More ...

##  WIP
Not all functionalities have been implemented yet and there likely will be breaking changes. Try at your own risk - not ready for production.

Demo: https://funkizer.github.io

[![Join the chat at https://gitter.im/ng-file-manager/Lobby](https://badges.gitter.im/ng-file-manager/Lobby.svg)](https://gitter.im/ng-file-manager/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


# Get Started
1. If you don't have an Angular project, create one by running `ng new my-project`.
2. Say `npm install ng-file-manager --save` in your project's root folder.
3. Follow the guide at https://material.angular.io for installing Angular Material and a theme. TODO: I may come back to this later and say it's not necessary unless you want to add a custom theme, needs further investigation.
4. Provide an `NgfmConnector` in your AppModule, eg: `providers: [{ provide: NGFM_CONNECTOR, useClass: NgfmMemoryConnector }, ...]`

Documentation will be improved later. In the meantime, feel free to give me a shout at [Gitter](https://gitter.im/ng-file-manager/Lobby)!
