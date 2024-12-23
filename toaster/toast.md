# Toaster

Toast notification utility

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
    text: 'toast text'.
    button: [
        {
            label: 'button label',
            id: 'button1', //if not specified will use label name instead
            onClick: () => { whatever() },
            highlight: true, //true to highlight the button
        }, 
        {
            label: 'button label 2',
            onClick: () => { ... }
        },
        //in theory there is no limit to how many buttons you could fit
        //but, you do you.
    ]
}, {
    //settings params
    tone: 'fade',
    duration: 2000,
    position: 'center',
    interactive: false,
    skippable: false,
    hold: false,
})
```
## Content parameters
- `title: 'string'` Notification header
- `text: 'string'` Main message
- `icon: 'string'` Icons
> By default, `warn` and `stop` is a built in icon set. But you could use custom local icons by putting the icons inside of `./toaster/icons` folder.  
> 
> `icon` will use the **filename as the lookup**, this is to prevent link breakage by using bundlers.  
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
- `iconUrl: 'string'` Externally sourced image, why not.
- `button`: Array of button objects
```js
//each button has the following params:
button: [
    {
        label: 'string',
        onClick: () => {}, //function
        id: 'string', //optional
        highlight: 'true' //optional
    }
]
```

## Settings params
- `tone: 'string'`
> Available animation presets:
> - `fade` fade in `default`
> - `bounce` bounces in
> - `shake` shakes
> - `error` shakes and makes the toast red

- `duration: int`
> Display duration  
> `2000ms` `default`

- `position: 'string'`
> - center `default`

> - top
> - bottom
> - left
> - right

> - top_left
> - top_right

> - bottom_left
> - bottom_right

- `interactive: bool`
> ⚠️ This will nullify `duration`.  
> Toast will stay on screen until user clicked anywhere on the screen.

- `skippable: bool`
> ⚠️ This will nullify `interactive`.  
> Toast will still disappear after the designated duration, but the user can immediately close by clicking anywhere on the screen.
- `hold: bool`
> ⚠️ This will nullify ALL `duration`, `interactive`, `skippable`.  
> A method to programmatically dismiss or clear the toast queue.
>   
> ℹ️ using either `toastDismiss()` or `toastClear()` tied in a function somewhere is a requirement, otherwise the toast will **Never** disappear.
> ```js
> $someGodKnowsWhatElement.addEventListener('click', () => toastDismiss())