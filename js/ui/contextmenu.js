
/**
 * @class  Finder contextmenu
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.findercontextmenu = function(fm) {

	return this.each(function() {
		var menu = $(this).addClass('ui-helper-reset ui-widget ui-state-default ui-corner-all finder-contextmenu finder-contextmenu-'+fm.direction)
				.hide()
				.appendTo('body')
				.delegate('.finder-contextmenu-item', 'hover', function() {
					$(this).toggleClass('ui-state-hover')
				}),
			subpos  = fm.direction == 'ltr' ? 'left' : 'right',
			types = $.extend({}, fm.options.contextmenu),
			tpl     = '<div class="finder-contextmenu-item"><span class="finder-button-icon {icon} finder-contextmenu-icon"/><span>{label}</span></div>',
			item = function(label, icon, callback) {
				return $(tpl.replace('{icon}', icon ? 'finder-button-icon-'+icon : '').replace('{label}', label))
					.click(function(e) {
						e.stopPropagation();
						e.stopPropagation();
						callback();
					})
			},

			open = function(x, y) {
				var win        = $(window),
					width      = menu.outerWidth(),
					height     = menu.outerHeight(),
					wwidth     = win.width(),
					wheight    = win.height(),
					scrolltop  = win.scrollTop(),
					scrollleft = win.scrollLeft(),
					css        = {
						top  : (y + height < wheight ? y : y - height > 0 ? y - height : y) + scrolltop,
						left : (x + width  < wwidth  ? x : x - width) + scrollleft,
						'z-index' : 100 + fm.getUI('workzone').zIndex()
					};

				menu.css(css)
					.show();

				css = {'z-index' : css['z-index']+10};
				css[subpos] = parseInt(menu.width());
				menu.find('.finder-contextmenu-sub').css(css);
			},

			close = function() {
				menu.hide().empty();
			},

			create = function(type, targets) {
				var sep = false;



				$.each(types[type]||[], function(i, name) {
					var cmd, node, submenu;

					if (name == '|' && sep) {
						menu.append('<div class="finder-contextmenu-separator"/>');
						sep = false;
						return;
					}

					cmd = fm.command(name);

					if (cmd && cmd.getstate(targets) != -1) {
						if (cmd.variants) {
							if (!cmd.variants.length) {
								return;
							}
							node = item(cmd.title, cmd.name, function() {});

							submenu = $('<div class="ui-corner-all finder-contextmenu-sub"/>')
								.appendTo(node.append('<span class="finder-contextmenu-arrow"/>'));

							node.addClass('finder-contextmenu-group')
								.hover(function() {
									submenu.toggle()
								})

							$.each(cmd.variants, function(i, variant) {
								submenu.append(
									$('<div class="finder-contextmenu-item"><span>'+variant[1]+'</span></div>')
										.click(function(e) {
											e.stopPropagation();
											close();
											cmd.exec(targets, variant[0]);
										})
								);
							});

						} else {
							node = item(cmd.title, cmd.name, function() {
								close();
								cmd.exec(targets);
							})

						}

						menu.append(node)
						sep = true;
					}
				})
			},

		fm.one('load', function() {
			fm.bind('contextmenu', function(e) {
				var data = e.data;

				close();

				if (data.type && data.targets) {
					create(data.type, data.targets);
				}

				menu.children().length && open(data.x, data.y);
			})
			.one('destroy', function() { menu.remove(); })
			.bind('disable select', close)
			.getUI().click(close);
		});

	});

}