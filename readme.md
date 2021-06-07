Use this codebase to make changes to the [Reactium UI](#reactium-ui), [Toolkit](#toolkit) and [Toolkit Demo](#toolkit-demo) plugins.

## Reactium UI

Make updates to the Reactium UI plugin in the **~/reactium_modules/@atomic-reactor/reactium-ui** directory.

If you're adding or deleting a component to Reactium UI, be sure to update the **~/reactium_modules/@atomic-reactor/reactium-ui/enums.js** `MANIFEST` object then run the following command:

```
$ arcli rui-manifest
```

This will generate a new **~/reactium_modules/@atomic-reactor/reactium-ui/index.js**.

### Reactium UI: Manifest

The **manifest.json** file is used to generate a new **index.js** file. We do this to control the bundle size of Reactium UI.

In cases where you may want a slimmer version of Reactium UI, you can edit the bundle using `arcli rui-manifest` and selecting which portions to omit.

> **DO NOT** directly edit the **manifest.json** or the **index.js** file. Doing so could cause for your changes to be overwritten when someone else runs the `arcli rui-manifest` command.

### Reactium UI: Publish

Navigate to the Reactium UI plugin source directory and run the publish command:

```
$ cd /reactium_modules/@atomic-reactor/reactium-ui
$ arcli publish
```

> Before you publish be sure to update the plugin's package.json with any dependencies

## Toolkit

Make updates to the Toolkit plugin in the **~/reactium_modules/@atomic-reactor/toolkit** directory.

### Toolkit: Sidebar

You can create a sidebar element by running the following command:

```
$ arcli toolkit sidebar
```

This will generate the boiler plate code for a sidebar element.

You can also manually create a sidebar element:

```
// reactium-hooks.js

import Reactium from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    if (!Reactium.Toolkit) return;

    const { MenuLink } = Reactium.Component.get('RTK');

    Reactium.Toolkit.Sidebar.register('my-link', {
        order: 1,
        children: 'My Link'
        component: MenuLink,
        url: '/toolkit/my-link',
    });
});
```

> Using the RTK.MenuLink component wraps your sidebar element in a stylized container. If the sidebar element is a group heading, it will have the menu toggle button applied.

A new element will be added to the sidebar as well as the **/toolkit/my-link** route with a component zone of `my-link`.

The zone value is a slugified version of the **url** value excluding the **/toolkit** prefix.

In cases where the url is a sub-page like: **/toolkit/my-link/sub-page** the zone would be `my-link-sub-page`.

To create a sub-link, specify the group value as the registered ID of another link:

```
...
Reactium.Toolkit.Sidebar.register('my-link-sub-page', {
    order: 1,
    children: 'My Link Sub Page'
    component: MenuLink,
    url: '/toolkit/my-link/sub-page',
    group: 'my-link',
});
```

### Toolkit: Element

You can create an element by running the following command:

```
$ arcli toolkit element
```

You can also manually create an element:

```
// reactium-hooks.js

import React from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const MyElement = () => {
    const { Element } = useHookComponent('RTK');

    return (
        <Element title='Icon'>
            Hello World!
        </Element>
    );
};

Reactium.Hook.register('plugin-ready', () => {
    if (!Reactium.Toolkit) return;

    Reactium.Toolkit.Elements.register('my-element', {
        zone: 'my-link',
        component: MyElement,
        order: Reactium.Enums.priority.low,
    });
});
```

> Using the **RTK.Element** component wraps the Toolkit UI around your element, adding the toolbar and sidebar as window chrome.

### Toolkit: Documentation

You can add markdown style documentation to any Toolkit element by using the **RTK.Markdown** component and a .md file:

#### some-readme.md

```
## MyElement

Enter some valid markdown syntax here
```

#### MyElement.js

```
import React from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';
import readme from './some-readme.md';

const MyElement = () => {
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element title='My Element'>
            Hello World!
            <Markdown value={readme} />
        </Element>
    );
};
```

### Toolkit: Publish

Navigate to the Toolkit plugin source directory and run the publish command:

```
$ cd /reactium_modules/@atomic-reactor/toolkit
$ arcli publish
```

> Before you publish be sure to update the plugin's package.json with any dependencies

## Toolkit Components

-   CodeEditor
-   [ComponentDemo](#componentdemo)
-   Element
-   Markdown

### ComponentDemo

When creating elements you can make use of the **ComponentDemo** component which creates a UI with a demo, attribute inspector, and code editor.

![ComponentDemo Screenshot](https://i.imgur.com/mkUZYJ1.png)

**Properties**

| Property      | Type     | Description                                                      |
| ------------- | -------- | :--------------------------------------------------------------- |
| **Demo**      | `Node`   | The component to display in the component demo zone              |
| **Editor**    | `Node`   | The component to display in the code editor zone                 |
| **Inspector** | `Node`   | The component to display in the inspector zone                   |
| **value**     | `Object` | The attributes to assign to the component, inspector, and editor |

```
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const Demo = () => ('The Demo');
const Editor = () => ('The Editor');
const Inspector = () => ('The Inspector');

const UsageExample = () => {
    const { Element, ComponentDemo } = useHookComponent('RTK');

    const defaultValue = {
        some: 'params',
        for: 'the demo',
    };

    return (
        <Element title='Usage'>
            <ComponentDemo
                Demo={Demo}
                Editor={Editor}
                value={defaultValue}
                Inspector={Inspector}
            />
        </Element>
    );
};
```

> See the [Alert/Usage](https://github.com/Atomic-Reactor/Reactium-UI-and-Toolkit/blob/master/reactium_modules/%40atomic-reactor/toolkit-demo/toolkit/Alert/Usage/index.js) component for an advanced usage example.

### Element

The **Element** component wraps the Toolkit UI around your element, adding the toolbar and sidebar as window chrome.

![Element component](https://i.imgur.com/qeUW3q8.png)

**Properties**

| Property       | Type      | Description                                                               |
| -------------- | --------- | :------------------------------------------------------------------------ |
| **children**   | `Node`    | Component to render in the content zone                                   |
| **className**  | `String`  | CSS class name to apply to the container div                              |
| **fullscreen** | `Boolean` | When set to `true` the title and toolbar are hidden. **Default:** `false` |
| **title**      | `Node`    | The title component or text                                               |
| **toolbar**    | `Node`    | The toolbar component                                                     |

## Toolkit Demo

The Toolkit Demo showcases and documents the Reactium UI components. Make updates to the Toolkit Demo plugin in the **~/reactium_modules/@atomic-reactor/toolkit-demo** directory.

### Creating Elements

You should create elements for the toolkit demo in the **~/reactium_modules/@atomic-reactor/toolkit-demo/toolkit** directory.

> See [Toolkit: Element](#toolkit-element) for creating elements.
