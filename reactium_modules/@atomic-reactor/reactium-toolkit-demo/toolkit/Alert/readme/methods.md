## Methods

| Method                       | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| **dismiss()**                | Hides the Alert and triggers the `dismiss` event         |
| **get(**path**:[`String`])** | Get internal `state` object                              |
| **hide()**                   | Hides the Alert and triggers the `hide` event            |
| **set(**state**:`Object`)**  | Set internal `state` object                              |
| **show()**                   | Shows the Alert and triggers the `show` event            |
| **toggle()**                 | Hides or shows the Alert and triggers the `toggle` event |

### get()

The **get** method allows you to retrieve the internal state.

```
// Return the entire internal state object
const { dismissible } = alertRef.current.get();
```

Specifying an object path will retrieve a targeted portion of the internal state.

```
// Return a single value
const dismissible = alertRef.current.get('dismissible');
```

### set()

The **set** method allows you to update the internal state.

```
// Set multiple values
alertRef.current.set({ dismissible: false, visible: false });
```

Specifying an object path will set a targeted portion of the internal state.

```
// Set a single value
alertRef.current.set('dismissible', false);
```
