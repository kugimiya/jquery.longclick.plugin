/**
 * Title:   jquery.longclick.plugin
 * Link:    https://github.com/kugimiya/jquery.longclick.plugin
 * Author:  Andrey Goncharov, aka @kugimiya
 * Version: 2.1.1
 * License: no license; use as you wish
 */

(function ($) {

    $.fn.Longtap = function (args) {

        var plugin = function () {

            var pluginInstanceStorage = {
                selected: 0,
                quickMode: false,
                allowQuickMode: args.allowQuickMode || true
            }

            var preventClick = args.preventClick || true;
            var preventSelect = args.preventSelect || true;
            var preventContext = args.preventContext || true;

            return function (key, self) {
                var $self = $(self);
                $self.storage = pluginInstanceStorage;

                var timer = undefined;
                var startTimer = undefined;

                var isSelected = false;
                var isPreStart = false;

                var isTapStart = false;
                var isTapStartStamp = 0;

                var clearingTimers = function (variable, variableClearCallback, event, stop) {
                    if (!!variable) {
                        variableClearCallback();

                        if (args.onStop) {
                            if (stop == true) {
                                args.onStop(event, $self);
                            }
                        }
                    }
                };

                var timeouts = {
                    mainDelay: args.timeout || 1000,
                    mainDelayClear: function () {
                        clearTimeout(timer);
                        timer = undefined;
                    },

                    onStartDelay: args.onStartDelay || 10,
                    onStartDelayClear: function () {
                        clearTimeout(startTimer);
                        startTimer = undefined;
                    },
                };

                var handlers = {
                    success: function (event) {

                        if (isSelected) {
                            pluginInstanceStorage.selected--;

                            if (args.onReject) {
                                args.onReject(event, $self);
                            }

                            if (pluginInstanceStorage.selected == 0) {
                                pluginInstanceStorage.quickMode = false;
                            }
                        } else {
                            pluginInstanceStorage.selected++;

                            if (args.onSuccess) {
                                args.onSuccess(event, $self);
                            }

                            if (pluginInstanceStorage.allowQuickMode) {
                                if (pluginInstanceStorage.selected > 0) {
                                    pluginInstanceStorage.quickMode = true;
                                }
                            }
                        }

                        isSelected = !isSelected;
                        isPreStart = false;

                        timeouts.mainDelayClear();
                    },

                    stop: function (event) {
                        clearingTimers(startTimer, timeouts.onStartDelayClear, event);
                        clearingTimers(timer, timeouts.mainDelayClear, event, true);
                    },

                    clickOverride: function (event) {
                        if (args.onClick) {
                            args.onClick(event, $self);
                        }

                        if (preventClick) {
                            events.killEvent(event);
                        }
                    },

                    selectOverride: function (event) {
                        if (args.onSelect) {
                            args.onSelect(event, $self);
                        }

                        if (preventSelect) {
                            events.killEvent(event);
                        }
                    },

                    contextOverride: function (event) {
                        if (args.onContext) {
                            args.onContext(event, $self);
                        }

                        if (preventContext) {
                            events.killEvent(event);
                        }
                    }
                };

                var events = {
                    killEvent: function (event) {
                        event.preventDefault();
                        return;
                    },

                    scrolling: function (event) {
                        // prevent stopping, if tap started
                        if (isPreStart == false) {
                            handlers.stop(event);
                        }

                        // if 'click' start, but we scroll
                        if (isTapStart) {
                            isTapStart = false;
                        }
                    },

                    tapStart: function (event) {
                        isTapStart = true;
                        isTapStartStamp = performance.now();

                        startTimer = setTimeout(function () {
                            event.preventDefault();
                            isPreStart = true;

                            if (args.onStart) {
                                args.onStart(event, $self);
                            }

                            timer = setTimeout(handlers.success, timeouts.mainDelay, event);
                            timeouts.onStartDelayClear();
                        }, timeouts.onStartDelay);
                    },

                    tapEnd: function (event) {
                        if (isTapStart) {
                            isTapStart = false;

                            // if 'click' happen
                            if ((performance.now() - isTapStartStamp) <= 300) {
                                if (pluginInstanceStorage.quickMode) {
                                    handlers.success(event);
                                }
                            }
                        }

                        if (event.cancelable) {
                            event.preventDefault();
                        }
                        handlers.stop(event);
                    }
                };

                $self.on('touchmove', events.scrolling);

                // todo: killevent moving from there to proxies
                $self.on('click', handlers.clickOverride);
                $self.on('contextmenu', handlers.contextOverride);
                $self.on('selectstart', handlers.selectOverride);

                $self.on('touchstart', events.tapStart);
                $self.on('touchend', events.tapEnd);

            }
        }

        return this.each(plugin());

    }

})(jQuery);
