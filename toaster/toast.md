# Toaster

Toast notification utility by Potto.

## Quirks

- Adjustable positioning
- Preset animations and styles (You could create customs)
- Queue system for multiple notifications
- Interactive buttons support
- Configurable icons and timing
- Skippable notifications
- *Supposedly* compatible with most web bundlers.

## Usage & Configs
### No need NPM
Simply put the package into the root path (or anywhere) and reference it appropriately with `import` in any other one of your scripts:
  
```js
//imGonnaMakeAnAnnouncement.js
import { toastPush, toastDismiss, toastClear } from "pathTo/toast"

toastPush({
    //content params
    title: 'Shadow the hedgehog',
    text: 'Is a ***** *** ************'.
    icon: 'warn', // (OPTIONAL) use predefined icons (see more in documentation)
    iconUrl: 'path/to/icon.png', // (OPTIONAL) use external icon, why not right?
    button: [
        {
            label: `he ****** on my ******* wife, that's right`,
            id: 'button1', //(OPTIONAL) if not specified will use label name instead
            onClick: () => { whatever() },
            highlight: true, //(OPTIONAL) highlights the button
        }, 
        {
            label: 'he took his hedghog ******* quilly- You get the point.',
            onClick: () => { ... }
        },
        //in theory there is no limit to how many buttons you could fit
        //but, you do you.
    ]
}, {
    //settings params
    //defaults:
    tone: 'fade',                   //animation presets
    duration: 2000,                 //duration in ms
    delay: 0,                       //delay before display
    position: 'center',             //position preset or {x, y} object
    hold: false,                    //stays on screen unless called toastDismiss()
    interactive: true,              //requires user input (click) to dismiss
    skippable: false,               //allows skipping (ignores duration) on click
    forceVerticalButtons: false,    //force vertical button layout
    noWidthLimit: false,            //remove width limit on toast content
    onQueue: () => { ... },         //immediately executes a function on display
    onInteract: () => { ... }       //executes a function on interaction
})
```
Good to go.

## Content parameters
- `title: 🟨'string'` Notification header
---
- `text: 🟨'string'` Main message
---
- `icon: 🟨'string'` Icons  

> The package includes `warn` and `stop` icons by default. For custom icons, place your image files in the `./toaster/icons` folder.  

> ℹ️ param `icon` will use the **filename as the lookup**, this is to prevent link breakage by using bundlers.  
>
> ex: the icon name is `something.png`  
> fill the `icon` parameter as `something`

```js
pushToast({
    title: 'A title about something',
    text: 'Something about something',

    //something.png -> something
    icon: 'something'
})
```
🚫 Should not co-exist with `iconURL`, it will override each other. (most bottom overwrites)

---
- `iconUrl: 🟨'string'` Externally sourced image, why not.  

🚫 Should not co-exist with `icon`, it will override each other. (most bottom overwrites)

---
- `button: 🟥[array]` Button objects
```js
//each button has the following params:
button: [
    {
        label: 'string',
        id: 'string', //optional, left blank will use the label name instead
        highlight: 'true' //optional, highlights the button
        onClick: () => {}, //optional, execute something
    }
]
```
ℹ️ if `onClick` was not specified, it will only act as a `toastDismiss()`.

---

## Settings params
- `tone: 🟨'string'` Animation presets
> Available animation presets:
> - `fade` fade in `default`
> - `bounce` bounces in
> - `shake` shakes
> - `error` shakes and makes the toast red
---
- `duration: 🟪int` 
> Display duration  
> `2000ms` `default`
---
- `position: 🟨'string'` `🟧{object}`
> - center `default`

> - top
> - bottom
> - left
> - right

> - top_left
> - top_right

> - bottom_left
> - bottom_right

Optionally if you would like to be precise, you could use the `{x, y}` object:
```js
{
    position: {x: 69, y: 420} //very funny
}
```

---
- `interactive: 🟦bool`
> ⚠️ This will nullify `duration`.  
> Toast will stay on screen until user clicked anywhere on the screen.
>
> 🟢 Should only be paired with `onInteract()`
---
- `skippable: 🟦bool`
> ⚠️ This will nullify `interactive`.  
> Toast will still disappear after the designated duration, but the user can immediately close by clicking anywhere on the screen.
---
- `hold: 🟦bool`
> ⚠️ This will nullify ALL `duration`, `interactive`, `skippable`.  
> A method to programmatically dismiss or clear the toast queue.

> ❗🟢 using either `toastDismiss()` or `toastClear()` tied in a function somewhere **is required**, otherwise the toast will **Never** disappear.
> ```js
> $someGodKnowsWhatElement.addEventListener('click', () => toastDismiss())
---
- `forceVerticalButtons: 🟦bool`  
> Simply forces the button layout to be vertical, can naturally be seen when there's more than 2 buttons.
---
- `noWidthLimit: 🟦bool`
> Simply removes the default `300px` width limit for the toast content.
---
- `onQueue: 🟩(event) => {}` 
> Executes something immediately when a toast gets displayed