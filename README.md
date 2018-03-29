# Long-click (or tap) plugin for jQuery

This plugin allows you to manipulate events like "long tap" or "long click".

For example:

```
$('.long-tap').longTap({
    // will called at the moment, when main timer started
    onStart: (event, self) => {
      console.log('onStart')
    },

    // will be called at the moment, when taps sets to active state
    onSuccess: (event, self) => {
      console.log('onSuccess')
    },

    // will be called at the moment, when taps sets to inactive state
    onReject: (event, self) => {
      console.log('onReject')
    },

    // will be called at the moment, when taps got ended
    onEnd: (event, self) => {
      console.log('onEnd')
    },
    
    // will be called when context menu displayed
    onContext: (event, self) => {
      console.log('onContext')
    },
    
    // if true, quick select mode will be used (selecting without delay)
    enableQuickSelect: true,

    // if true, touch events will be ignored
    mouseEvents: true,

    // if true, mouse events will be ignored
    touchEvents: false,

    // timeout, aka, main timer
    timeout: 1000,

    // delay before actual execution
    onStartDelay: 100,

    // delay before a call onEnd
    onEndDelay: 50
});
```
