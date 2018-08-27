"use strict";

(function(doc, win) {
	var classie = win.classie || {};
	var Masonry = win.Masonry || false;
	var Siema = win.Siema || false;
	var Hammer = win.Hammer || false;
	var Headroom = win.Headroom || false;
	var ResizeSensor = win.ResizeSensor || false;
	var MediaBox = win.MediaBox || false;
	var spark = win.spark || function() {};
	var timing = win.timing || {};
	var IS_TOUCH_DEVICE = win.IS_TOUCH_DEVICE || false;
	var gClient = undefined !== win.google;

	var PIXI = win.PIXI || false;

	var scroll = {
		rolling: false
	};

	/**
	 * @see https://github.com/hesambayat/is-touch-device-javascript
	 */
	var istouch = !!IS_TOUCH_DEVICE;

	var isMac = false;
	/**
	 * @see https://stackoverflow.com/a/38241481/2131534
	 */
	try {
		if (["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(navigator.platform) !== -1) {
			isMac = true;
		}
	} catch (error) {
		console.warn({ error: error });
	}

	var isChrome = false;
	/**
	 * @see https://stackoverflow.com/a/9851769/2131534
	 */
	try {
		isChrome = !!window.chrome && !!window.chrome.webstore;
	} catch (error) {
		console.warn({ error: error });
	}

	/**
	 * Text hover effect on mouse over
	 */
	function pixudio_hoverLink() {
		// do nothing on touch screens
		if (true === istouch) return;

		var links = doc.querySelectorAll(".hover-link");
		// no element has found
		if (0 === links.length) return;

		var set = function set(el) {
			// remove copy's line break and empty chars
			var words = el.textContent.split(" ").filter(function(w) {
				return "" !== w && "\n" !== w;
			});
			// link has no copy
			if (0 === words.length) return;

			var firstWord = words.shift();

			el.innerHTML = firstWord;

			var store = [firstWord];
			var height = el.offsetHeight;

			words.forEach(function(w) {
				el.innerHTML += " " + w;

				if (el.offsetHeight > height) {
					height = el.offsetHeight;
					store.push(w);
				} else {
					var lastWord = store.length - 1;
					store = [].concat(store.slice(0, lastWord), [store[lastWord] + " " + w]);
				}
			});

			el.innerHTML = "<span>" + store.join("</span> <span>") + "</span>";
		};

		var loop = function loop() {
			return links.forEach(function(link) {
				return set(link);
			});
		};

		setTimeout(loop, 0);
		win.addEventListener("resize", loop, false);
	}

	/**
	 * Tilt hover effect on mouse over
	 */
	function pixudio_tilt() {
		// only chrome
		if (false === isChrome) return;

		// do nothing on touch screens
		if (true === istouch) return;

		var tilts = doc.querySelectorAll(".tilt");
		// no element has found
		if (0 === tilts.length) return;

		var set = function set(el) {
			var maxTilt = 30;
			var perspective = 250;
			var mouse = {};

			/**
			 * Get tilt values
			 * @returns {{x: tilt value, y: tilt value}}
			 */
			var getValues = function getValues() {
				var rect = el.getBoundingClientRect();
				var percentageX = mouse.x / rect.width;
				var percentageY = mouse.y / rect.height;
				// x or y position inside instance / width of instance = percentage of position inside instance * the max tilt value
				var tiltX = (maxTilt / 2 - percentageX * maxTilt).toFixed(2);
				var tiltY = (percentageY * maxTilt - maxTilt / 2).toFixed(2);
				// angle
				var angle = Math.atan2(mouse.x - (rect.left + rect.width / 2), -(mouse.y - (rect.top + rect.height / 2))) * (180 / Math.PI);

				var x = Math.ceil(tiltX * -2);
				var y = Math.ceil(tiltY * 2);

				// Return x & y tilt values
				return { tiltX: tiltX, tiltY: tiltY, x: x, y: y, angle: angle, percentageX: percentageX * 100, percentageY: percentageY * 100 };
			};

			// update mouse cords & trigger animate
			var mouseMove = function mouseMove(event) {
				mouse = { x: 0, y: 0 };
				if ("undefined" !== typeof event) {
					mouse.x = event.offsetX;
					mouse.y = event.offsetY;
				}

				animate();
			};

			// Reset
			var mouseLeave = function mouseLeave() {
				el.style.transform = "perspective(" + perspective + "px)";
			};

			// animate
			var animate = function animate() {
				var transform = getValues();
				var props = [
					"perspective(" + perspective + "px)",
					"rotateX(" + transform.tiltY * -1 + "deg)",
					"rotateY(" + transform.tiltX * -1 + "deg)",
					"translate(" + transform.x + "px, " + transform.y + "px)"
				];

				el.style.transform = props.join(" ");
			};

			el.addEventListener("mousemove", mouseMove, false);
			el.addEventListener("mouseleave", mouseLeave, false);
		};

		// loop
		tilts.forEach(function(tilt) {
			return set(tilt);
		});
	}

	/**
	 * Masonry works by placing elements in optimal position based on available vertical space,
	 * sort of like a mason fitting stones in a wall.
	 */
	function pixudio_masonry() {
		// Masonry has not included.
		if (false === Masonry) return;

		var grids = doc.querySelectorAll(".masonry");

		// No element has found.
		if (0 === grids.length) return;

		var generate = function generate(msnry) {
			return setTimeout(function() {
				msnry.layout();
			}, 0);
		};

		grids.forEach(function(grid) {
			return generate(
				new Masonry(grid, {
					// options
					itemSelector: ".masonry-item",
					// use element for option
					columnWidth: grid.getAttribute("data-column-width") || ".masonry-item",
					horizontalOrder: !!classie.has(grid, "masonry--horizontal-order"),
					percentPosition: true
				})
			);
		});
	}

	/**
	 * Mediabox is a essential way to offering embedded youtube and vimeo videos to users,
	 * You can simply include it to any link, and lets users to decide what video they are
	 * attempt to watch.
	 */
	function pixudio_mediabox() {
		/**
		 * Check if given url is a Youtube or Vimeo url
		 *
		 * @param {*} url - video play url
		 * @return {boolean}
		 */
		var isVideoLink = function isVideoLink(url) {
			return !!/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/.test(url);
		};

		doc.querySelectorAll(".site-main a:not(.video-popup):not([href='#'])").forEach(function(a) {
			var url = a.getAttribute("href") || "";

			if (true === isVideoLink(url)) {
				classie.add(a, "video-popup");
			}
		});

		var popup = doc.querySelectorAll(".video-popup");

		// No element has found.
		if (0 === popup.length) return;

		// MediaBox has not included.
		if (false === MediaBox) return;

		// go
		MediaBox(".video-popup");
	}

	/**
	 * Banner slider developed on top of the carousel
	 */
	function pixudio_bannerSlider() {
		var carousel = doc.querySelectorAll(".banner-slider .carousel");

		// No carousel has found
		if (0 === carousel.length) return;

		var generate = function generate(scope) {
			var placeholder = scope.querySelector(".banner-slider__images__placeholder");
			var frame = scope.querySelector(".carousel__frame");
			var items = scope.querySelectorAll(".banner-slider__item");
			var figures = scope.querySelectorAll(".banner-slider__figure");
			var self = {};

			var init = function init(_ref) {
				var detail = _ref.detail;

				self = detail.self;
				var _self = self,
					currentSlide = _self.currentSlide,
					config = _self.config;

				var next = currentSlide || 0;
				var headers = scope.querySelectorAll(".banner-slider__header");
				var copies = scope.querySelectorAll(".banner-slider__copy");
				var anchors = scope.querySelectorAll(".banner-slider__anchor");
				var placeholder = scope.querySelector(".banner-slider__images__placeholder");

				// set copies animation delay
				if (1 < copies.length && 500 !== config.duration) {
					for (var i = 0, len = copies.length; i < len; i++) {
						placeholder.style.transitionDelay = config.duration + 200 + "ms";
						headers[i].style.transitionDelay = config.duration + 300 + "ms";
						copies[i].style.transitionDelay = config.duration + 400 + "ms";
						anchors[i].style.transitionDelay = config.duration + 500 + "ms";
					}
				}

				update({ detail: { next: next } });
			};

			var update = function update(_ref2) {
				var detail = _ref2.detail;

				if (win.innerWidth > 991) {
					var next = detail.next;

					var color = figures[next].getAttribute("data-color");
					var figure = figures[next].getBoundingClientRect();
					var item = items[next].getBoundingClientRect();

					placeholder.style.transform = "translateX(" + Math.abs(item.left - figure.left) + "px)";
					placeholder.style.width = figure.width + "px";
					placeholder.style.backgroundColor = color;
				}
			};

			var resize = function resize() {
				var _self2 = self,
					currentSlide = _self2.currentSlide;

				var next = currentSlide || 0;

				figures.forEach(function(figure) {
					var width = parseInt(figure.getAttribute("data-width"), 10);
					var height = parseInt(figure.getAttribute("data-height"), 10);
					var nextWidth = Math.ceil((frame.offsetHeight / height) * width);

					figure.style.width = nextWidth + "px";
				});

				update({ detail: { next: next } });
			};
			//
			resize();

			scope.addEventListener("carousel:init", init, false);
			scope.addEventListener("carousel:resize", resize, false);
			scope.addEventListener("carousel:beforeupdate", update, false);
		};
		// go
		carousel.forEach(function(scope) {
			return generate(scope);
		});
	}

	/**
	 * This touch enabled plugin lets you create a beautiful responsive carousel slider.
	 */
	function pixudio_carousel() {
		var carousel = doc.querySelectorAll(".carousel");

		// No carousel has found
		if (0 === carousel.length) return;

		// Siema has not included.
		if (false === Siema) return;

		var generate = function generate(scope) {
			var self = false;
			var onHover = false;
			var emit = null;

			// handle carousel auto height
			function resize(first) {
				if (first === false) {
					self.selector.style.height = Math.ceil(self.innerElements[self.currentSlide].clientHeight) + "px";
				}
			}

			function transforming(args) {
				classie.add(self.innerElements[self.currentSlide], "carousel__item--transforming");
				spark(scope, "carousel:beforeupdate", args);
			}

			function toNext() {
				if (true === scroll.rolling) {
					update("onScroll");
					return;
				}

				if (true === onHover) {
					update("onHover");
					return;
				}

				var next = self.currentSlide >= self.innerElements.length - 1 ? self.config.startIndex : self.currentSlide + 1;

				clearTimeout(emit);
				emit = setTimeout(function() {
					self.goTo(next);
					update("next");
					classie.remove(scope, "carousel--reverse");
				}, self.config.duration);
				transforming({ next: next });
			}

			function toPrev() {
				var next = 0 === self.currentSlide ? self.innerElements.length - 1 : self.currentSlide - 1;

				clearTimeout(emit);
				emit = setTimeout(function() {
					self.goTo(next);
					update("prev");
					classie.add(scope, "carousel--reverse");
				}, self.config.duration);
				transforming({ next: next });
			}

			function goTo(next) {
				clearTimeout(emit);
				emit = setTimeout(function() {
					self.goTo(next);
					update("dot");
					classie.remove(scope, "carousel--reverse");
				}, self.config.duration);
				transforming({ next: next });
			}

			// auto play
			function autoPlay() {
				clearTimeout(self.autoPlayTimeout);
				self.autoPlayTimeout = setTimeout(toNext, self.config.autoplay);
			}

			// handle carousel and its items classes
			function update(status) {
				self = self || this;

				if ("init" !== status && 0 < self.copies.length && 500 !== self.config.duration && true !== self.fistCopyDelaySet) {
					self.copies[0].style.animationDelay = self.config.duration + "ms";
					if (0 < self.covers.length) {
						self.covers[0].style.transformDuration = self.config.duration - 100 + "ms";
					}
					self.fistCopyDelaySet = true;
				}

				// recognise slide direction
				self.lastSlide = self.currentSlide;

				// remove all active classes
				for (var i = 0, len = self.innerElements.length; i < len; i++) {
					classie.remove(self.innerElements[i], "carousel__item--transforming");
					classie.remove(self.innerElements[i], "carousel__item--active");
					if (0 < self.dotElements.length) {
						classie.remove(self.dotElements[i], "active");
					}
				}

				// add active class to current slide
				classie.add(self.innerElements[self.currentSlide], "carousel__item--active");
				if (0 < self.dotElements.length) {
					setTimeout(function() {
						return classie.add(self.dotElements[self.currentSlide], "active");
					}, 0);
				}

				// reset
				classie.remove(scope, "carousel--on-first");
				classie.remove(scope, "carousel--on-last");

				// if first item is active
				if (false === self.config.loop && 0 === self.currentSlide) {
					classie.add(scope, "carousel--on-first");
				}

				// if last item is active
				if (false === self.config.loop && self.innerElements.length - 1 === self.currentSlide) {
					classie.add(scope, "carousel--on-last");
				}

				// scope auto height
				resize(true);

				// autoplay
				if (self.config.rotate === "on") {
					autoPlay();
				}

				spark(scope, "carousel:updated", { self: self });
			}

			// handle next, prev actions
			function init() {
				self = self || this;
				self.lastSlide = self.currentSlide;
				self.dotElements = [];
				self.dots = scope.querySelector(".carousel__dots");
				self.copies = scope.querySelectorAll(".carousel__copy");
				self.covers = scope.querySelectorAll(".carousel__cover");
				var frame = scope.querySelector(".carousel__frame");
				var prev = scope.querySelector(".carousel__prev");
				var next = scope.querySelector(".carousel__next");
				var emit = null;

				// go prev
				if (null !== prev) {
					prev.addEventListener("click", toPrev, false);
				}

				// go next
				if (null !== next) {
					next.addEventListener("click", toNext, false);
				}

				// set copies animation delay
				if (1 < self.copies.length && 500 !== self.config.duration) {
					for (var i = 1, len = self.copies.length - 1; i < len; i++) {
						self.copies[i].style.animationDelay = self.config.duration + "ms";
					}
				}

				if (1 < self.covers.length && 500 !== self.config.duration) {
					for (var _i = 1, _len = self.covers.length - 1; _i < _len; _i++) {
						self.covers[_i].style.transformDuration = self.config.duration - 100 + "ms";
					}
				}

				// generate dots
				if (null !== self.dots && false === self.config.loop) {
					for (var _i2 = 0, _len2 = self.innerElements.length; _i2 < _len2; _i2++) {
						var dot = doc.createElement("span");

						dot.innerHTML = 3000 !== self.config.autoplay ? '<i style="transition-duration: ' + self.config.autoplay + 'ms"></i>' : "<i></i>";

						dot.slideTarget = _i2;

						self.dotElements.push(dot);
						self.dots.appendChild(dot);

						dot.addEventListener("click", function() {
							if (self.currentSlide !== this.slideTarget) {
								goTo(this.slideTarget);
							}
						});
					}
				}

				if (true === self.config.stopOnHover) {
					frame.addEventListener("mouseenter", function() {
						onHover = true;
					});

					frame.addEventListener("mouseleave", function() {
						onHover = false;
					});
				}

				if (false === self.config.draggable && false !== Hammer) {
					var handle = new Hammer(scope);

					handle.on("swipeleft", toNext);
					handle.on("swiperight", toPrev);
				}

				// on window resize
				win.addEventListener(
					"resize",
					function() {
						classie.add(scope, "carousel--resizing");
						clearTimeout(emit);
						emit = setTimeout(function() {
							resize(false);
							classie.remove(scope, "carousel--resizing");
							spark(scope, "carousel:resize", { self: self });
						}, 200);
					},
					false
				);

				// on carousel__item resize
				if (false === ResizeSensor) {
					self.innerElements.forEach(function(el) {
						return new ResizeSensor(el, function() {
							return resize(false);
						});
					});
				}

				update("init");

				classie.add(scope, "carousel--init");

				spark(scope, "carousel:init", { self: self });
			}

			var config = {
				selector: scope.querySelector(".carousel__frame"),
				duration: parseInt(scope.getAttribute("data-duration"), 10) || 500,
				easing: scope.getAttribute("data-easing") || "ease",
				perPage: 1,
				threshold: 100,
				autoplay: parseInt(scope.getAttribute("data-autoplay"), 10) || 6000,
				stopOnHover: "off" === scope.getAttribute("data-stop-on-hover") ? false : true,
				draggable: "off" === scope.getAttribute("data-draggable") ? false : true,
				rotate: scope.getAttribute("data-rotate") || "on",
				onInit: init,
				onChange: update
			};

			scope.siema = new Siema(config);
		};

		// go
		carousel.forEach(function(scope) {
			return generate(scope);
		});
	}

	/**
	 * Toggle the visibility of content across your site
	 */
	function pixudio_accordion() {
		var namespace = "accordion";
		var accordions = doc.querySelectorAll("." + namespace);

		// No accordion has found
		if (0 === accordions.length) return;

		var generate = function generate(scope) {
			var cards = scope.querySelectorAll("." + namespace + "__card");
			var headers = scope.querySelectorAll("." + namespace + "__header label");

			var toggle = function toggle(trigger) {
				var card = trigger.closest("." + namespace + "__card");
				var collapse = classie.has(card, namespace + "__card--collapse");

				// collapse all
				cards.forEach(function(card) {
					return classie.add(card, namespace + "__card--collapse");
				});

				if (true === collapse) {
					classie.remove(card, namespace + "__card--collapse");
				}
			};

			headers.forEach(function(header) {
				return header.addEventListener(
					"click",
					function() {
						return toggle(header);
					},
					false
				);
			});
		};

		accordions.forEach(function(scope) {
			return generate(scope);
		});
	}

	/**
	 * Side menus, We are using this to display mobile menu, it also interact with
	 * touch events as well, although you might use it for displaying widget or something else.
	 */
	function pixudio_sideMenu() {
		// default options
		var self = {
			opened: false,
			emit: false,
			trigger: doc.querySelectorAll(".side-menu-trigger"),
			swipeable: doc.querySelectorAll(".side-menu-swipeable"),
			sidemenu: doc.querySelector(".site-sidenav__elements"),
			overlay: doc.querySelector(".site-sidenav__overlay"),
			sidemenuitems: doc.querySelectorAll(".site-sidenav__elements a"),
			classes: {
				active: "side-menu",
				display: "side-menu--display",
				avoid: "side-menu-trigger"
			}
		};

		// No element has found.
		if (null === self.sidemenu || 0 === self.sidemenu.length) return;

		// display side-menu after 50ms
		var open = function open() {
			if (false === self.opened) {
				classie.add(doc.documentElement, self.classes.active);
				setTimeout(function() {
					classie.add(doc.documentElement, self.classes.display);
					self.opened = true;
				}, 50);
			}
		};

		// hide side-menu after 300ms
		var close = function close() {
			if (true === self.opened) {
				classie.remove(doc.documentElement, self.classes.display);
				setTimeout(function() {
					classie.remove(doc.documentElement, self.classes.active);
					self.opened = false;
				}, 300);
			}
		};

		// let’s user can close the menu with swipping
		var swipe = function swipe() {
			// Hammer has not included.
			if (false === Hammer) return;

			self.swipeable.forEach(function(swipeable) {
				var now = 0,
					max = self.sidemenu.clientWidth,
					handle = new Hammer(swipeable);

				handle.on("panstart", function() {
					classie.add(doc.documentElement, "side-menu--panning");
				});

				// all out when swipe to the left
				handle.on("swipeleft", close);

				// check how much user has swipped
				handle.on("panright panleft", function(e) {
					now = now + (4 === e.direction ? Math.round(Math.max(3, e.velocity)) : Math.round(Math.min(-3, e.velocity)));

					if (now > 0) {
						now = 0;
					}

					if (Math.abs(now) > max) {
						now = max * -1;
					}

					self.overlay.style.opacity = 0.9 + (now * 1) / max;

					self.sidemenu.style.webkitTransform = "translateX(" + now + "px)";
					self.sidemenu.style.transform = "translateX(" + now + "px)";
				});

				// close / reset sidemenu status
				handle.on("panend pancancel", function() {
					classie.remove(doc.documentElement, "side-menu--panning");

					if (Math.abs(now) > max * 0.5) {
						close();
					}

					self.overlay.style.opacity = "";

					self.sidemenu.style.webkitTransform = "";
					self.sidemenu.style.transform = "";
					now = 0;
				});
			});
		};

		// activate swipe to close mode
		if (0 < self.swipeable.length) {
			swipe();
		}

		// check top navigation overflow
		var align = function align() {
			var header = {};
			header.parent = doc.querySelector(".site-header");
			header.navigation = doc.querySelector(".site-header__nav");

			if (null !== header.navigation) {
				header.list = header.navigation.querySelectorAll(".menu > li");
				header.wrap = doc.querySelector(".site-header__elements");
				header.logo = doc.querySelector(".site-header__branding");
				header.cta = doc.querySelector(".site-header__cta");
				header.more = header.navigation.querySelector(".menu > li.side-menu--more");
				header.modified = false;

				// reset
				classie.remove(header.parent, "site-header--display");
				if (null !== header.more) {
					header.navigation.querySelector(".menu").removeChild(header.more);
				}
				header.list.forEach(function(li) {
					classie.remove(li, "sr-only");
				});

				var maxOffsetWidth = header.wrap.offsetWidth - (header.logo.offsetWidth + header.cta.offsetWidth);
				header.list.forEach(function(li) {
					if (maxOffsetWidth >= header.navigation.offsetWidth) {
						return;
					}

					classie.add(li, "sr-only");
					header.modified = true;
				});

				if (true === header.modified) {
					var li = doc.createElement("li"),
						btn = doc.createElement("button");

					li.className = "side-menu--more";
					btn.innerHTML = "<i class='fas fa-ellipsis-v' aria-hidden='true'></i>";

					li.appendChild(btn);

					header.navigation.querySelector(".menu").appendChild(li);

					btn.addEventListener("click", open, false);
				}
			}
			classie.add(header.parent, "site-header--display");
		};

		// initial alignment
		align();

		// align top nav on page resize
		win.addEventListener(
			"resize",
			function() {
				classie.remove(doc.querySelector(".site-header"), "site-header--display");
				clearTimeout(self.emit);
				self.emit = setTimeout(function() {
					align();
				}, 50);
			},
			false
		);

		doc.querySelector(".site-header").addEventListener(
			"customizer:header:changed",
			function() {
				classie.remove(doc.querySelector(".site-header"), "site-header--display");
				clearTimeout(self.emit);
				self.emit = setTimeout(function() {
					align();
				}, 50);
			},
			false
		);

		// close side-menu
		doc.addEventListener(
			"click",
			function(e) {
				if (true === self.opened && e.pageX > self.sidemenu.clientWidth && false === classie.has(e.target, self.classes.avoid)) {
					close();
				}
			},
			false
		);

		// close side-menu if user click on side-menu nav items
		if (null !== self.sidemenuitems) {
			self.sidemenuitems.forEach(function(item) {
				item.addEventListener("click", close, false);
			});
		}

		// open side-menu
		if (null !== self.trigger) {
			self.trigger.forEach(function(item) {
				item.addEventListener("click", open, false);
			});
		}
	}

	/**
	 * The idea is that the widget normally sits in its typical spot at the end of the sidebar.
	 * It behaves normally as the visitor begins to scroll through your content, and
	 * as it first comes into view. But once the visitor starts to scroll past it and
	 * it’s about to disappear off the screen, the magic kicks in and makes it “stick” to the window.
	 */
	function pixudio_stickySidebar() {
		var sidebar = doc.querySelector(".post-sidebar__inner");
		var sticky = doc.querySelector(".post-sidebar__sticky");

		// No element has found.
		if (null === sidebar || null === sticky) return;

		var left = null;
		var width = null;
		var sidebarCords = {};

		var update = function update() {
			// small screens
			if (win.innerWidth < 992) {
				return;
			}

			setTimeout(function() {
				left = null;
				width = null;
				sidebarCords = sidebar.getBoundingClientRect();

				if (0 > win.innerHeight - sidebarCords.bottom) {
					left = sidebarCords.left + "px";
					width = sidebarCords.width + "px";
					classie.add(sticky, "post-sidebar__sticky--fixed");
				} else {
					classie.remove(sticky, "post-sidebar__sticky--fixed");
				}

				sticky.style.left = left;
				sticky.style.width = width;
			}, 0);
		};

		//
		setTimeout(update, 0);
		//
		win.addEventListener("scroll", update, false);
		win.addEventListener("resize", update, false);
	}

	/**
	 * Fixed headers are a popular approach for keeping the primary navigation in
	 * close proximity to the user. This can reduce the effort required for a user to
	 * quickly navigate a site. @see http://wicky.nillia.ms/headroom.js/
	 */
	function pixudio_stickyHeader() {
		var el = doc.getElementById("masthead");

		// No element has found.
		if (null === el) return;

		// Headroom has not included.
		if (false === Headroom) return;

		// construct an instance of Headroom, passing the element
		var sticky = new Headroom(el, {
			offset: el.clientHeight || 120
		});
		// initialise
		sticky.init();
	}

	/**
	 * Wrap button's content with span.btn__copy for button hover state
	 */
	function pixudio_buttonsStyle() {
		var buttons = doc.querySelectorAll("button, html [type='button'], [type='reset'], [type='submit'], .btn");

		buttons.forEach(function(btn) {
			if ("" !== btn.innerHTML) {
				btn.innerHTML = '<span class="btn__copy">' + btn.innerHTML + "</span>";
			}
		});
	}

	/**
	 * Fires when the initial HTML document has been completely loaded and parsed,
	 * without waiting for stylesheets, images, and subframes to finish loading.
	 */
	function pixudio_mailchimp(form, mcValidate) {
		form = doc.getElementById("mc-embedded-subscribe-form");

		// No element has found.
		if (null === form) return;

		mcValidate = doc.createElement("script");
		mcValidate.type = "text/javascript";
		mcValidate.src = "https://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
		doc.head.appendChild(mcValidate);
		mcValidate.onload = function() {
			var jQuery = win.jQuery || {
				noConflict: function noConflict() {}
			};
			win["fnames"] = ["EMAIL"];
			win["ftypes"] = ["email"];
			win["$mcj"] = jQuery.noConflict(true);
		};
	}

	/**
	 * Handles mouse trail effect
	 */
	function pixudio_mouse() {
		// do nothing on touch screens
		if (true === istouch) return;

		var icon = doc.querySelector(".mouse-icon");

		// No element has found.
		if (null === icon) return;

		var mouse = {
			x: 0,
			y: 0,
			threshold: 2
		};

		var animate = function animate() {
			icon.style.top = mouse.y + "px";
			icon.style.left = mouse.x + "px";
			icon.style.visibility = mouse.threshold > mouse.x || mouse.threshold > mouse.y ? "hidden" : "visible";
			requestAnimationFrame(animate);
		};

		// And get it started by calling animate().
		animate();

		var set = function set(_ref3) {
			var selectors = _ref3.selectors,
				className = _ref3.className;

			doc.querySelectorAll(selectors.join(", ")).forEach(function(el) {
				el.addEventListener("mouseover", function() {
					classie.add(icon, className);
				});

				el.addEventListener("mouseleave", function() {
					classie.remove(icon, className);
				});
			});
		};

		var elems = [
			{
				className: "mouse-icon--link", // header & footer
				selectors: [".site-header a:not([href='']):not([href='#'])", ".site-footer a:not([href='']):not([href='#'])"]
			},
			{
				className: "mouse-icon--anchor", // content
				selectors: [
					".site-content a:not([href='']):not([href='#'])",
					".site-content .btn:not([href='']):not([href='#']):not(:disabled)",
					".site-content [type='submit']:not(:disabled)",
					".widget-area a:not([href='']):not([href='#'])",
					".widget-area .btn:not([href='']):not([href='#']):not(:disabled)",
					".widget-area [type='submit']:not(:disabled)"
				]
			},
			{
				className: "mouse-icon--thumb", // archive thumbnails
				selectors: [".archive-content__thumb"]
			},
			{
				className: "mouse-icon--thumb-standard", // arc. format standard
				selectors: [".format-standard .archive-content__thumb"]
			},
			{
				className: "mouse-icon--thumb-audio", // arc. format audio
				selectors: [".format-audio .archive-content__thumb"]
			},
			{
				className: "mouse-icon--thumb-gallery", // arc. format gallery
				selectors: [".format-gallery .archive-content__thumb"]
			},
			{
				className: "mouse-icon--thumb-video", // arc. format video
				selectors: [".format-video .archive-content__thumb"]
			},
			{
				className: "mouse-icon--thumb-link", // arc. format link
				selectors: [".format-link .archive-content__thumb"]
			},
			{
				className: "mouse-icon--banner-slider", // banner slider
				selectors: [".banner-slider .carousel__frame"]
			},
			{
				className: "mouse-icon--tilt", // post navigation
				selectors: [".tilt"]
			},
			{
				className: "mouse-icon--poster", // poster
				selectors: [".poster a"]
			},
			{
				className: "mouse-icon--quote", // blockqoutes
				selectors: ["blockquote", ".archive-content .format-quote h3"]
			},
			{
				className: "mouse-icon--quote-link", // blockqoute's anchors
				selectors: ["blockquote a"]
			},
			{
				className: "mouse-icon--tabs", // tabs
				selectors: [".tabs__nav"]
			},
			{
				className: "mouse-icon--accordion", // accordion
				selectors: [".accordion__header label"]
			}
		];

		elems.forEach(function(ref) {
			return set(ref);
		});

		win.addEventListener("mousemove", function(e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		});
	}

	/**
	 * Add `lazyload--wrap-loaded` lazyload element parent, either `.poster` or closest div parent
	 */
	function pixudio_lazySizes() {
		doc.addEventListener("lazyloaded", function(e) {
			var poster = e.target.closest(".poster") || e.target.closest("div");
			if (null === poster) {
				return;
			}

			var classes = [];

			switch (e.target.nodeName) {
				case "IMG":
					if ("" !== e.target.getAttribute("src")) {
						classes.push("lazyload--wrap-img");
					}
					break;

				case "FIGURE":
					if ("" !== e.target.style.backgroundImage) {
						classes.push("lazyload--wrap-figure");
					}
					break;
			}

			if (0 !== classes.length) {
				classes.push("lazyload--wrap-loaded");
			}

			classes.forEach(function(className) {
				return classie.add(poster, className);
			});
		});
	}

	/**
	 * Poster's liquid distortion effect
	 * Add effect on mouse hover
	 */
	function pixudio_distortionEffect() {
		var posters = doc.querySelectorAll(".poster");

		// No element has found.
		if (0 === posters.length) {
			return;
		}

		// load images instead
		if (true === istouch || 0 !== win.location.protocol.indexOf("http")) {
			pixudio_loadStaticImages(posters);

			// stop
			return;
		}

		var EDGE = 40;

		var set = function set(scope, i) {
			// container
			var figure = scope.querySelector("figure");
			var source = scope.getAttribute("data-src");
			var autoplay = scope.getAttribute("data-autoplay") === "on" ? true : false;

			if (null === figure || undefined === source || null === source) {
				return;
			}

			var options = {
				displaceAutoFit: true,
				stageWidth: scope.offsetWidth * 2 || 2000,
				stageHeight: scope.offsetHeight * 2 || 2000,
				displacementImage: scope.getAttribute("data-mask") || "assets/media/mask/ripple.jpg",
				scale: scope.getAttribute("data-scale") || 14
			};

			var id = "poster_" + i;

			// setup app
			var app = new PIXI.Application(options.stageWidth, options.stageHeight, { transparent: true });

			// mask
			var sprite = new PIXI.Sprite.fromImage(options.displacementImage);
			var filter = new PIXI.filters.DisplacementFilter(sprite);
			var container = new PIXI.Container();
			container.x = 0;
			container.y = 0;

			var cover = {
				width: app.screen.width - EDGE,
				height: app.screen.height - EDGE
			};

			// draw mode
			var mode = "out";
			var image = false;
			var imgRatio = 1;
			var containerRatio = cover.height / cover.width; // container ratio

			var mask = new PIXI.Graphics();

			var resize = function resize() {
				// get scope size
				options.stageWidth = scope.offsetWidth * 2 || 2000;
				options.stageHeight = scope.offsetHeight * 2 || 2000;

				// set screen size
				// app.screen.width = options.stageWidth;
				// app.screen.height = options.stageHeight;
				app.renderer.resize(options.stageWidth, options.stageHeight);

				// set view size
				app.view.style.top = EDGE / -4 + "px";
				app.view.style.left = EDGE / -4 + "px";
				app.view.style.width = (app.screen.width + EDGE) / 2 + "px";
				app.view.style.height = (app.screen.height + EDGE) / 2 + "px";

				cover = {
					width: app.screen.width - EDGE,
					height: app.screen.height - EDGE
				};

				if (false !== mask) {
					mask.clear();
					mask.beginFill(0x000000, 0);
					mask.lineStyle(0);
					mask.drawRect(EDGE / 2, EDGE / 2, app.screen.width - EDGE, app.screen.height - EDGE);
				}

				if (false !== image) {
					// fit image size
					image.anchor.set(0.5);
					image.x = app.screen.width / 2;
					image.y = app.screen.height / 2;

					if (containerRatio > imgRatio) {
						image.height = cover.height;
						image.width = cover.height / imgRatio;
					} else {
						image.width = cover.width;
						image.height = cover.width * imgRatio;
					}
				}
			};

			var display = function display() {
				sprite.scale.x -= 2;
				sprite.scale.y -= 2;
				if (sprite.scale.y > options.scale && "over" === mode) {
					requestAnimationFrame(display);
				}
			};

			var hide = function hide() {
				sprite.scale.x += 5;
				sprite.scale.y += 5;
				sprite.y -= 100;
				if (sprite.scale.y < 100 && "out" === mode) {
					requestAnimationFrame(hide);
				}
			};

			var draw = function draw(f, res) {
				// image
				var texture = res[id].texture || new PIXI.Texture.fromImage(res[id].url);
				image = new PIXI.Sprite(texture);

				imgRatio = texture.orig.height / texture.orig.width;
				texture.baseTexture.on("loaded", function() {
					imgRatio = texture.orig.height / texture.orig.width;
					setTimeout(resize, 0);
				});

				container.addChild(image);

				// app.stage.addChild(image);
				app.stage.addChild(container);

				app.stage.addChild(mask);

				//
				setTimeout(resize, 0);

				container.mask = mask;

				sprite.anchor.set(0.5);
				sprite.x = app.screen.width / 2;
				sprite.y = app.screen.height / -1;
				sprite.width = app.screen.width * 2;
				sprite.height = app.screen.height * 2;

				sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

				sprite.scale.x = 0;
				sprite.scale.y = 0;
				sprite.rotation = 95;

				// Set the filter to stage and set some default values for the animation
				app.stage.filters = [filter];

				// PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
				filter.autoFit = options.displaceAutoFit;

				app.stage.addChild(sprite);

				// Add canvas into the scope
				figure.appendChild(app.view);

				// animation
				app.ticker.add(function() {
					if ("over" === mode && false === scroll.rolling) {
						sprite.x += 10;
					}

					// setTimeout(resize, 0);
				});

				// Opt-in to interactivity
				image.interactive = true;

				if (false === autoplay) {
					//add event listeners
					image.on("mouseover", function() {
						mode = "over";
						sprite.scale.x = 30;
						sprite.scale.y = 30;
						display();
					});

					image.on("mouseout", function() {
						mode = "out";
						hide();
					});

					image.on("mousemove", function(e) {
						if ("over" === mode && false === scroll.rolling) {
							sprite.x = e.data.global.x / 2;
							sprite.y = e.data.global.y;
						}
					});
				} else {
					mode = "over";
					sprite.scale.x = options.scale;
					sprite.scale.y = options.scale;

					doc.addEventListener(
						"mousemove",
						function(e) {
							if (false === scroll.rolling) {
								var rect = scope.getBoundingClientRect();

								if (e.screenY > rect.y && e.screenY < rect.y + rect.height && e.screenX > rect.x && e.screenX < rect.x + rect.width) {
									sprite.x = e.screenX;
									sprite.y = e.screenY;
								}
							}
						},
						false
					);
				}

				classie.add(scope, "poster--loaded");
			};

			// load
			var loader = new PIXI.loaders.Loader();

			loader.crossOrigin = true;

			loader.add(id, source);

			loader.load(draw);

			win.addEventListener("resize", resize, false);
		};

		var init = function init() {
			PIXI = win.PIXI || false;

			PIXI.utils.skipHello();
			// Setup an instance on each poster
			posters.forEach(function(poster, i) {
				return set(poster, i);
			});
		};

		if (false === PIXI) {
			var script = doc.createElement("script");
			script.onload = init;
			script.async = true;
			script.src = "assets/js/pixi.js";
			doc.head.appendChild(script);
		} else {
			setTimeout(init, 0);
		}
	}

	/**
	 * Load images, will triggers instead of liquid distortion effect on touch screens
	 */
	function pixudio_loadStaticImages(posters) {
		posters.forEach(function(scope) {
			// container
			var figure = scope.querySelector("figure");
			var source = scope.getAttribute("data-src");

			if (null === figure || undefined === source || null === source) {
				return;
			}

			figure.setAttribute("data-bg", source);
			figure.setAttribute("class", "lazyload lazyload--el");
		});
	}

	/**
	 * Google map
	 */
	function pixudio_googleMap() {
		var maps = doc.querySelectorAll(".google-map");

		// No element has found.
		if (0 === maps.length) {
			return;
		}

		var styles = {
			silver: [
				{
					elementType: "geometry",
					stylers: [
						{
							color: "#efefef"
						}
					]
				},
				{
					elementType: "labels.icon",
					stylers: [
						{
							visibility: "off"
						}
					]
				},
				{
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#32353a"
						}
					]
				},
				{
					elementType: "labels.text.stroke",
					stylers: [
						{
							color: "#f5f5f5"
						},
						{
							visibility: "off"
						}
					]
				},
				{
					featureType: "administrative.land_parcel",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#bdbdbd"
						}
					]
				},
				{
					featureType: "poi",
					elementType: "geometry",
					stylers: [
						{
							color: "#eeeeee"
						}
					]
				},
				{
					featureType: "poi",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#757575"
						}
					]
				},
				{
					featureType: "poi.park",
					elementType: "geometry",
					stylers: [
						{
							color: "#e5e5e5"
						}
					]
				},
				{
					featureType: "poi.park",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#92959a"
						}
					]
				},
				{
					featureType: "road",
					elementType: "geometry",
					stylers: [
						{
							color: "#ffffff"
						}
					]
				},
				{
					featureType: "road.arterial",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#32353a"
						}
					]
				},
				{
					featureType: "road.highway",
					elementType: "geometry",
					stylers: [
						{
							color: "#dadada"
						}
					]
				},
				{
					featureType: "road.highway",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#616161"
						}
					]
				},
				{
					featureType: "road.local",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#acb1bc"
						}
					]
				},
				{
					featureType: "transit.line",
					elementType: "geometry",
					stylers: [
						{
							color: "#e5e5e5"
						}
					]
				},
				{
					featureType: "transit.station",
					elementType: "geometry",
					stylers: [
						{
							color: "#eeeeee"
						}
					]
				},
				{
					featureType: "water",
					elementType: "geometry",
					stylers: [
						{
							color: "#c9c9c9"
						}
					]
				},
				{
					featureType: "water",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#9e9e9e"
						}
					]
				}
			],
			dark: [
				{
					elementType: "geometry",
					stylers: [
						{
							color: "#32353a"
						}
					]
				},
				{
					elementType: "labels.icon",
					stylers: [
						{
							visibility: "off"
						}
					]
				},
				{
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#72757a"
						}
					]
				},
				{
					elementType: "labels.text.stroke",
					stylers: [
						{
							color: "#37393c"
						},
						{
							visibility: "off"
						}
					]
				},
				{
					featureType: "administrative",
					elementType: "geometry",
					stylers: [
						{
							color: "#72757a"
						}
					]
				},
				{
					featureType: "administrative.country",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#92959a"
						}
					]
				},
				{
					featureType: "administrative.land_parcel",
					stylers: [
						{
							visibility: "off"
						}
					]
				},
				{
					featureType: "administrative.locality",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#b2b5ba"
						}
					]
				},
				{
					featureType: "poi",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#72757a"
						}
					]
				},
				{
					featureType: "poi.park",
					elementType: "geometry",
					stylers: [
						{
							color: "#22252a"
						}
					]
				},
				{
					featureType: "poi.park",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#62656a"
						}
					]
				},
				{
					featureType: "poi.park",
					elementType: "labels.text.stroke",
					stylers: [
						{
							color: "#22252a"
						},
						{
							visibility: "off"
						}
					]
				},
				{
					featureType: "road",
					elementType: "geometry.fill",
					stylers: [
						{
							color: "#2c2f35"
						}
					]
				},
				{
					featureType: "road",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#82858a"
						}
					]
				},
				{
					featureType: "road.arterial",
					elementType: "geometry",
					stylers: [
						{
							color: "#37393c"
						}
					]
				},
				{
					featureType: "road.highway",
					elementType: "geometry",
					stylers: [
						{
							color: "#3c3c3c"
						}
					]
				},
				{
					featureType: "road.highway.controlled_access",
					elementType: "geometry",
					stylers: [
						{
							color: "#4e4e4e"
						}
					]
				},
				{
					featureType: "road.local",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#52555a"
						}
					]
				},
				{
					featureType: "transit",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#75757a"
						}
					]
				},
				{
					featureType: "water",
					elementType: "geometry",
					stylers: [
						{
							color: "#12151a"
						}
					]
				},
				{
					featureType: "water",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#32353a"
						}
					]
				}
			]
		};

		// Google map
		var initMap = function initMap() {
			var set = function set(canvas) {
				var theme = canvas.getAttribute("data-theme");
				var address = canvas.getAttribute("data-address");
				var zoom = canvas.getAttribute("data-zoom") || 15;
				var hasMarker = "false" !== canvas.getAttribute("data-marker");
				var scrollwheel = "true" === canvas.getAttribute("data-scrollwheel");
				var icon = JSON.parse(canvas.getAttribute("data-icon")) || { url: "assets/media/icon/map-marker.svg", size: { width: 72, height: 72 } };
				var center = JSON.parse(canvas.getAttribute("data-location"));

				var draw = function draw() {
					var map = new win.google.maps.Map(canvas, {
						scrollwheel: scrollwheel,
						center: center,
						zoom: parseInt(zoom, 10),
						styles: undefined !== styles[theme] ? styles[theme] : []
					});

					if (true === hasMarker) {
						new win.google.maps.Marker({
							map: map,
							animation: win.google.maps.Animation.DROP,
							position: center,
							draggable: false,
							optimized: false,
							icon: {
								url: icon.url,
								scaledSize: new win.google.maps.Size(icon.size.width, icon.size.height)
							}
						});
					}
				};

				if (null === center) {
					var geocoder = new win.google.maps.Geocoder();
					geocoder.geocode({ address: address }, function(results, status) {
						if (status == win.google.maps.GeocoderStatus.OK) {
							center = results[0].geometry.location;
							setTimeout(draw, 0);
						}
					});
				} else {
					setTimeout(draw, 0);
				}
			};

			// Setup an instance on each map
			maps.forEach(function(canvas) {
				return set(canvas);
			});
		};

		win.initMap = initMap;

		if (false !== gClient && undefined !== gClient.maps) {
			// setTimeout(initMap, 0);
		} else {
			var script = doc.createElement("script");
			script.async = true;
			script.defer = true;
			script.src = "https://maps.googleapis.com/maps/api/js?key=" + maps[0].getAttribute("data-key") + "&callback=initMap";
			doc.head.appendChild(script);
		}
	}

	/**
	 * Comments with links, especially those that are well-written and entice readers to click a link will send visits.
	 * If the post itself continues to earn traffic, this can even be an ongoing source of referrals to your site.
	 */
	function pixudio_comments() {
		var trigger = doc.querySelector(".comments-area__trigger");

		// No element has found.
		if (null === trigger) return;

		var display = false;
		var disc = function disc() {
			if (display === true) {
				classie.add(doc.documentElement, "show-comments");
			} else {
				classie.remove(doc.documentElement, "show-comments");
			}
		};

		var check = function check() {
			display = window.location.hash.match("(comment|respond)") !== null;
			disc();
		};

		trigger.addEventListener(
			"click",
			function() {
				display = !display;
				disc();
			},
			false
		);

		setTimeout(check, 0);
		win.addEventListener("hashchange", check, false);
	}

	/**
	 * Tabs enable content organization at a high level, such as switching between views,
	 * data sets, or functional aspects of a content.
	 */
	function pixudio_tabs() {
		var tabs = doc.querySelectorAll(".tabs");

		// No element has found.
		if (0 === tabs.length) return;

		function off(target, tab, elems) {
			// item is active already
			if (true === classie.has(target, "tabs__nav--active")) {
				return;
			}

			var assignedTab = tab.querySelector('.tabs__item[data-tab="' + target.getAttribute("data-tab") + '"]');

			// no target found
			if (null === assignedTab) {
				return;
			}

			elems.forEach(function(el) {
				classie.remove(el, "tabs__nav--active");
				classie.remove(el, "tabs__item--active");
				el.setAttribute("tabindex", "-1");
			});

			classie.add(target, "tabs__nav--active");
			target.setAttribute("tabindex", "0");
			classie.add(assignedTab, "tabs__item--active");
			assignedTab.setAttribute("tabindex", "0");
		}

		function apply(tab) {
			var navs = tab.querySelectorAll(".tabs__nav");
			var elems = tab.querySelectorAll("[data-tab]");

			navs.forEach(function(nav) {
				return nav.addEventListener(
					"click",
					function() {
						return off(nav, tab, elems);
					},
					false
				);
			});
		}

		tabs.forEach(function(tab) {
			return apply(tab);
		});
	}

	/**
	 * Countdown timers accentuate urgency. They almost make a game of it by dramatizing how little time is left to act.
	 */
	function pixudio_countDownTimer() {
		var countdowns = doc.querySelectorAll(".countdown");

		// No element has found.
		if (0 === countdowns.length) return;

		function count(cdt) {
			var targetDate = cdt.getAttribute("data-count");
			// no data found
			if (undefined === targetDate) return;

			// not a valid data
			var countDownDate = new Date(targetDate).getTime();
			if (true === isNaN(countDownDate) || true === isNaN(countDownDate - 0)) return;

			var recess = 0;
			var elems = cdt.querySelectorAll(".countdown__el");
			var output = [];

			elems.forEach(function(el) {
				var display = el.getAttribute("data-display");
				if (undefined === display) {
					return false;
				}

				var displayCount = el.querySelector(".countdown__count");
				if (null === displayCount) {
					return false;
				}

				var def = displayCount.innerText || "00";

				output.push({
					type: display,
					count: displayCount,
					default: def,
					length: def.length * -1,
					max: Array(def.length + 1).join("9") * 1
				});
			});

			function calc() {
				// Get todays date and time
				var now = new Date().getTime();
				// Find the distance between now an the count down date
				var distance = countDownDate - now;
				// If the count down is over, write some text
				if (distance < 0) {
					clearInterval(recess);
					console.warn("Countdown timer is expired!", { element: cdt, target: targetDate });
					return false;
				}

				// Time calculations for days, hours, minutes and seconds
				var time = {
					days: Math.floor(distance / (1000 * 60 * 60 * 24)),
					hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
					minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
					seconds: Math.floor((distance % (1000 * 60)) / 1000)
				};

				output.forEach(function(o, i) {
					var n = time[o.type];
					if (undefined === o) {
						return false;
					}

					output[i].count.innerText = n < output[i].max ? (output[i].default + n).slice(output[i].length) : n;
				});
			}

			// First run
			calc();

			// Update the count down every 1 second
			recess = setInterval(calc, 1000);
		}

		countdowns.forEach(function(countdown) {
			return count(countdown);
		});
	}

	/**
	 * Provide contextual feedback messages for typical user actions with
	 * the handful of available and flexible alert messages.
	 */
	function pixudio_alerts() {
		var alerts = doc.querySelectorAll(".alert .close");

		// No element has found.
		if (0 === alerts.length) return;

		alerts.forEach(function(alert) {
			return alert.addEventListener(
				"click",
				function() {
					return classie.add(alert.closest(".alert"), "sr-only");
				},
				false
			);
		});
	}

	/**
	 * Fires when the initial HTML document has been completely loaded and parsed,
	 * without waiting for stylesheets, images, and subframes to finish loading.
	 */
	function pixudio_init() {
		// add “is-touch” class to html tag if browser's touch APIs implemented,
		// whether or not the current device has a touchscreen.
		if (true === istouch) {
			classie.add(doc.documentElement, "is-touch");
		}

		// add “is-mac" class to html tag if OS is macintosh.
		if (true === isMac) {
			classie.add(doc.documentElement, "is-mac");
		}

		// add “is-chrome" class to html tag if browser is google chrome.
		if (true === isChrome) {
			classie.add(doc.documentElement, "is-chrome");
		}

		// Setup "masonry"
		setTimeout(pixudio_masonry, timing.masonry || 0);

		// Setup "mediabox"
		setTimeout(pixudio_mediabox, timing.mediabox || 0);

		// Setup banner slider
		setTimeout(pixudio_bannerSlider, timing.bannerSlider || 0);

		// Setup “carousel”
		setTimeout(pixudio_carousel, timing.carousel || 0);

		// Setup “accordion”
		setTimeout(pixudio_accordion, timing.accordion || 0);

		// Setup “side menu”
		setTimeout(pixudio_sideMenu, timing.sideMenu || 0);

		// Setup “sticky sidebar
		setTimeout(pixudio_stickySidebar, timing.stickySidebar || 0);

		// Setup “sticky header”
		setTimeout(pixudio_stickyHeader, timing.stickyHeader || 50);

		// Setup “sticky header”
		setTimeout(pixudio_buttonsStyle, timing.buttonsStyle || 0);

		// Setup "mailchimp"
		setTimeout(pixudio_mailchimp, timing.mailchimp || 0);

		// Setup "mouse"
		setTimeout(pixudio_mouse, timing.mouse || 1000);

		// Setup "hover link"
		setTimeout(pixudio_hoverLink, timing.hoverLink || 0);

		// Setup "tilt"
		setTimeout(pixudio_tilt, timing.tilt || 0);

		// Setup "lazysizes"
		setTimeout(pixudio_lazySizes, timing.lazySizes || 0);

		// Setup "distortion effect"
		setTimeout(pixudio_distortionEffect, timing.distortionEffect || 50);

		// Setup "google map"
		setTimeout(pixudio_googleMap, timing.googleMap || 500);

		// Setup "comments"
		setTimeout(pixudio_comments, timing.comments || 50);

		// Setup "tabs"
		setTimeout(pixudio_tabs, timing.tabs || 50);

		// Setup "countdown timer"
		setTimeout(pixudio_countDownTimer, timing.countDownTimer || 0);

		// Setup "alrets"
		setTimeout(pixudio_alerts, timing.alerts || 0);
	}

	// document ready
	setTimeout(function() {
		return classie.add(doc.documentElement, "ready");
	}, 100);

	/**
	 * Fires when a resource and its dependent resources have finished loading.
	 */
	function pixudio_onload() {
		// add “loaded” class to html tag,
		classie.add(doc.documentElement, "loaded");
	}
	win.addEventListener("load", pixudio_onload);

	/**
	 * Deactivate animations on user scroll
	 */
	win.addEventListener("scroll", function() {
		clearTimeout(scroll.emit);
		scroll.rolling = true;
		scroll.emit = setTimeout(function() {
			scroll.rolling = false;
		}, 100);
	});

	// trigger on document.ready scripts
	pixudio_init();
})(document, window);
