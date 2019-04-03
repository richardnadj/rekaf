# Rekaf - Turns a list into a fake select #

A jQuery plugin that takes care of all the small nuances of creating a select. Should have indentical functionality to a select but with the added advantage of the user being able to trigger an open state on it. The open state is created by changing the class on the parent object.

### Usage ###


Initiate with `$(selector).rekaf({'some':'property'});`   
Invoke methods with `$(selector).rekaf('method', {'some':'property'});`   
Example

	$('.rekaf').rekaf({
		debug: true,
		zIndex: 2000
	})
 
### HTML ###

Following structure is required for selector to work. (Using Emmet tab complete for HTML)

	div.rekaf>span.rekaf-title+ul.rekaf-list>li*3

### Properties ###

#### zIndex ####

*Default* `1500`   
*Expects* `integer`

Defines which z-index dropdowns should work. A normal select is the highest property on the page so that nothing obstructs it's usage.

	$(selector).rekaf({zIndex: 1500});


#### multiselect ####

*Default* `false`   
*Expects* `boolean`

Enables the user to be able to select more than one value in the drop down. Now fully implemented use with `multiselectTitleLimit` and `multiselectTitleLimitText`.

	$(selector).rekaf({multiselect: false});


#### multiselectTitleLimit ####

*Default* `4`   
*Expects* `integer`

How many names should be displayed both moving on to "items selected".

	$(selector).rekaf({multiselectTitleLimit: 4});


#### multiselectTitleLimitText ####

*Default* ` items selected`   
*Expects* `string`

Once multiselectTitleLimit is reached this text is used in association with multiselectTitleLimit. *i.e. 4 items selected*

	$(selector).rekaf({multiselectTitleLimitText: ' items selected'});


#### delimiter ####

*Default* `, `   
*Expects* `string`

Delimits text when more than one option is selected in a multiselect dropdown.

	$(selector).rekaf({delimiter: ', '});


#### clickRemoveSelected ####

*Default* `false`   
*Expects* `boolean`

If the user clicks on the same value that is already selected the selection will be removed and the initial state will be returned.

	$(selector).rekaf({clickRemoveSelected: false});


#### preventLinks ####

*Default* `true`   
*Expects* `boolean`

If events should be prevented or whether you would like the anchor to take effect.

	$(selector).rekaf({preventLinks: true});


#### preventInlineStyles ####

*Default* `false`   
*Expects* `boolean`

Only applies to static styles on surrounding div and not showing hiding list (`z-index` and `position`).

	$(selector).rekaf({preventInlineStyles: false});


#### preventClose ####

*Default* `false`   
*Expects* `boolean`

Stop select from automatically closing after every choice.

	$(selector).rekaf({preventClose: false});


#### useScreen ####

*Default* `true`   
*Expects* `boolean`

This is a superior version of using a screen to detect when to close the select. This works out if you have clicked something that is not the fake list and closes based on that result. It requires that the list has `rekaf--opened` as a parent to the item you are clicking.

	$(selector).rekaf({useScreen: false});


#### useHTML ####

*Default* `false`   
*Expects* `boolean`

Copy HTML from selected item. Content must be wrapped within HTML. If no HTML is present any text nodes will instead be copied. If HTML is present adjacent textnodes are not copied.

	$(selector).rekaf({useScreen: false});


#### debug ####

*Default* `false`   
*Expects* `boolean`

Helpful to get some debugging data. This should be off for production prints object data straight to the console.

	$(selector).rekaf({debug: false});

### Events ###

#### selected.rekaf ####

An option has been selected. This triggers an event on the element that has been called with rekaf.

	$(selector).on(rekaf.selected, function(){
		//Do something now a value is selected.
	})

#### unselected.rekaf ####

An option has been unselected. This triggers an event on the element that has been called with rekaf. This often means that it now has no value.

	$(selector).on(rekaf.unselected, function(){
		//Do something now the value is unselected.
	})

#### opened.rekaf ####

The selector has been opened.

	$(selector).on(rekaf.opened, function(){
		//Do something now the select is opened
	})

### Methods ###

#### open ####

Trigger the select box to open.

	$(selector).rekaf('open');

#### update ####

Trigger an update on the selects so that the selects reflect the items selected.

	$(selector).rekaf('update');

#### reset ####

Clear all lists that have previously selected items.

	$(selector).rekaf('reset');

#### destroy ####

Remove all events and data from lists and all html.  
Adding the option `leaveHTML` and setting it to true will only remove events and data.

	$(selector).rekaf('destroy', {leaveHTML: false});


### Changelog ###

**Version 1.3.0**   
`useHTML` now fallbacks to using text if no children nodes are available.

**Version 1.2.0**   
Event namespacing now follows the standard with `action.pluginName` which triggered events are compatible with prior versions. Added the destroy method useful for lists updated from AJAX.

**Version 1.1.2**   
Fixed useScreen click listener.

**Version 1.1.1**   
Stopped clicking on title from propagating to closing function - `useScreen = true`.

**Version 1.1.0**   
Updated classes and ids. Added them to options to allow overiding. Added a new function to prevent select from closing.

**Version 1.0.0**   
Refactored rekaf to use even HTML in lists. Added module support and added to NPM. No longer required to have data-orig-text. Initial data in select used instead.

**Version 0.8.5**   
Adding selected to a li prior to rendering now uses that as the default value.

**Version 0.8.3/0.8.4**   
Added a new preference to stop `position: relative;` being added.

**Version 0.8.2**   
Made rekaf with no screen better. Closing other already open lists if trying to open a new.

**Version 0.8.1**   
Fixed event rekaf.opened. Was not previously firing.

**Version 0.8.0**   
Added a new property so that you don't have to use a screen to listen for when to close the list. Added touch listeners.

**Version 0.7.4**   
Added a new method to trigger selects to clear/reset. Also listening to remove class in multiselect list to reset dropdown.

**Version 0.7.3**   
Filtered out span element to the first span in case there are spans in the fake select. If list items have no text use title attribute.

**Version 0.7.2**   
Lowered jQuery requirement to be above 1.7 added in option to redetermine select class good due to differences between this and the filter.

**Version 0.7.1**   
Updated jQuery requirement to be above 1.11

**Version 0.7.0**   
Added optional preventDefault allowing for links to be executed.

**Version 0.6.3**   
Removed debug message if debug flag isn't set to true for double loaded.

**Version 0.6.2**   
Added in a fix that stops rekaf being initiated more than once. A data object that is saved with the html. If the html is removed initiate rakaf again otherwise use update.

**Version 0.6.1**   
Fixed a bug that prevented the input being checked.

**Version 0.6.0**   
Added an update method so that when an item is updated it is reflected in the select. Added complete functionality for multiselect.

**Version 0.5.1**   
Updated distribution folder.

**Version 0.5.0**   
Added an event for opened select, changed how all events are called. rekaf then event.

**Version 0.4.0**   
Added classes for items that are already selected or disabled upon initiation. Added uncompressed file for development with on client.

**Version 0.3.0**   
Added events to listen to when an item has been selected or deselected.

**Version 0.2.0**   
Added a new method to open the select from an unrelated anchor.

**Version 0.1.\***   
Basic functionality of the drop down.

### Development ###

**Requirements**
* This plugin requires [node](http://nodejs.org/), [gulpjs](http://gulpjs.com/) and [bower](http://bower.io/).
* Follow JSCS guidelines a styling-example.js is also included.
* Run `bower install` and `npm install` to get dev dependencies. Bower and Gulp is assumed to be running globally.

### Contact ###

This is a small plugin by Young Skilled.
Contact [richard](mailto:richard@youngskilled) for more details about this plugin.