;(function(factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		factory(require('jquery'), window);
	} else {
		factory(jQuery, window);
	}
}(function($, window) {
	
	var priv = {
		init: function() {
			var $this = this;

			$this.set.initialContents = $this.set.useHTML ? $this.find('.' + $this.set.titleClass).children().clone() : $this.find('.' + $this.set.titleClass).text();
			priv.checkDisabledInputs.apply($this);
			priv.updateList.apply($this);
			priv.enableEvents.apply($this);
		},
		checkDisabledInputs: function() {
			var $this = this;
			var $inputDisabled = $this.find('input:disabled');

			if ($inputDisabled.length > 0) {
				$inputDisabled.each(function() {
					$(this).closest('li').addClass($this.set.disabledClass);
				});
			}
		},
		openList: function() {
			var $this = this;

			if ($this.set.useScreen) {
				$('#' + $this.set.screenID).show();
			} else if ($('.rekaf--opened').length > 0) {
				$this.trigger('rekaf.closed');
				$('.rekaf--opened').removeClass('rekaf--opened').css('z-index', $this.set.zIndex).find('ul').hide();
			}

			$this.addClass('rekaf--opened').css('z-index', ($this.set.zIndex + 2)).find('ul').show();
			$this.trigger('rekaf.opened');
		},
		closeList: function() {
			var $this = this;

			$this.trigger('rekaf.closed');
			$('.rekaf--opened').removeClass('rekaf--opened').css('z-index', $this.set.zIndex).find('ul').hide();
			if ($this.set.useScreen) {
				$('#' + $this.set.screenID).hide();
			}
		},
		updateList: function() {
			var $this = this;
			var contentList = [];

			$this.find('li').each(function(i) {
				var content = $(this).text();
				var innerText = '';

				if ($(this).hasClass($this.set.disabledClass) || $(this).find('.' + $this.set.disabledClass).length > 0) return;

				if ($this.set.useHTML) {
					content = $(this).find('a').length > 0 ? $(this).find('a').children().clone() : $li.children().clone().remove('input');
				} else if (content === '' && $(this).attr('title') !== undefined) {
					content = $(this).attr('title');
				}

				if ($(this).hasClass($this.set.selectedClass) || $(this).find('.' + $this.set.selectedClass).length > 0) {
					if ((!$this.set.multiselect && contentList.length === 0) || $this.set.multiselect) {
						contentList.push(content);
					} else {
						$(this).removeClass($this.set.selectedClass).find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
					}
				}
			});

			if (contentList.length > 0) {
				if ($this.set.useHTML) {
					$this.find('.' + $this.set.titleClass).empty();
					for (var i = 0; i < contentList.length; i++) {
						$this.find('.' + $this.set.titleClass).append(contentList[i]);
					}
				} else {
					innerText = (contentList.length > $this.set.multiselectTitleLimit) ? contentList.length + $this.set.multiselectTitleLimitText : contentList.join($this.set.delimiter);
					if (!$this.set.multiselect) innerText = contentList[0];
					$this.find('.' + $this.set.titleClass).text(innerText);
				}

				$this.trigger('rekaf.selected', [contentList]);
			} else {
				// Nothing selected return to default settings.
				if ($this.set.useHTML) {
					$this.find('.' + $this.set.titleClass).empty().append($this.set.initialContents);
				} else {
					$this.find('.' + $this.set.titleClass).text($this.set.initialContents);
				}

				$this.trigger('rekaf.unselected', []);
			}
		},
		resetList: function() {
			var $this = this;

			$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
			$this.removeClass($this.set.selectedClass).find('.' + $this.set.titleClass).text($this.set.initialContents);
			$this.trigger('rekaf.unselected', []);
			priv.updateList.apply($this);
			priv.closeList.apply($this);
		},
		enableEvents: function() {
			var $this = this;
			var touchStart = null;
			var touchClick = null;
			var winTouches = {
				move: false
			};

			touchClick = function() {
				if (winTouches.moved) return false;
				return (Math.abs(Math.abs(winTouches.startX) - Math.abs(winTouches.endX))) < 50 && (Math.abs(Math.abs(winTouches.startY) - Math.abs(winTouches.endY))) < 50;
			};

			//logging all touches on screen.
			$(window).on({
				touchstart: function(e) {
					$this.set.touch = true;
					winTouches.startX = e.originalEvent.targetTouches[0].clientX;
					winTouches.startY = e.originalEvent.targetTouches[0].clientY;
					winTouches.endX = e.originalEvent.targetTouches[0].clientX;
					winTouches.endY = e.originalEvent.targetTouches[0].clientY;
					winTouches.moved = false;
				},
				touchmove: function(e) {
					winTouches.endX = e.originalEvent.targetTouches[0].clientX;
					winTouches.endY = e.originalEvent.targetTouches[0].clientY;
					if (!touchClick()) {
						//You have moved away but you might move back.
						winTouches.moved = true;
					}
				}
			});

			$this.on('click', '.' + $this.set.titleClass, function(e) {
				e.stopPropagation();

				if (!$this.hasClass('rekaf--opened')) {
					priv.openList.apply($this);
				} else {
					priv.closeList.apply($this);
				}
			});

			$this.on('rekaf.resetSelect', function() {
				priv.resetList.apply($this);
			});

			$this.on('click', 'li', function(e) {
				var $li = $(this);
				var isSelected = $li.hasClass($this.set.selectedClass);
				var content = '';

				//Should select be added or removed?
				if ($li.find('a').length > 0 && $this.set.preventLinks) e.preventDefault();
				if ($li.find('.' + $this.set.disabledClass).length > 0 || $li.hasClass($this.set.disabledClass)) return;
				if ($li.find('.remove').length > 0) $this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);

				if ($this.set.multiselect === true) {
					if ($li.hasClass($this.set.selectedClass)) {
						$li.removeClass($this.set.selectedClass);
					} else {
						$li.addClass($this.set.selectedClass);
					}
				} else {
					$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);

					// If not selected or not click remove add class
					if (!isSelected || !$this.set.clickRemoveSelected) {
						$li.addClass($this.set.selectedClass);
					}
				}

				priv.updateList.apply($this);
				if (!$this.set.preventClose) {
					priv.closeList.apply($this);
				}
			});

			$('#' + $this.set.screenID).on('click', function() {
				priv.closeList.apply($this);
			});

			if (!$this.set.useScreen) {				
				$(document).on('click touchend', function(e) {
					//If list is opened and interaction is outside of the list.
					if ($this.hasClass('rekaf--opened') && $(e.target).closest('.rekaf--opened').length === 0) {
						//If touch enabled and touch is not a click return
						if ($this.set.touch === true && touchClick() === false) return;
						//hijack all clicks that aren't in rekaf menu.
						e.preventDefault();
						priv.closeList.apply($this);
					}
				});
			}

		}
	};

	var methods = {
		init: function(options) {

			var init = $.extend({}, defaultOpts, options);
			var bgColor = '';
			

			if (init.debug === true) {
				if (this.length === 0) {
					console.warn('No objects found for $.rekaf >>> Maybe not generated from JS yet?');
					return;
				}
				bgColor = 'background-color: blue; ';
			}

			//Create a screen
			if ($('#' + this.init.screenID).length === 0 && init.useScreen) $('body').prepend('<div id="' + this.init.screenID + '" style="position: fixed; top: 0; left: 0; ' + bgColor + 'width: 100%; height: 2000px; z-index: ' + (init.zIndex + 1) + '; display: none;"></div>');

			return this.each(function() {
				var $this = $(this),
					objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				if ($this.set.debug === true) {
					console.warn(':::: Rekaf Debug has been set to true ::::');
					console.log('Options -> ', $this.set);
				}

				//Make sure that the selects are of a higher z-index than the screen.
				if ($this.set.preventInlineStyles === false) {
					$this.css({
						'z-index': $this.set.zIndex,
						'position': 'relative'
					});
				}

				if (!$this.set.rekafIntiated) {
					priv.init.apply($this);
				} else if ($this.set.debug === true) {
					console.warn(':::: You are re-running REKAF!!! It is only intended to be run once, try update. ::::');
				}
				$this.set.rekafIntiated = true;
				$this.data($this.set);

			});
		},
		open: function(options) {
			var init = $.extend({}, defaultOpts, options);

			return this.each(function() {
				var $this = $(this),
					objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				priv.openList.apply($this);
			});
		},
		update: function(options) {
			var init = $.extend({}, defaultOpts, options);

			return this.each(function() {
				var $this = $(this),
					objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				priv.updateList.apply($this);

			});
		},
		reset: function(options) {
			var init = $.extend({}, defaultOpts, options);

			return this.each(function() {
				var $this = $(this);
				var objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				priv.resetList.apply($this);

			});
		}
	};

	var privateOpts = {
		rekafIntiated: false
	};

	var defaultOpts = {
		zIndex: 1500,
		mulitselect: false,
		useScreen: true,
		useHTML: false,
		touch: false,
		clickRemoveSelected: false,
		initialContents: '',
		screenID: 'rekafScreen',
		titleClass: 'rekaf-title',
		disabledClass: 'disabled',
		selectedClass: 'selected',
		multiselectTitleLimit: 4,
		multiselectTitleLimitText: ' items selected',
		delimiter: ', ',
		preventLinks: true,
		preventInlineStyles: false,
		preventClose: false,
		debug: false
	};

	$.fn.rekaf = function(method) {

		//Arguments local variable to all functions.
		if (methods[method]) {
			//If explicitly calling a method.
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			//If method is an "object" (can also be an array) or no arguments passed to the function.
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.rekaf');
		}

	};
	
}));
