(() => {
  $('.long-tap').longTap({
    onStart: (event, self) => {
      console.log('onStart')
      self.css({backgroundColor: 'red'})
    },
    onSuccess: (event, self) => {
      console.log('onSuccess')
      self.css({border: '2px solid black'})
    },
    onReject: (event, self) => {
      console.log('onReject')
      self.css({border: 'unset'})
    },
    onEnd: (event, self) => {
      console.log('onEnd')
      self.css({backgroundColor: 'unset'})
    },
    onStartDelay: 100,
    timeout: 500,
    mouseEvents: true
  });
})();