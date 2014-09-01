# Rekaf - Turns a list into a fake select #

A jQuery plugin that takes care of all the small nuances of creating a select. Should have indentical functionality to a select but with the added advantage of the user being able to trigger an open state on it. The open state is created by changing the class on the parent object.

### Usage ###


Initiate with `$(selector).rekaf({'some':'property'});`   
Invoke methods with `$(selector).rekaf('method', {'some':'property'});`   
Example

	$('.fake-select').rekaf({
		debug: true,
		zIndex: 2000
	})
 
### HTML ###

Following structure is required for selector to work. (Using Emmet tab complete for HTML)

	div.fake-select>span.title[data-orig-text=]+ul.fake-select-list>li*3

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


#### debug ####

*Default* `false`   
*Expects* `boolean`

Helpful to get some debugging data. This should be off for production prints object data straight to the console.

	$(selector).rekaf({debug: false});

### Events ###

#### rekaf.selected ####

An option has been selected. This triggers an event on the element that has been called with rekaf.

	$(selector).on(rekaf.selected, function(){
		//Do something now a value is selected.
	})

#### rekaf.unselected ####

An option has been unselected. This triggers an event on the element that has been called with rekaf. This often means that it now has no value.

	$(selector).on(rekaf.unselected, function(){
		//Do something now the value is unselected.
	})

#### rekaf.opened ####

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


### Changelog ###

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