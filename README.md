# Workspace-Tools

Tools to manage yarn workspace and git modules.

## Modules

Add this packge as a dependecy to the root workspace:

`yarn add @mauriora/workspace-tools --dev --ignore-workspace-root-check`

and execute the commands there:

```shell
PS C:\Users\Me\code\MauriOra\Announcements-Bar-Spfx> yarn loadModules shared/workspace-tools
```

- [(`Un`)]($unloadmodules)[`loadModules`](#loadmodules) scripts work on submodules already part of the root module (workspace).
After (un)loading it will call `yarn install`.
- `discardModules` ([`Changes`](#discardmoduleschanges)|[`Commit`]($discardmodulescommit)) help for instance when publishing failed.

### `loadModules`

(down)loads a module, wich is already part of the root workspace.

```shell
yarn loadModules .\shared\Package-Tools\
```

or

```shell
yarn loadModules shared/Package-Tools
```

### `unloadModules`

empties the working tree of a module already part of the root workspace.

```shell
yarn unloadModules .\shared\Package-Tools\
```

or

```shell
yarn unloadModules shared/Package-Tools
```

### `discardModulesChanges`

**discards all local changes** including **staged** changes for all **changed sub modules**.

```shell
yarn discardModulesChanges
```

### `discardModulesCommit`

**discards all local commits** that have **not been pushed** for all **sub modules adhead**.

```shell
yarn discardModulesCommit
```

## Publish

To publish a new version of this module, in this folder execute:

```shell
yarn publish --access public
```
