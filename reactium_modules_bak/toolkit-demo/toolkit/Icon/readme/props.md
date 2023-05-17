## Properties

| Property       | Type       | Description                                                                       |
| -------------- | ---------- | --------------------------------------------------------------------------------- |
| **className**  | `String`   | Class name applied to the Icon container                                          |
| **color**      | `String`   | Set the Icon color                                                                |
| **controlled** | `Boolean`  | Set state to be controlled externally via props<br />**Default:** `false`         |
| **element**    | `Node`     | Read only. Reference to the `svg` element                                         |
| **ref**        | `Function` | Reference to the Icon component                                                   |
| **size**       | `Number`   | Valid css width/height value<br />**Default:** `24`                               |
| **value**      | `String`   | The Icon set and icon name as an object path<br />**Example**: `Feather.Activity` |

> Any additional props are passed to the `svg` element

### color

The Icon color can be set using the following values:

| Color                    |                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------: |
| **Icon.COLOR.DANGER**    |    <button className='btn-danger' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.DEFAULT**   |   <button className='btn-default' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.ERROR**     |     <button className='btn-error' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.INFO**      |      <button className='btn-info' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.PRIMARY**   |   <button className='btn-primary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.SECONDARY** | <button className='btn-secondary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.SUCCESS**   |   <button className='btn-success' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.TERTIARY**  |  <button className='btn-tertiary' style={{height: 12, width: 12, padding: 0 }} /> |
| **Icon.COLOR.WARNING**   |   <button className='btn-warning' style={{height: 12, width: 12, padding: 0 }} /> |
