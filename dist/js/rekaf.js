;(function($, window) {
	
	var priv = {
		init: function() {
			var $this = this;

			priv.enableEvents.apply($this);
			priv.checkInputs.apply($this);
		},
		checkInputs: function() {
			var $this = this;
			var $inputChecked = $this.find('input:checked');
			var $anchorSelected = $this.find('li.' + $this.set.selectedClass).filter(':first');
			var $inputDisabled = $this.find('input:disabled');
			var text = '';
			var $li;

			if($inputChecked.length > 0 || $anchorSelected.length > 0) {
				$li = $inputChecked.length > 0 ? $inputChecked.closest('li') : $anchorSelected;
				text = $li.text();
				if(text === '' && $li.attr('title') !== undefined) text = $li.attr('title');
				$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
				$li.addClass($this.set.selectedClass);
				$this.addClass($this.set.selectedClass).find('span').first().text(text);
				$this.trigger('rekaf.selected', [text]);
			}

			if($inputDisabled.length > 0) {
				$inputDisabled.each(function() {
					$(this).closest('li').addClass('disabled');
				});
			}
		},
		openList: function() {
			var $this = this;

			if($this.set.useScreen) {
				$('#rekaf-screen').show();
			} else {
				if($('.rekaf-opened').length > 0) {
					$this.trigger('rekaf.closed');
					$('.rekaf-opened').removeClass('rekaf-opened').css('z-index', $this.set.zIndex).find('ul').hide();
				}
			}
			$this.addClass('rekaf-opened').css('z-index', ($this.set.zIndex + 2)).find('ul').show();
			$this.trigger('rekaf.opened');
		},
		closeList: function() {
			var $this = this;

			$this.trigger('rekaf.closed');
			$('.rekaf-opened').removeClass('rekaf-opened').css('z-index', $this.set.zIndex).find('ul').hide();
			if($this.set.useScreen) {
				$('#rekaf-screen').hide();
			}
		},
		updateList: function() {
			var $this = this;
			var text = '';
			var textList = $this.data('textList') || [];

			$this.find('li').each(function(i) {
				var currentItem = $(this).text();
				var inListAtIndex = null;

				if(currentItem === '' && $(this).attr('title') !== undefined) currentItem = $(this).attr('title');

				for (var j = 0; j < textList.length; j++) {
					if(currentItem === textList[j]) {
						inListAtIndex = j;
						break;
					}
				}

				if($(this).hasClass($this.set.selectedClass)) {
					//Check that it's in the array if not add it.
					if(inListAtIndex === null) {
						if($this.set.debug === true) console.log('textList, currentItem, inListAtIndex push item', textList, currentItem, inListAtIndex);
						textList.push(currentItem);
					}
				} else {
					//Check that it's not in the array, if it is remove it.
					if(inListAtIndex !== null) {
						if($this.set.debug === true) console.log('textList, currentItem, inListAtIndex splice item', textList, currentItem, inListAtIndex);
						textList.splice(inListAtIndex, 1);
					}
				}
			});

			if(textList.length > 0) {
				if($this.set.multiselect) {
					text = (textList.length > $this.set.multiselectTitleLimit) ? textList.length + $this.set.multiselectTitleLimitText : textList.join($this.set.delimiter);
					$this.find('span').first().text(text);
					$this.trigger('rekaf.selected', [textList]);
				} else {
					$this.find('span').first().text(textList[0]);
					$this.trigger('rekaf.selected', [textList]);
				}

			} else {
				//Nothing selected return to default settings.
				$this.find('span').first().text($this.find('span').first().data('orig-text'));
				$this.trigger('rekaf.unselected', [textList]);
			}

			$this.data('textList', textList);

		},
		resetList: function() {
			var $this = this;
			var text = '';

			$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
			$this.removeClass($this.set.selectedClass).find('span').first().removeClass($this.set.selectedClass).text($this.find('span').first().data('orig-text'));
			$this.trigger('rekaf.unselected', [text]);
			$this.data('textList', []);
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
				if(winTouches.moved) return false;
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
					if(!touchClick()) {
						//You have moved away but you might move back.
						winTouches.moved = true;
					}
				}
			});

			$this.on('click', 'span', function() {
				if(!$this.hasClass('rekaf-opened')) {
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
				var textList = $this.data('textList') || [];
				var isSelected = $li.hasClass($this.set.selectedClass);
				var innerText = $li.text();

				if(innerText === '' && $li.attr('title') !== undefined) innerText = $li.attr('title');

				if($li.find('a').length > 0 && $this.set.preventLinks) e.preventDefault();
				if($li.find('.' + $this.set.disabledClass).length > 0 || $li.hasClass($this.set.disabledClass)) return;
				if($li.find('.remove').length > 0) $this.removeClass($this.set.selectedClass);

				if($this.set.multiselect === true) {
					
					if($li.hasClass('clear-select') || $li.find('.remove').length > 0) {
						$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
						textList = [];
						text = '';
					} else {
						if($li.hasClass($this.set.selectedClass)) {
							$li.removeClass($this.set.selectedClass);
							for (var i = 0; i < textList.length; i++) {
								if(textList[i] === innerText) {
									textList.splice(i, 1);
									break;
								}
							}
						} else {
							$li.addClass($this.set.selectedClass);
							textList.push(innerText);
						}
						
						text = (textList.length > $this.set.multiselectTitleLimit) ? textList.length + $this.set.multiselectTitleLimitText : textList.join($this.set.delimiter);
					}

					if(textList.length > 0) {
						$this.addClass($this.set.selectedClass).find('span').first().addClass($this.set.selectedClass).text(text);
						$this.trigger('rekaf.selected', [text]);
					} else {
						$this.removeClass($this.set.selectedClass).find('span').first().removeClass($this.set.selectedClass).text($this.find('span').first().data('orig-text'));
						$this.trigger('rekaf.unselected', [text]);
					}

				} else {

					textList[0] = innerText;

					$this.find('.' + $this.set.selectedClass).removeClass($this.set.selectedClass);
					if(isSelected && $this.set.clickRemoveSelected) {
						//Reset to default
						$this.removeClass($this.set.selectedClass).find('span').first().text($this.find('span').first().data('orig-text'));
						$this.trigger('rekaf.unselected', [textList]);
					} else {
						$li.addClass($this.set.selectedClass);
						$this.addClass($this.set.selectedClass).find('span').first().text(textList[0]);
						$this.trigger('rekaf.selected', [textList]);
					}

				}
				$this.data('textList', textList);
				priv.closeList.apply($this);
			});

			$('#rekaf-screen').on('click', function() {
				priv.closeList.apply($this);
			});

			if(!$this.set.useScreen) {				
				$(document).on('click touchend', function(e) {
					//If list is opened and interaction is outside of the list.
					if($this.hasClass('rekaf-opened') && $(e.target).closest('.fake-select').length === 0) {
						//If touch enabled and touch is not a click return
						if($this.set.touch === true && touchClick() === false) return;
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

			var init = $.extend({}, defaultOpts, options),
				bgColor = '';
			

			if(init.debug === true) {
				if(this.length === 0) {
					console.warn('No objects found for $.rekaf >>> Maybe not generated from JS yet?');
					return;
				}
				bgColor = 'background-color: blue; ';
			}

			//Create a screen
			if($('#rekaf-screen').length === 0 && init.useScreen) $('body').prepend('<div id="rekaf-screen" style="position: fixed; top: 0; left: 0; ' + bgColor + 'width: 100%; height: 2000px; z-index: ' + (init.zIndex + 1) + '; display: none;"></div>');

			return this.each(function() {
				var $this = $(this),
					objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				if($this.set.debug === true) {
					console.warn(':::: YS Filter Debug has been set to true ::::');
					console.log('Options -> ', $this.set);
				}

				//Make sure that the selects are of a higher z-index than the screen.
				if($this.set.preventInlineStyles === false) {
					$this.css({
						'z-index': $this.set.zIndex,
						'position': 'relative'
					});
				}

				if(!$this.set.rekafIntiated) {
					priv.init.apply($this);
				} else {
					if($this.set.debug === true) console.warn(':::: You are re-running REKAF!!! It is only intended to be run once, try update. ::::');
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
		touch: false,
		clickRemoveSelected: false,
		disabledClass: 'disabled',
		selectedClass: 'selected',
		multiselectTitleLimit: 4,
		multiselectTitleLimitText: ' items selected',
		delimiter: ', ',
		preventLinks: true,
		preventInlineStyles: false,
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
	
})(jQuery, window);
