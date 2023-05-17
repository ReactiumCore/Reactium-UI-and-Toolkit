## Methods

| Method                       | Description                 |
| ---------------------------- | --------------------------- |
| **get(**path**:[`String`])** | Get internal `state` object |
| **set(**state**:`Object`)**  | Set internal `state` object |

### get()

The **get** method allows you to retrieve the internal state.

```
// Return the entire internal state object
const { value } = iconRef.current.get();
```

Specifying an object path will retrieve a targeted portion of the internal state.

```
// Return a single value
const value = iconRef.current.get('value');
```

### set()

The **set** method allows you to update the internal state.

```
// Set multiple values
iconRef.current.set({ value: 'Feather.Activity', size: 24 });
```

Specifying an object path will set a targeted portion of the internal state.

```
// Set a single value
iconRef.current.set('value', 'Feather.Activity');
```
