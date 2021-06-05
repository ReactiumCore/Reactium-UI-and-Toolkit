Use this codebase to make changes to the Reactium UI, Toolkit and Toolkit Demo components.

## Reactium UI

Make updates to the Reactium UI in the **~/reactium_modules/@atomic-reactor/reactium-ui** directory.

If you're adding or deleting a component to Reactium UI, be sure to update the **~/reactium_modules/@atomic-reactor/reactium-ui/enums.js** `MANIFEST` object then run the following command:

```
$ arcli rui-manifest
```

This will generate a new **~/reactium_modules/@atomic-reactor/reactium-ui/index.js**.

## Reactium UI Manifest

The **manifest.json** file is used to generate a new **index.js** file. We do this to control the bundle size of Reactium UI.

In cases where you may want a slimmer version of Reactium UI, you can edit the bundle using `arcli rui-manifest` and selecting which portion to omit.

> **DO NOT** directly edit the **manifest.json** or the **index.js** file. Doing so could cause for your changes to be overwritten when someone else runs the `arcli rui-manifest` command.
