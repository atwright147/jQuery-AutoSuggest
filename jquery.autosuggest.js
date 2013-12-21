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

(function($){

	jQuery.fn.autosuggest = function(options) {

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend({
			'minLength' : 3,
			'restful'   : true,
			'dataType'  : null  // intelegent auto-guess 
		}, options);

		var o = settings;
		//console.debug(settings);

		console.info('autosuggest started');
		console.info('selector:', this);
		console.info('options:', o);

		return this.each(function() {

			var id = $(this).attr('id');
			var offset = $(this).offset();
			var left = offset.left;


			if($(this).height() == 0) {
				var height = 30;
			} else {
				var height = $(this).height() + 5;
			}
			if($(this).width() == 0) {
				var width = 200;
			} else {
				var width = $(this).width() + 5;
			}

			var top = offset.top + height;

			document.write('<div class="autosuggest" id="autosuggest_'+id+'" style="position: absolute; left: '+left+'px; top: '+top+'px; width: '+width+'px; display: none;"></div>');
			
			$(this).keyup(function() {
				if($('#'+id).val().length >= o.minLength) {
					$.ajax({
						url: $('#'+id).attr('rel'),
						//data: {q: $('#'+id).val()},  // TODO: make into an option
						success: function(data) {
							if(data.length > 0) {
								var ret = '';
								var pairs = data.split('|');
								for(var i in pairs){
									ret += '<a href="javascript: void(0);" onclick="$(\'#'+id+'\').val(\''+pairs[i]+'\'); $(\'#autosuggest_'+id+'\').hide();">'+pairs[i]+'</a>';
								}
								$('#autosuggest_'+id).html(ret).show();
							} else {
								$('#autosuggest_'+id).hide();
							}
						}
					});
				} else {
					$('#autosuggest_'+id).hide();
				}
			});
		});
	};

})(jQuery);

