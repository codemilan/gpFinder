"use strict"
/**
 * @class  Finder toolbar button widget.
 * If command has variants - create menu
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.finderbutton = function(cmd) {
	return this.each(function() {

		var c        = 'class',
			fm       = cmd.fm,
			disabled = fm.res(c, 'disabled'),
			active   = fm.res(c, 'active'),
			hover    = fm.res(c, 'hover'),
			item     = 'finder-button-menu-item',
			selected = 'finder-button-menu-item-selected',
			menu,
			button   = $(this).addClass('ui-state-default finder-button')
				.attr('title', cmd.title)
				.append('<span class="finder-button-icon finder-button-icon-'+cmd.name+'"/>')
				.hover(function(e) { !button.is('.'+disabled) && button[e.type == 'mouseleave' ? 'removeClass' : 'addClass'](hover) /**button.toggleClass(hover);*/ })
				.click(function(e) {
					if (!button.is('.'+disabled)) {
						if (menu && cmd.variants.length > 1) {
							// close other menus
							menu.is(':hidden') && cmd.fm.getUI().click();
							e.stopPropagation();
							menu.slideToggle(100);
						} else {
							cmd.exec();
						}

					}
				}),
			hideMenu = function() {
				menu.hide();
			};

		// if command has variants create menu
		if ($.isArray(cmd.variants)) {
			button.addClass('finder-menubutton');

			menu = $('<div class="ui-widget ui-widget-content finder-button-menu ui-corner-all"/>')
				.hide()
				.appendTo(button)
				.zIndex(12+button.zIndex())
				.delegate('.'+item, {
					'mouseenter mouseleave': function() {
						$(this).toggleClass(hover);
					},
					'click': function(e) {
						e.preventDefault();
						e.stopPropagation();
						button.removeClass(hover);
						cmd.exec(cmd.fm.selected(), $(this).data('value'));
					}
				});

			cmd.fm.bind('disable select', hideMenu).getUI().click(hideMenu);

			cmd.change(function() {
				menu.html('');
				$.each(cmd.variants, function(i, variant) {
					$('<div class="'+item+'">'+variant[1]+'</div>')
						.data('value', variant[0]).addClass(variant[0] == cmd.value ? selected : '')
						.appendTo(menu);
				});
			});
		}

		cmd.change(function() {
			if (cmd.disabled()) {
				button.removeClass(active+' '+hover).addClass(disabled);
			} else {
				button.removeClass(disabled);
				button[cmd.active() ? 'addClass' : 'removeClass'](active);
			}
		})
		.change();
	});
}
