# Toaster

Toast notification utility by Potto.

## Quirks

- Adjustable positioning
- Preset animations and styles (You could create customs)
- Queue system for multiple notifications
- Interactive buttons support
- Configurable icons and timing
- Skippable notifications

## Usage & Configs
```js
toastPush({
    //content params
    title: 'Title',
    text: 'toast text',
    icon: 'warn', // optional, predefined icons like 'warn', 'stop'
    iconUrl: 'path/to/icon.png', // optional, custom icon URL
    button: [
        {
            label: 'Button Text',
            onClick: () => { /* button click handler */ },
            highlight: true // optional, highlight the button
        }
    ]
}, {
    //settings params
    tone: 'fade', // optional, animation tone like 'fade', 'bounce', 'shake', 'error'
    duration: 2000, // optional, duration in milliseconds
    delay: 0, // optional, delay before showing the toast
    position: 'center', // optional, position preset or {x, y} object
    hold: false, // optional, if true, the toast won't auto-dismiss
    interactive: true, // optional, if true, the toast is interactive
    skippable: false, // optional, if true, the toast can be skipped
    forceVerticalButtons: false, // optional, force buttons to be vertical
    noWidthLimit: false, // optional, remove width limit on toast content
    onQueue: () => { /* function to call when toast is queued */ },
    onInteract: () => { /* function to call when toast is interacted with */ }
});
```

## Functions

### `toastPush(content, settings)`

Pushes a new toast notification to the queue.

- `content` (object): The content of the toast.
  - `title` (string): The title of the toast.
  - `text` (string): The text content of the toast.
  - `icon` (string): Optional. Predefined icon name like 'warn', 'stop'.
  - `iconUrl` (string): Optional. Custom icon URL.
  - `button` (array): Optional. Array of button objects.
    - `label` (string): The text of the button.
    - `onClick` (function): The click handler for the button.
    - `highlight` (boolean): Optional. If true, highlights the button.

- `settings` (object): The settings for the toast.
  - `tone` (string): Optional. The animation tone ('fade', 'bounce', 'shake', 'error').
  - `duration` (number): Optional. The duration in milliseconds.
  - `delay` (number): Optional. The delay before showing the toast.
  - `position` (string|object): Optional. The position preset or {x, y} object.
  - `hold` (boolean): Optional. If true, the toast won't auto-dismiss.
  - `interactive` (boolean): Optional. If true, the toast is interactive.
  - `skippable` (boolean): Optional. If true, the toast can be skipped.
  - `forceVerticalButtons` (boolean): Optional. Force buttons to be vertical.
  - `noWidthLimit` (boolean): Optional. Remove width limit on toast content.
  - `onQueue` (function): Optional. Function to call when toast is queued.
  - `onInteract` (function): Optional. Function to call when toast is interacted with.

### `toastDismiss()`

Dismisses the current toast notification.

### `toastClear()`

Clears the toast queue and dismisses the current toast notification.

### `resetTimers()`

Resets all timers related to the toast notifications.

### `applyStyles(element, styles)`

Applies the given styles to the specified element.

### `setPosition(position)`

Sets the position of the toast notification based on the given position preset or coordinates.

### `configureButtons(buttons, forceVerticalButtons)`

Configures the buttons for the toast notification.

### `resolveIconUrl(iconFileName)`

Resolves the URL for the given icon file name.

### `nextQueue()`

Processes the next toast notification in the queue.
