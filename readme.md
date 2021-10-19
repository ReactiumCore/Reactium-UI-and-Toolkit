![](https://image.ibb.co/ee2WaG/atomic_reactor.png)

# Reactium UI & Toolkit Development Guide

Clone this repo and run:

```
$ npm install && npm run
```

You should now be running the Toolkit loaded with the most recent Reactium UI and Toolkit Demo components.

## Creating Reactium UI Components

Running the `arcli component` command will run an augmented version of the default command where the new component will be added to the Reactium UI **enums.js**/MANIFEST object used to generate the **manifest.json** file.

> When prompted for the component type, select **Reactium UI**

> When prompted for the directory, be sure to input **~/reactium_modules/@atomic-reactor/reactium-ui**.

## Creating Demo Elements

When creating new Toolkit Demo elements run the following command :

```
$ arcli toolkit element
```

> When prompted for the directory, be sure to select **~/reactium_modules/@atomic-reactor/toolkit-demo/toolkit**

## Publishing

After making changes to any of the plugins in the repo, you'll need to publish them to the Reactium Registry.

### Publishing Reactium UI

```
$ npm run publish:ui
```

### Publishing Toolkit

```
$ npm run publish:toolkit
```

### Publshing Toolkit Demo

```
$ npm run publish:demo
```

### Publish All

```
$ npm run pub
```
