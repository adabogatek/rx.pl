$(document).ready(function() {
	// AutoComplete - https://github.com/twitter/typeahead.js
	var drugsList;

	drugsList = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('fullname'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url:'http://leki.esculap.com/autocomplit?query=%QUERY',
			filter: function(list) {
//                console.log(list.result);
				return $.map(list.result, function(item) {
						return {name: item.fullName,
							value: item.fullName,
							slug: item.slug,
							id: item.id,
							refundacjaRyczalt: item.refundacjaRyczalt,
							refundacjaBezplatnie: item.refundacjaBezplatnie,
							refundacja30: item.refundacja30,
							refundacja50: item.refundacja50
						}
					}
				)}
		}
	});

	drugsList.initialize();


	$('#searchDrugs').typeahead({
		hint: true,
		highlight: true
	}, {

		name: 'drugsList',
		source: drugsList.ttAdapter(),
		templates: {
			suggestion: Handlebars.compile([
				'{{#if refundacjaRyczalt}}<span class="price">{{refundacjaRyczalt.nazwa}}</span>{{/if}}',
				'{{#if refundacjaBezplatnie}}<span class="price">{{refundacjaBezplatnie.nazwa}}</span>{{/if}}',
				'{{#if refundacja50}}<span class="price">{{refundacja50.nazwa}}</span>{{/if}}',
				'{{#if refundacja30}}<span class="price">{{refundacja30.nazwa}}</span>{{/if}}',
				'<span class="name">{{name}}</span>'
			].join(''))
		}
	});

	var txt = $('.tt-dataset-drugsList').text();
	console.log(txt);

	var lastTerm = '';
	$('#searchDrugs').bind('change', function (a,b) {

		lastTerm = $(a.target).val();

	} );

	$('#search .search').bind( 'click', function(obj, v) {

		var txt = $('#searchDrugs.tt-input');
		txt.val()

		$('#searchDrugs').val(lastTerm);
		$('#search').submit();

		return false;
	} );

});



$('#searchDrugs').bind('typeahead:selected', function(obj, datum, name) {


	urlDrugDetails = urlDrugDetails
		.replace('_slug_', datum.slug)
		.replace('_id_', datum.id)
	window.location= (urlDrugDetails);
});







$(function() {
	$(window).on('resize', function() {
		windowWidth = $(window).width();
	});

	menuOnClick();
	menuOnHover();

	if ($('#rwd').length) {
		$('#rwd .icoBars').click(function(e) {
			e.preventDefault();
			$('#menu, #menuSub').slideToggle();
		});
	}

	if ($('.footable').length) {
		$('.footable').footable();
	}

	if ($('.priceList').length) {
		$('.priceList > ul > li > a').click(function(e) { 
			e.preventDefault();
			goToByScroll($(this).attr('id'));
		});
	}

	if ($('#search').length) {
		if ($(window).width() <= 768) {
			var $stickySearch = $('#search');
			var vTop = $stickySearch.offset().top - parseFloat($stickySearch.css('margin-top').replace(/auto/, 0));
	
			$(window).scroll(function (event) {
				var y = $(this).scrollTop();
				if (y >= vTop) {
					$stickySearch.parent().addClass('sticky');
				} else {
					$stickySearch.parent().removeClass('sticky');
				}
			});
		}
	}

/*	$(window).on('load', function () {
		if ($('#infoHome').length) {
			$.magnificPopup.open({
				items: {
					src: '#infoHome'
				},
				removalDelay: 300,
				mainClass: 'mfp-fade'
			}, 0);
		}

		if ($('#infoSearch').length) {
			$.magnificPopup.open({
				items: {
					src: '#infoSearch'
				},
				removalDelay: 300,
				mainClass: 'mfp-fade'
			}, 0);
		}
	});
*/

	$(".removeButton").click(function() {
		$(this).parent(".notification").remove();
	});


	$(".drugForm input, .drugForm span").focusin(function(event) {
		$(this).parent().children("span").children("button").fadeIn(50);
	});

	$(".drugForm input, .drugForm span").focusout(function(event) {
		//$(this).parent(".drugForm").children("button");

		$(this).parent().children("span").children("button").promise().done(function() {
			$(this).fadeOut(100);
		});
	});

});

var windowWidth = $(window).width();
function menuOnClick() { 
   $('#menu li:first-child').click(function(e) {
	   if (windowWidth <= 800)
	   {
		   e.preventDefault();
		   $(this).find('ul').slideToggle();
	   }
   }); 
}

function menuOnHover() {
	$('#menu li').hover(function() {
		if (windowWidth >= 801) {
			$(this).find('ul').stop(true, true).fadeIn(200).show(200, function() {
				$(this).height('auto');
			});
			$(this).addClass('hover');
		}
	}, function() {
		if (windowWidth >= 801) {
			$(this).find('ul').fadeOut(200);
			$(this).removeClass('hover');
		}
	});
}

function goToByScroll(id){
	id = id.replace('Link', '');
	$('html,body').animate({ scrollTop: $('#'+id).offset().top}, 'slow');
}
