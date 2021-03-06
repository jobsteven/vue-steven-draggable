## An easy pair of drag & drop vue directives, full-featured and whole lifecycle events supported.

#### v-steven-draggable 
 - `onDragStart` return value could be used as `dataTransfer` 
 - `onDragEnd(dragStatus)`

- dragStatus
  - top
  - left

#### v-steven-droppable 
 - `onDragEnter(dropStatus)` 
 - `onDragLeave(dropStatus)`
 - `onDragOver(dropStatus)`
 - `onDrop(dropStatus)` 

- dropStatus
  - dataTransfer
  - loc
    - top
    - left
   
#### preview

![demo](https://github.com/jobsteven/vue-steven-draggable/raw/master/steven-draggable.gif)

#### npm install

```javascript
npm install vue-steven-draggable
```

#### vue install

```javascript
import { createApp } from '@vue/runtime-dom';

import stevenDraggable from 'v-steven-draggable';
import App from './app';

const app = createApp(App);
app.use(stevenDraggable);

app.mount('#app');
```

#### v-steven-draggable

```html
<div class='inline-block w-40 h-40 border-2 border-dotted border-blue-500'>
  <!-- dragzone = parent -->
  <span v-steven-draggable>dragging target</span>

  <!-- customize dragzone-->
  <span
    class='inline-block w-8 h-8 bg-blue-500 select-none poiner'
    v-steven-draggable={{
      onDragStart,
      onDragEnd,
      dragZone: 'body' // querySelector
    }}
  ></span>
</div>
```

```javascript
function onDragStart() {
  const transferData = {
    name: 'alex',
    email: '166'
  };

  console.log('onDragStart', transferData);

  return transferData;
}

function onDragEnd(dragStatus) {
  console.log('onDragEnd', dragStatus);
}
```

#### v-steven-droppable

```html
<div
  class='helloworld inline-block w-40 h-40 border-2 border-dotted border-blue-500'
  v-steven-droppable={{
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop
  }}
></div>

```

```javascript
function onDragEnter(dropStatus) {
  console.log('onDragEnter', dropStatus);
}

function onDragOver(dropStatus) {
  console.log('onDragOver', dropStatus);
}

function onDragLeave(dropStatus) {
  console.log('onDragLeave', dropStatus);
}

function onDrop(dropStatus) {
  console.log('onDrop', dropStatus);
}
```
