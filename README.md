# Long-click (or tap) plugin for jQuery (yep)

This plugin allows you to manipulate events like "long tap" or "long click".

For example:

```
$('.long-tap').Longtap({
    // longtap time
    timeout: 1000,

    // delay before timeeout start
    onStartDelay: 250,

    // onStart callback
    onStart: (event, self) => {
      console.log('on START');
    },

    // onSucces callback, fired when item got selected
    onSuccess: (event, self) => {
      console.log('on SUCC');
    },

    // onStop callback, fired when longtap cancelled
    onStop: (event, self) => {
      console.log('on STOP');
    },

    // onReject callback, fired when item got unselected
    onReject: (event, self) => {
      console.log('on REJECT');
    },

    // click event callback
    onClick: (event, $self) => {
      console.log('on CLICK');
    },

    // text select event callback
    onSelect: (event, $self) => {
      console.log('on SELECT');
    },

    // context menu event callback
    onContext: (event, $self) => {
      console.log('on CONTEXT');
    },

    // enable quick selection mode (no timeout after first selection)
    // default true
    allowQuickMode: true,

    preventClick: true,
    preventSelect: true,
    preventContext: true
});
```
