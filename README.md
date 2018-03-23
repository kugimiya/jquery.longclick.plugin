# Long-click (or tap) plugin for jQuery

This plugin allows you to manipulate events like "long tap" or "long click".

For example:

```
$('.long-tap').longTap({
    onStart: (event, self) => {
      console.log('onStart')
    },
    onSuccess: (event, self) => {
      console.log('onSuccess')
    },
    onReject: (event, self) => {
      console.log('onReject')
    },
    onEnd: (event, self) => {
      console.log('onEnd')
    },
    mouseEvents: true
  });
```