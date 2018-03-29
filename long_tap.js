/**
 * Title:   jquery.longclick.plugin
 * Link:    https://github.com/kugimiya/jquery.longclick.plugin
 * Author:  Andrey Goncharov, aka @kugimiya
 * Version: 1.2.1
 * License: no license; use as you wish
 */

(function ($) {

    var _globalState = false;
    var _selected = 0;

    var longTapInstanceLogic = function (options) {
        return function (key, self) {

            var timeout = options.timeout || 500,
                onStartDelay = options.onStartDelay || 0,
                onEndDelay = options.onEndDelay || 50,
                mouseEvents = options.mouseEvents || false,
                touchEvents = options.touchEvents || false,
                enableQuickSelect = options.enableQuickSelect || false,
                $self = $(self),
                clickState = false,
                commonState = false,
                dummyClick = false,
                eventState = '',
                timer,
                onStartTimer;

            var timeoutCallback = function (event) {
                if (!commonState) {
                    if (options.onSuccess) {
                        options.onSuccess(event, $self);

                        _selected += 1;
                    }
                } else {
                    if (options.onReject) {
                        options.onReject(event, $self);

                        _selected -= 1;
                    }
                }

                if (_selected == 0) {
                    _globalState = false;
                }

                clickState = (!clickState);
                commonState = (!commonState);

                callOnEnd(event);
            };

            var onStartDelayCallback = function (event, type) {
                if (dummyClick) {
                    callOnEnd(event);
                    return;
                }

                if (options.onStart) {
                    options.onStart(event, $self);
                }

                if (clickState) {
                    clickState = (!clickState);
                }

                if (type === 'timeout') {
                    timeoutCallback
                    eventState = 'processing';
                    timer = setTimeout(timeoutCallback, timeout, event);
                    clearTimeout(onStartTimer);
                } else {
                    timeoutCallback(event);
                }
            };

            var startUp = function (event, type) {
                if (type === 'timeout') {
                    onStartTimer = setTimeout(onStartDelayCallback, onStartDelay, event, type);
                } else {
                    onStartDelayCallback(event, type);
                }
            }

            var startEventHandler = function (event) {
                eventState = 'start';

                if (enableQuickSelect) {
                    if (!_globalState) {
                        _globalState = true;

                        startUp(event, 'timeout');
                    } else {
                        startUp(event, 'without timeout');
                    }

                } else {
                    startUp(event, 'timeout');
                }
            };

            var endEventHandlerLogic = function (event) {
                var canIEndThis = (
                    (!clickState) &&
                    (
                        (typeof (onStartTimer) == typeof (undefined)) ||
                        (typeof (timer) != typeof (undefined))
                    )
                );

                if (canIEndThis) {
                    callOnEnd(event);
                } timeoutCallback

                clearTimeout(timer);
            }

            var endEventHandler = function (event) {
                setTimeout(endEventHandlerLogic, onEndDelay, event);
            };

            var registerClick = function (event) {
                if (eventState == 'start') {
                    dummyClick = true;
                }
            }

            var callOnEnd = function (event) {
                if (options.onEnd && (dummyClick != true)) {
                    options.onEnd(event, $self, commonState);
                }

                dummyClick = false;
                eventState = 'ended';
            }

            var callOnContext = function (event) {
                if (options.onContext) {
                    options.onContext(event, $self);
                }
            }

            if (mouseEvents && (!touchEvents)) {
                $self.on('mousedown', startEventHandler);
                $self.on('mouseup', endEventHandler);
            }

            if (touchEvents && (!mouseEvents)) {
                $self.on('touchstart', startEventHandler);
                $self.on('touchend', endEventHandler);
            }

            $self.on('contextmenu', callOnContext);
            $self.on('click', registerClick);
        }
    }

    $.fn.longTap = function (options = {
        onStart,
        onSuccess,
        onReject,
        onEnd,
        onContext,
        enableQuickSelect,
        onStartDelay,
        onEndDelay,
        timeout,
        mouseEvents,
        touchEvents
    }) {
        return this.each(longTapInstanceLogic(options));
    }

})(jQuery);

