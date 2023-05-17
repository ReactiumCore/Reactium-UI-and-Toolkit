## Properties

| Property        | Type            | Description                                                                          |
| --------------- | --------------- | ------------------------------------------------------------------------------------ |
| **autoDismiss** | `String/Number` | Dismiss the Alert after the specified time in milliseconds<br />**Default:** `false` |
| **color**       | `String`        | Accent color of the Alert<br />**Default:** `primary`                                |
| **controlled**  | `Boolean`       | Set state to be controlled externally via props<br />**Default:** `false`            |
| **children**    | `Node`          | The content of the Alert                                                             |
| **dismissible** | `Boolean`       | Show the dismiss button<br />**Default:** `true`                                     |
| **icon**        | `String/Node`   | Display an icon before the Alert content                                             |
| **onDismiss**   | `Function`      | Execute the specified function when the Alert is dismissed                           |
| **onHide**      | `Function`      | Execute the specified function when the Alert is hidden                              |
| **onShow**      | `Function`      | Execute the specified function when the Alert is shown                               |
| **onToggle**    | `Function`      | Execute the specified function when the Alert is hidden or shown                     |
| **ref**         | `Function`      | Reference to the component instance                                                  |
| **refs**        | `Collection`    | Internal reference collection                                                        |
| **style**       | `Object`        | Apply styles to the Alert container div                                              |
| **visible**     | `Boolean`       | Hide/Show the Alert when it is initially rendered<br />**Default:** `true`           |

### autoDismiss

When specifying **autoDismiss** if the value is `true` the time will default to 5000 ms.

```
<Alert autoDismiss={true}>Hello!</Alert>
```

### color

The Alert color can be set using the following values:

| Color                     |                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------: |
| **Alert.COLOR.DANGER**    |    <button className='btn-danger' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.DEFAULT**   |   <button className='btn-default' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.ERROR**     |     <button className='btn-error' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.INFO**      |      <button className='btn-info' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.PRIMARY**   |   <button className='btn-primary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.SECONDARY** | <button className='btn-secondary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.SUCCESS**   |   <button className='btn-success' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.TERTIARY**  |  <button className='btn-tertiary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Alert.COLOR.WARNING**   |   <button className='btn-warning' style={{height: 12, width: 12, padding: 0 }} /> |

```
<Alert color={Alert.COLOR.SUCCESS}>A success alert!</Alert>
```

<div className="ar-alert ar-alert-success" style="width: 100%;">
    <div className="ar-alert-content">A success alert!</div>
</div>

### controlled

By default, after the first render, the state is controlled internally and updates to the props will be ignored. You can change this behavior by setting the **controlled** value to `true`, causing the props to be the source of truth of the component. This will require you to listen to dispatched events and update the component's props accordingly.

### icon

When specifying **icon** the value can be any valid <a href='/toolkit/Icon' className='danger'>**Icon Component**</a> name `String` or a renderable `Object`.

```
<Alert icon='Feather.AlertOctagon'>Alert Text</Alert>
<Alert icon={<span>+</span>}>Alert Text</Alert>
```
