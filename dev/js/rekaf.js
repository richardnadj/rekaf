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
		enableEvents: function() {
			var $this = this;

			$this.on('click', 'span', function() {
				if(!$this.hasClass('rekaf-opened')) {
					priv.openList.apply($this);
				} else {
					priv.closeList.apply($this);
				}
			});

			$this.on('click', 'li', function() {
				var $li = $(this),
					text = $li.text(),
					isSelected = $li.hasClass('selected');

				if($li.find('.' + $this.set.disabledClass).length > 0 || $li.hasClass($this.set.disabledClass)) return;

				if($li.find('.remove').length > 0) $this.removeClass('selected');

				if($this.set.multiselect === true) {
					
					$li.toggleClass('selected');
					if($this.find('.selected').length > 0) {
						$this.addClass('selected').find('span').addClass('selected');
					} else {
						$this.removeClass('selected').find('span').removeClass('selected');
					}

				} else {

					$this.find('.selected').removeClass('selected');
					if(isSelected && $this.set.clickRemoveSelected) {
						//Reset to default
						$this.removeClass('selected').find('span').text($this.find('span').data('orig-text'));
						$this.trigger('rekaf.unselected', [text]);
					} else {
						$li.addClass('selected');
						$this.addClass('selected').find('span').text(text);
						$this.trigger('rekaf.selected', [text]);
					}

				}
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
			$('body').prepend('<div id="rekaf-screen" style="position: fixed; top: 0; left: 0; ' + bgColor + 'width: 100%; height: 2000px; z-index: ' + (init.zIndex + 1) + '; display: none;"></div>');

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

				priv.init.apply($this);
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
		}
	};

	var defaultOpts = {
		zIndex: 1500,
		mulitselect: false,
		clickRemoveSelected: false,
		disabledClass: 'disabled',
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
