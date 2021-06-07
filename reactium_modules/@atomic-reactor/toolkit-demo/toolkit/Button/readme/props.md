## Properties

| Property       | Type       | Description                                                                         |
| -------------- | ---------- | ----------------------------------------------------------------------------------- |
| **active**     | `Boolean`  | Set the Button state to active giving it the appearance of a Button that is focused |
| **appearance** | `String`   | Change the Button appearance                                                        |
| **block**      | `Boolean`  | Force the Button to stretch it's with to the size of it's parent container          |
| **color**      | `String`   | Set the Button color<br />**Default:** `Button.COLOR.PRIMARY`                       |
| **controlled** | `Boolean`  | Set state to be controlled externally via props<br />**Default:** `false`           |
| **href**       | `String`   | Used when specifying the `type` value to `link`                                     |
| **outline**    | `Boolean`  | Removes the background color                                                        |
| **ref**        | `Function` | Reference to the Button component                                                   |
| **readOnly**   | `Boolean`  | Change the Button pointer-event mode                                                |
| **size**       | `String`   | Set the size of the Button<br />**Default:** `Button.SIZE.SM`                       |
| **type**       | `String`   | Set the html button type<br />**Default:** `Button.TYPE.BUTTON`                     |

> Any additional properties are passed to the `button` container

### appearance

The Button component can take on the appearance of a rectangle or a pill

```
<Button appearance={Button.APPEARANCE.PILL}>
  Pill Button
</Button>
```

<button className='btn-primary-pill'>Pill Button</button>

### color

The Button color can be set using the following values:

| Color                      |                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------: |
| **Button.COLOR.DANGER**    |    <button className='btn-danger' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.DEFAULT**   |   <button className='btn-default' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.ERROR**     |     <button className='btn-error' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.INFO**      |      <button className='btn-info' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.PRIMARY**   |   <button className='btn-primary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.SECONDARY** | <button className='btn-secondary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.SUCCESS**   |   <button className='btn-success' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.TERTIARY**  |  <button className='btn-tertiary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.WARNING**   |   <button className='btn-warning' style={{height: 12, width: 12, padding: 0 }} /> |
| **Button.COLOR.CLEAR**     |     <button className='btn-clear' style={{height: 12, width: 12, padding: 0 }} /> |

```
<Button color={Button.COLOR.DANGER}>Dangerous Button</Button>
```

<button className='btn-danger'>Dangerous Button</button>

### controlled

By default, after the first render, the state is controlled internally and updates to the props will be ignored. You can change this behavior by setting the **controlled** value to `true`, causing the props to be the source of truth of the component. This will require you to listen to dispatched events and update the component's props accordingly.

### outline

The Button can take on a the appearance of an outlined button:

```

<Button outline>Outlined Button</Button>

```

<button className='btn-primary-outline'>Outlined Button</button>

### size

The Button size can be set using the following values:

| Size               |                                                |
| ------------------ | ---------------------------------------------: |
| **Button.SIZE.XS** | <button className='btn-primary-xs'>xs</button> |
| **Button.SIZE.SM** | <button className='btn-primary-sm'>sm</button> |
| **Button.SIZE.MD** | <button className='btn-primary-md'>md</button> |
| **Button.SIZE.LG** | <button className='btn-primary-lg'>lg</button> |

```
<Button size={Button.SIZE.MD}>Medium Button</Button>
```

<button className='btn-primary-md'>Medium Button</button>

### type

| Type                   | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| **Button.TYPE.BUTTON** | The button is a clickable button                                          |
| **Button.TYPE.LABEL**  | The button is a `label` enclosing a form input                            |
| **Button.TYPE.LINK**   | The button is an `anchor` with an `href`                                  |
| **Button.TYPE.RESET**  | The button is a reset button (resets the form-data to its initial values) |
| **Button.TYPE.SUBMIT** | The button is a submit button (submits form-data)                         |

```
<Button href='#' type={Button.TYPE.LINK}>Link Button</Button>
```

<a href='#' className='btn-primary-sm' style={{width: 145}}>Link Button</a>

```
<Button type={Button.TYPE.LABEL}>
    <input type='checkbox' /> Checkbox
</Button>
<Button type={Button.TYPE.LABEL}>
    <input type='radio' value={1} value={2} name='radio' /> Radio 1
</Button>
<Button type={Button.TYPE.LABEL}>
    <input type='radio' value={2} value={2} name='radio' /> Radio 2
</Button>
```

<div className='flex'>
<div>
<label className='btn-primary-sm mr-xs-12' style={{width: 145}}>
<input type='checkbox' />
<span className='ml-xs-12'>Checkbox</span>
</label>
</div>

<div>
<label className='btn-primary-sm mr-xs-12' style={{width: 145}}>
<input type='radio' name='radio' value={1} />
<span className='ml-xs-12'>Radio 1</span>
</label>
</div>

<div>
<label className='btn-primary-sm' style={{width: 145}}>
<input type='radio' name='radio' value={2} />
<span className='ml-xs-12'>Radio 2</span>
</label>
</div>
</div>
