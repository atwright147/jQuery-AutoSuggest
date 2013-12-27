/*
 * Name: Simple jQuery AutoComplete
 * Author: Michael Stowe
 * Version 1.0
 * ---------------------
 * Sends user input via "GET" to a dynamic page with a "q" query, and then takes the
 * pipe-delimited text and returns it as a clickable dropdown list.
 * ---------------------
 * Example: 
 * <input type="text" name="example" id="example" rel="use_this_page_for_results.php" />
 * <script language="javascript">$('#example').autosuggest();< /script>
 * ---------------------
 * Changelog: 
 * ---------------------
 * (c) 2010, http://www.mikestowe.com
 */

/*!
* jQuery Plugin vX.X
* https://github.com/atwright147/jquery.plugin-name
*
* Copyright 2012, Andy Wright
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.opensource.org/licenses/GPL-2.0
*/

;(function($) {
	'use strict';

	$.fn.autosuggest = function(options) {

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend({
			'minLength' : 3,
			'selector'  : 'li',
			'restful'   : true,
			'dataType'  : null,  // intelligent auto-guess 
			'parse'     : function(data) {
								console.debug('parse:',data);
								return data;
						  },
			'template'  : function(data) {
								var $out = $('<ul/>');
								$.map(data, function(item,i) {
									$out.append('<li data-id="'+item.id+'">'+item.suggestion+'</li>');
								});
								return $out;
						  },
			'onSelect'  : function(el) {
								console.debug('selected:', el);
								return el;
						  }
		}, options);

		var o = settings;
		//console.debug(settings);

		console.groupCollapsed('Init');
			console.info('autosuggest started');
			console.info('selector:', this);
			console.info('options:', o);
		console.groupEnd();

		$(document).on('autosuggestChange', function(event) {
			return o.onSelect(event);
		});

		return this.each(function() {
			var $this = $(this);
			var id = $this.attr('id');
			var offset = $this.offset();
			var left = offset.left;

			if ($this.height() == 0) {
				var height = 30;
			} else {
				var height = $(this).height() + 5;
			}
			if ($this.width() == 0) {
				var width = 200;
			} else {
				var width = $this.width() + 5;
			}

			var top = offset.top + height;

			//document.write('<div class="autosuggest" id="autosuggest_'+id+'" style="position: absolute; left: '+left+'px; top: '+top+'px; width: '+width+'px; display: none;"></div>');
			var $suggestions = $('<div class="autosuggest-suggestions" id="autosuggest_'+id+'" style="position: absolute; left: '+left+'px; top: '+top+'px; width: '+width+'px; display: none;"/>');
			$($this).after($suggestions);

			$(this).keyup(function() {
				if ($('#'+id).val().length >= o.minLength) {
					var query = $('#'+id).val();
					var url = $('#'+id).data('url');
					if (o.restful && url.substring(url.length-1) == "/") {
						console.debug(o.restful);
						//url = url.substring(0, url.length-1) + '/' + query;
						url = url.substring(0, url.length-1);
					}
					if ( ! o.restful) {
						//url = url + query;
					}
					$.ajax({
						url: url,
						//dataType: 'json',
						//data: {q: $('#'+id).val()},  // TODO: make into an option
						success: function(data) {
							if (data.length > 0) {
								var status = true;
								var ret = o.template(o.parse(data));
								$('#autosuggest_'+id).html(ret).show().on('click.autosuggest', 'li', function() {
									$.event.trigger({
										type: 'autosuggestChange',
										time: new Date()
									});
								});
							} else {
								$('#autosuggest_'+id).hide().off('click.autosuggest');
							}
						}
      				});
				} else {
					$('#autosuggest_'+id).hide();
				}
			});
		});
	};

})(jQuery || $);

