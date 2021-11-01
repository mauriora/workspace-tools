# Workspace-Tools

Tools to manage yarn workspace and git modules.

## Modules

Add this packge as dependecy of the root workspace and execute the commands there.

(`Un`)`loadModules` scripts work on submodules already part of the root module (workspace).
After (un)loading it will call `yarn install`.

### loadModules

This (down)loads a module already part of the root workspace.

```shell
yarn loadModules .\shared\Package-Tools\
```

or

```shell
yarn loadModules shared/Package-Tools
```

### unloadModules

This empties the working tree of a module already part of the root workspace.

```shell
yarn unloadModules .\shared\Package-Tools\
```

or

```shell
yarn unloadModules shared/Package-Tools
```

## Publish

In this folder execute:

```shell
yarn publish --access public
```
