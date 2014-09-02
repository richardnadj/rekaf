;(function($, window) {
	
	var priv = {
		init: function() {
			var $this = this;

			priv.enableEvents.apply($this);
			priv.checkInputs.apply($this);
		},
		checkInputs: function() {
			var $this = this,
				$inputChecked = $this.find('input:checked'),
				$inputDisabled = $this.find('input:disabled'),
				text = '';

			if($inputChecked.length > 0) {
				text = $inputChecked.closest('li').text();
				$this.find('.selected').removeClass('selected');
				$inputChecked.closest('li').addClass('selected');
				$this.addClass('selected').find('span').text(text);
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

			$this.addClass('rekaf-opened').css('z-index', ($this.set.zIndex + 2)).find('ul').show();
			$('#rekaf-screen').show();
		},
		closeList: function() {
			var $this = this;

			$('.rekaf-opened').removeClass('rekaf-opened').css('z-index', $this.set.zIndex).find('ul').hide();
			$('#rekaf-screen').hide();
		},
		updateList: function() {
			var $this = this,
				text = '',
				textList = $this.data('textList') || [];

			$this.find('li').each(function(i) {
				var currentItem = $(this).text(),
					inListAtIndex = null;

				for (var j = 0; j < textList.length; j++) {
					if(currentItem === textList[j]) {
						inListAtIndex = j;
						break;
					}
				}

				if($(this).hasClass('selected')) {
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
					$this.find('span').text(text);
					$this.trigger('rekaf.selected', [textList]);
				} else {
					$this.find('span').text(textList[0]);
					$this.trigger('rekaf.selected', [textList]);
				}

			} else {
				//Nothing selected return to default settings.
				$this.find('span').text($this.find('span').data('orig-text'));
				$this.trigger('rekaf.unselected', [textList]);
			}

			$this.data('textList', textList);

		},
		enableEvents: function() {
			var $this = this;

			$this.on('click', 'span', function() {
				if(!$this.hasClass('rekaf-opened')) {
					priv.openList.apply($this);
				} else {
					priv.closeList.apply($this);
				}
			});

			$this.on('click', 'li', function(e) {
				var $li = $(this),
					textList = $this.data('textList') || [],
					isSelected = $li.hasClass('selected');

				if($li.find('a').length > 0) e.preventDefault();
				if($li.find('.' + $this.set.disabledClass).length > 0 || $li.hasClass($this.set.disabledClass)) return;
				if($li.find('.remove').length > 0) $this.removeClass('selected');

				if($this.set.multiselect === true) {
					
					if($li.hasClass('clear-select')) {
						$this.find('.selected').removeClass('selected');
						textList = [];
						text = '';
					} else {
						if($li.hasClass('selected')) {
							$li.removeClass('selected');
							for (var i = 0; i < textList.length; i++) {
								if(textList[i] === $li.text()) {
									textList.splice(i, 1);
									break;
								}
							}
						} else {
							$li.addClass('selected');
							textList.push($li.text());
						}
						
						text = (textList.length > $this.set.multiselectTitleLimit) ? textList.length + $this.set.multiselectTitleLimitText : textList.join($this.set.delimiter);
					}

					if(textList.length > 0) {
						$this.addClass('selected').find('span').addClass('selected').text(text);
						$this.trigger('rekaf.selected', [text]);
					} else {
						$this.removeClass('selected').find('span').removeClass('selected').text($this.find('span').data('orig-text'));
						$this.trigger('rekaf.unselected', [text]);
					}

				} else {

					textList[0] = $li.text();

					$this.find('.selected').removeClass('selected');
					if(isSelected && $this.set.clickRemoveSelected) {
						//Reset to default
						$this.removeClass('selected').find('span').text($this.find('span').data('orig-text'));
						$this.trigger('rekaf.unselected', [textList]);
					} else {
						$li.addClass('selected');
						$this.addClass('selected').find('span').text(textList[0]);
						$this.trigger('rekaf.selected', [textList]);
					}

				}
				$this.data('textList', textList);
				priv.closeList.apply($this);
			});

			$('#rekaf-screen').on('click', function() {
				priv.closeList.apply($this);
			});

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
			if($('#rekaf-screen').length === 0) $('body').prepend('<div id="rekaf-screen" style="position: fixed; top: 0; left: 0; ' + bgColor + 'width: 100%; height: 2000px; z-index: ' + (init.zIndex + 1) + '; display: none;"></div>');

			return this.each(function() {
				var $this = $(this),
					objectData = $this.data();

				$this.set = $.extend({}, init, objectData);

				if($this.set.debug === true) {
					console.warn(':::: YS Filter Debug has been set to true ::::');
					console.log('Options -> ', $this.set);
				}

				//Make sure that the selects are of a higher z-index than the screen.
				$this.css({
					'z-index': $this.set.zIndex,
					'position': 'relative'
				});

				if(!$this.set.rekafIntiated) {
					priv.init.apply($this);
				} else {
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
		}
	};

	var privateOpts = {
		rekafIntiated: false
	}

	var defaultOpts = {
		zIndex: 1500,
		mulitselect: false,
		clickRemoveSelected: false,
		disabledClass: 'disabled',
		multiselectTitleLimit: 4,
		multiselectTitleLimitText: ' items selected',
		delimiter: ', ',
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
			$.error('Method ' +  method + ' does not exist on jQuery.rekaf');
		}

	};
	
})(jQuery, window);
