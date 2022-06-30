(function ($) {
    var body = $('body'),
        doc = $(document),
        html = $('html'),
        win = $(window),
        wrapperOverlaySlt = '.wrapper-overlay, .close-mm, .overlay-mn',
        iconNav,
        dropdownCart,
        miniProductList;
    var wishListsArr = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    doc.ready(function () {
        iconNav = $('[data-menu-mb-toogle]'),
        dropdownCart = $('#dropdown-cart'),
        miniProductList = dropdownCart.find('.mini-products-list');

        doc.ajaxStart(function () {
            soun.isAjaxLoading = true;
        });

        doc.ajaxStop(function () {
            soun.isAjaxLoading = false;
        });

        soun.init(); 
        doc

        .on('shopify:section:load', soun.initSliderFeaturedProducts)
        .on('shopify:section:unload', soun.initSliderFeaturedProducts)
        .on('shopify:section:load', soun.initBrandsSlider)
        .on('shopify:section:unload', soun.initBrandsSlider)
    });

    var winWidth = win.innerWidth();

    win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
        var resizeTimerId;

        clearTimeout(resizeTimerId);

        resizeTimerId = setTimeout(function() {
            var curWinWidth = win.innerWidth();

            if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
                soun.initToggleMuiltiLangCurrency();
                soun.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
                soun.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
                soun.dropdownCart();
                soun.dropdownCustomer();

                soun.stickyFixedTopMenu();
            };
            winWidth = curWinWidth;
        }, 0);
    });

    win.on('resize', function () {
        soun.setActiveViewModeMediaQuery();
    });

    var soun = {
        sounTimeout: null,
        isSidebarAjaxClick: false,
        isAjaxLoading: false,
        init: function () {
            this.closeHeaderTop();
            this.closeAllOnMobile();
            this.initToggleMuiltiLangCurrency();
            this.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
            this.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
            this.initScrollTop();
            this.dropdownCart();
            this.dropdownCustomer();
            this.addEventShowOptions();
            this.changeQuantityAddToCart();
            this.initAddToCart();
            this.initColorSwatchGrid();
            this.initCountdownNormal();
            this.intTermConditionsChecked();
            this.initShowMoreCollections();
            this.initSliderFeaturedProducts();
//           -----
            this.smoothScrolling();
            this.videoProductPopup();
            this.header_mobile();
            this.openSubmenuMobile();

            this.changeSwatchValue();

            if(body.hasClass('template-index')) {
                this.handleScrollDown();
            }
            this.initProductMoreview($('[data-more-view-product] .product-img-box'));
            
            this.initCustomerViewProductShop();
            this.initChangeQuantityButtonEvent();
            this.initQuantityInputChangeEvent();
            this.removeCartItem();
            this.initZoom();
            this.stickyFixedTopMenu();
            this.initQuickView();
            this.openSearchForm();
            this.initBrandsSlider();
           

            // sidebar 
            if(body.hasClass('template-collection') || body.hasClass('template-search')) {
                this.historyAdapter();
                this.initPaginationPage();
            }
            if(body.hasClass('template-collection')) {
                this.filterToolbar();
                this.filterSidebar();
            }

            this.initSidebar();

            if(body.hasClass('template-product') ) {
                this.initSoldOutProductShop();
                this.changeSwatch('#add-to-cart-form .swatch :radio');
                this.wrapTable();
                this.productRecomendation();
                this.appendProductRecomendation();
                this.setShowmore_description();
                if($('#different_product_des').length > 0 ){
                    this.doAjaxDescriptionPr();
                }
                if($('.frequently-bought-together-block').length > 0){
                    this.initBundleProducts();
                }
            }
            this.initWishListIcons();
            this.doAddOrRemoveWishlish();
            if(body.hasClass('template-page') && $('.wishlist-page').length) {
                this.initWishLists();
            };
            
        },

        closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();
                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },

        closeAllOnMobile: function () {
            body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.removeClass('translate-overlay cart-show customer-show sidebar-open options-show');
                $('.close-menu-mb').removeClass('menu-open');

                $('.main-menu.jas-mb-style').css({
                    "overflow": ""
                });
                $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
            });
        },

        initToggleMuiltiLangCurrency: function () {
            var langCurrencyGroups = $('.lang-currency-groups'),
                dropdownGroup = langCurrencyGroups.find('.btn-group'),
                dropdownLabel = dropdownGroup.find('.dropdown-label');

            if (dropdownLabel.length && dropdownLabel.is(':visible')) {
                dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var selfNextDropdown = $(this).next();

                    if (!selfNextDropdown.is(':visible')) {
                        dropdownLabel.next('.dropdown-menu').hide();
                        selfNextDropdown.slideDown(300);
                    } else {
                        selfNextDropdown.slideUp(300);
                    }
                });

                soun.hideMuiltiLangCurrency();
            } else {
                dropdownLabel.next('.dropdown-menu').css({
                    'display': ''
                });
            };
        },

        hideMuiltiLangCurrency: function () {
            doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
                var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

                if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                    muiltiDropdown.slideUp(300);
                }
            });
        },

        addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
            if (label.length && label.is(':visible')) {
                var item = dataSlt.html();

                SltId.prev(label).html(item);
            };
        },

        initScrollTop: function () {
            var backToTop = $('#back-top');

            win.scroll(function () {
                if ($(this).scrollTop() > 220) {
                    backToTop.fadeIn(1200);
                } else {
                    backToTop.fadeOut(1200);
                };
            });

            backToTop.off('click.scrollTop').on('click.scrollTop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('html, body').animate({
                    scrollTop: 0
                }, 1200);
                return false;
            });
        },

        dropdownCustomer: function () {
            this.initDropdownCustomerTranslate($('[data-user-mobile-toggle]'), 'customer-show');

            if (window.innerWidth >= 1200) {
                this.initDropdownCustomerTranslate($('[data-user-pc-translate]'), 'customer-show');
            };

            this.closeDropdownCustomerTranslate();
            this.initDropdownCustomer();
        },

        initDropdownCustomerTranslate: function (iconUser, sltShowUser) {
            if (iconUser.length && iconUser.is(':visible')) {
                iconUser.off('click.dropdownCustomerMobile').on('click.dropdownCustomerMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.addClass(sltShowUser);
                });
            };
        },

        closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closeCustomer', closeElm).on('click.closeCustomer', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });
            };
        },

        closeDropdownCustomerTranslate: function () {
            soun.closeTranslate('#dropdown-customer .close-customer', 'customer-show');
        },

        appendCustomerForPCHeaderDefault: function () {
            var customerLink = $('.header-default .header-panel-bt .customer-links'),
                dropdowCustomer = $('#dropdown-customer');

            if (window.innerWidth >= 1200) {
                dropdowCustomer.appendTo(customerLink);
            } else {
                dropdowCustomer.appendTo(body);
            }
        },

        doDropdownCustomerPCHeaderDefault: function () {
            var customerLoginLink = $('[data-dropdown-user]');

            if(window.innerWidth >= 1200) {
                customerLoginLink.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).siblings('#dropdown-customer').slideToggle();
                });

            }
        },

        initDropdownCustomer: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                this.appendCustomerForPCHeaderDefault();
                this.doDropdownCustomerPCHeaderDefault();
            }
        },

        dropdownCart: function () {
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (window.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        closeDropdownCartTranslate: function () {
            soun.closeTranslate('#dropdown-cart .close-cart', 'cart-show');
        },

        initDropdownCartMobile: function () {
            var headerMb = $('.header-mb, [data-cart-header-parallax], [data-cart-header-02], [data-cart-header-04], [data-cart-header-supermarket]'),
                cartIcon = headerMb.find('[data-cart-toggle]');

            cartIcon.off('click.initDropdownCartMobile').on('click.initDropdownCartMobile', function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('cart-show');
            });
        },

        initDropdownCartDesktop: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                soun.appendDropdownCartForMobile();
                soun.initDropdownCartForHeaderDefault();
            }
        },

        addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            soun.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },

        initDropdownCartForHeaderDefault: function () {
            var wrapperTopCart = $('.wrapper-top-cart'),
                cartIcon = wrapperTopCart.find('[data-cart-toggle]');

            if (cartIcon.length && cartIcon.is(':visible')) {
                if (window.dropdowncart_type == 'click') {
                    cartIcon.off('click.toogleDropdownCart').on('click.toogleDropdownCart', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        wrapperTopCart.toggleClass('is-open');
                        dropdownCart.slideToggle();
                    });
                } else {
                    cartIcon.hover(function () {
                        var customer = $('#dropdown-customer');

                        if (customer.is(':visible')) {
                            customer.hide();
                        };

                        if (!wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.addClass('is-open');
                            dropdownCart.slideDown();
                        }
                    });

                    wrapperTopCart.mouseleave(function () {
                        if (wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.removeClass('is-open');
                            dropdownCart.slideUp();
                        };
                    });
                }
            } else {
                dropdownCart.css("display", "");
            }
        },

        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    soun.doUpdateDropdownCart(cart);
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                soun.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>{VARIANT}</small></div><div class="cart-collateral"><span class="qtt">{QUANTITY} X </span><span class="price">{PRICE}</span></div></div></li>';

            $('[data-cart-count]').text(cart.item_count);

            dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, soun.translateText(cart.items[i].product_title));
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

                    miniProductList.append(item);
                }

                soun.removeItemDropdownCart(cart);

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#dropdown-cart span.money', 'money_format');

                }
            }

            soun.checkItemsInDropdownCart();
        },

        translateText: function (str) {
            if (!window.multi_lang || str.indexOf("|") < 0)
                return str;

            if (window.multi_lang) {
                var textArr = str.split("|");

                if (translator.isLang2())
                    return textArr[1];
                return textArr[0];
            };
        },

        
        checkNeedToConvertCurrency: function () {
            
            return (window.show_multiple_currencies === true && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        },

        showLoading: function () {
            $('.loading-modal').show();
        },

        hideLoading: function () {
            $('.loading-modal').hide();
        },

        showModal: function (selector) {
            $(selector).fadeIn(500);

            soun.sounTimeout = setTimeout(function () {
                $(selector).fadeOut(500);
            }, 5000);
        },

        translateBlock: function (blockSelector) {
            if (window.multi_lang && translator.isLang2()) {
                translator.doTranslate(blockSelector);
            }
        },

        closeLookbookModal: function () {
            $('.ajax-lookbook-modal').fadeOut(500);
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;

            if (window.innerWidth > 767) {
                if (left > (innerLookbookModal + 31)) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }

                newtop = top - (innerLookbookModal / 2) + "px";
            } else {
                newleft = 0;
                newtop = top - 30 + "px";
            };

            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url:  window.router + '/products/' + handle + '?view=json',

                success: function (data) {
                    $('.ajax-lookbook-modal').css({
                        'left': newleft,
                        'top': newtop
                    });

                    $('.ajax-lookbook-modal .lookbook-content').html(data);

                    soun.translateBlock('.lookbook-content');
                    $('.ajax-lookbook-modal').fadeIn(500);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);

                    soun.showModal('.ajax-error-modal');
                }
            });
        },

        openEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeIn(1000);
        },

        closeEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeOut(1000);

            var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');

            if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
                $.cookie('emailSubcribeModal', 'closed', {
                    expires: 1,
                    path: '/'
                });
        },
        // description one product detail
        doAjaxDescriptionPr:function(){
            var mainContent = $("#different_product_des");
            var handle_page = mainContent.data('product-handle');
            $.ajax({
                type: 'GET',
                url: window.router + '/pages/'+ handle_page,
                cache: false,
                dataType: 'html',
                success: function(data) {
                  var content = $(data).find(".description_different_product");
                  mainContent.append(content);
                },
                complete: function() {
                   
                }
                
            });
        },

        // end

        // update sidebar 
        initSidebarProductSlider: function () {
            var sidebarWidgetProduct = $('[data-sidebar-product]');

            sidebarWidgetProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid');

                if (productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: false,
                        dots: true,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>'
                    });
                }
            });
        },
        initOpenSidebar: function () {
            var sidebarLabelSlt = '.sidebar-label',
                sidebarLabelElm = $(sidebarLabelSlt);

            if (sidebarLabelElm.length) {
                body.off('click.openSidebar').on('click.openSidebar', sidebarLabelSlt, function () {
                    html.addClass('sidebar-open');
                })
            }
        },

        closeSidebar: function () {
            soun.closeTranslate('.sidebar .close-sidebar', 'sidebar-open');
        },
        initSidebar: function () {
            this.initSidebarProductSlider();
            this.initOpenSidebar();
            this.closeSidebar();
            this.initDropdownSubCategoriesAtSidebar();
            this.initToggleWidgetTitleSidebarFilter();
        },
        initDropdownSubCategoriesAtSidebar: function () {
            var iconDropdownSlt = '.sidebar-links li.dropdown';
            var linkDropdownSlt = '.sidebar-links li.dropdown a';

            body.off('click.toggleSubCategories').on('click.toggleSubCategories', iconDropdownSlt, function (e) {
                e.stopPropagation();

                var self = $(this),
                    dropdown = self.find('> .dropdown-cat');

                if (self.hasClass('open')) {
                    self.removeClass('open');
                    dropdown.slideUp();
                } else {
                    self.addClass('open');
                    dropdown.slideDown();
                };
            })

            body.off('click.linktoCollection').on('click.linktoCollection', linkDropdownSlt, function (e) {
                e.stopPropagation();
            })
        },
        historyAdapter: function () {
            var collTpl = $('[data-section-type="collection-template"]');

            if (collTpl.length) {
                History.Adapter.bind(window, 'statechange', function () {
                    var State = History.getState();

                    if (!soun.isSidebarAjaxClick) {
                        soun.queryParams();

                        var newurl = soun.ajaxCreateUrl();

                        soun.doAjaxToolbarGetContent(newurl);
                        soun.doAjaxSidebarGetContent(newurl);
                    }

                    soun.isSidebarAjaxClick = false;
                });
            };
        },
        
        // end update sidebar

        // Update Toolbar
        filterToolbar: function () {
            this.queryParams();
            this.setTextForSortbyFilter();
            this.setTextForLimitedFilter();
            this.ajaxFilterSortby();
            this.ajaxFilterLimit();
            this.addEventViewModeLayout();
        },
        setTextForSortbyFilter: function () {
            var filterSortby = $('[data-sortby]'),
                labelTab = filterSortby.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                sortbyLinkActive = labelTab.next().find('li.active'),
                text = sortbyLinkActive.text();

            labelText.text(text);
            if (Shopify.queryParams.sort_by) {
                var sortBy = Shopify.queryParams.sort_by,
                    sortByLinkActive = filterSortby.find('span[data-href="' + sortBy + '"]'),
                    sortByText = sortByLinkActive.text();

                labelText.text(sortByText);
                labelTab.next().find('li').removeClass('active');
                sortByLinkActive.parent().addClass('active');
            };
        },
        setTextForLimitedFilter: function () {
            var filterLimited = $('[data-limited-view]'),
                labelTab = filterLimited.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                limitedLinkActive = labelTab.next().find('li.active'),
                text = limitedLinkActive.text();
                labelText.text(text);

            if (filterLimited.length) {
                var limited = filterLimited.find('li.active span').data('value'),
                    limitedActive = filterLimited.find('span[data-value="' + limited + '"]'),
                    limitedText = limitedActive.text();

                labelText.text(limitedText);
                labelTab.next().find('li').removeClass('active');
                limitedActive.parent().addClass('active');
            };
        },
        ajaxFilterSortby: function () {
            var sortbyFilterSlt = '[data-sortby] li span',
                sortbyFilter = $(sortbyFilterSlt);

            body.off('click.sortBy', sortbyFilterSlt).on('click.sortBy', sortbyFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    Shopify.queryParams.sort_by = $(this).attr('data-href');

                    soun.filterAjaxClick();

                    var newurl = soun.ajaxCreateUrl();

                    soun.doAjaxToolbarGetContent(newurl);
                };

                sortbyFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },
        ajaxFilterLimit: function () {
            var limitFilterSlt = '[data-limited-view] li span',
                limitFilter = $(limitFilterSlt);

            body.off('click.sortBy', limitFilterSlt).on('click.sortBy', limitFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    var dataValue = self.data('value'),
                        value = "" + dataValue + "";

                    $('[data-limited-view] .label-tab .label-text').text(value);

                    soun.doAjaxLimitGetContent(value);

                };

                limitFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },
        addEventViewModeLayout: function () {
            soun.setActiveViewModeMediaQuery();

            body.on('click', '.view-mode .icon-mode', function (e) {
                e.preventDefault();

                var self = $(this),
                    col = self.data('col'),
                    parents = self.closest('[data-view-as]');

                if (!self.hasClass('active')) {
                    parents.find('.icon-mode').removeClass('active');
                    self.addClass('active');

                    soun.viewModeLayout();
                };

            });
        },
        // End Update Toolbar

        // Update sidebar 
        filterSidebar: function () {
            this.queryParams();
            this.ajaxFilterTags();
            this.ajaxFilterClearTags();
            this.ajaxFilterClearAll();
        },
        ajaxFilterTags: function () {
            body.off('click.filterTags').on('click.filterTags', '.sidebar-tags .list-tags a, .sidebar-tags .list-tags label, .refined .selected-tag', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var newTags = [];

                if (Shopify.queryParams.constraint) {
                    newTags = Shopify.queryParams.constraint.split('+');
                };

                //one selection or multi selection
                if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
                    //remove other selection first
                    var otherTag = $(this).closest('.sidebar-tags, .refined-widgets').find('input:checked');

                    if (otherTag.length) {
                        var tagName = otherTag.val();

                        if (tagName) {
                            var tagPos = newTags.indexOf(tagName);

                            if (tagPos >= 0) {
                                //remove tag
                                newTags.splice(tagPos, 1);
                            }
                        }
                    };
                };

                var tagName = $(this).prev().val();

                if (tagName) {
                    var tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    } else {
                        newTags.push(tagName);
                    };
                };

                if (newTags.length) {
                    Shopify.queryParams.constraint = newTags.join('+');
                } else {
                    delete Shopify.queryParams.constraint;
                };

                soun.filterAjaxClick();

                var newurl = soun.ajaxCreateUrl();

                soun.doAjaxSidebarGetContent(newurl);
            });
        },
        ajaxFilterClearTags: function () {
            var sidebarTag = $('.sidebar-tags');

            sidebarTag.each(function () {
                var sidebarTag = $(this);

                if (sidebarTag.find('input:checked').length) {
                    //has active tag
                    sidebarTag.find('.clear').show().click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var currentTags = [];

                        if (Shopify.queryParams.constraint) {
                            currentTags = Shopify.queryParams.constraint.split('+');
                        };

                        sidebarTag.find("input:checked").each(function () {
                            var selectedTag = $(this);
                            var tagName = selectedTag.val();

                            if (tagName) {
                                var tagPos = currentTags.indexOf(tagName);
                                if (tagPos >= 0) {
                                    //remove tag
                                    currentTags.splice(tagPos, 1);
                                };
                            };
                        });

                        if (currentTags.length) {
                            Shopify.queryParams.constraint = currentTags.join('+');
                        } else {
                            delete Shopify.queryParams.constraint;
                        };

                        soun.filterAjaxClick();

                        var newurl = soun.ajaxCreateUrl();

                        soun.doAjaxSidebarGetContent(newurl);
                    });
                }
            });
        },
        ajaxFilterClearAll: function () {
            var clearAllSlt = '.refined-widgets a.clear-all';
            var clearAllElm = $(clearAllSlt);

            body.off('click.clearAllTags', clearAllSlt).on('click.clearAllTags', clearAllSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                delete Shopify.queryParams.constraint;

                soun.filterAjaxClick();

                var newurl = soun.ajaxCreateUrl();

                soun.doAjaxSidebarGetContent(newurl);
            });
        },
        doAjaxSidebarGetContent: function (newurl) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxMapData(data);
                    soun.initColorSwatchGrid();
                    soun.ajaxFilterClearTags();

                    soun.initSidebarProductSlider();
                    soun.initCountdownNormal();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },
        initToggleWidgetTitleSidebarFilter: function () {
            var widgetTitleSlt = '[data-has-collapse] .widget-title';

            body.off('click.toggleWidgetContent').on('click.toggleWidgetContent', widgetTitleSlt, function () {
                $(this).toggleClass('open');
                $(this).next().slideToggle();
            });

            var widgetTitleSltCollNoSidebar = '[data-has-collapse-no-sidebar] .widget-title';

            if(win.innerWidth() < 1200) {
                body.off('click.toggleWidgetContent2').on('click.toggleWidgetContent2', widgetTitleSltCollNoSidebar, function () {
                    $(this).toggleClass('open');
                    $(this).next().slideToggle();
                });
            }
        },

        // End Update Sidebar

        // Update page QuickView
        initQuickView: function () {
            body.off('click.initQuickView', '.quickview-button').on('click.initQuickView', '.quickview-button', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var href = $(this).attr('id');
                soun.doAjaxShowQuickView(href);
                 body.addClass('popup-quickview'); 

                soun.closeSuccessModal();
            });
        },
        doAjaxShowQuickView: function (href) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url:   window.router + '/products/' + href + '?view=quickview',

                beforeSend: function () {
                    soun.showLoading();

                    html.css({
                        "overflow": "hidden"
                    });
                },

                success: function (data) {
                    var quickviewModal = $('[data-quickview-modal]'),
                        modalContent = quickviewModal.find('.halo-modal-body');

                    modalContent.html(data);

                    setTimeout(function () {
                        soun.translateBlock('[data-quickview-modal]');
                        soun.initProductMoreview($('[data-more-view-product-qv] .product-img-box'));
                        soun.initSoldOutProductShop();
                        soun.initCustomerViewProductShop();
                        soun.changeSwatch('.quickview-tpl .swatch :radio');
                        soun.initZoom();
                        soun.setAddedForWishlistIcon(href);
                        soun.initCountdownNormal();
                        soun.changeSwatchValue();
                        soun.initWishLists();
                        if (soun.checkNeedToConvertCurrency()) {
                          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        };
                    }, 500);

                    soun.hideLoading();

                    quickviewModal.fadeIn(600, function () {

                        if ($('[data-ajax-cart-success]').is(':visible')) {
                            $('[data-ajax-cart-success]').hide();
                        }
                    });
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.hideLoading();
                    soun.showModal('.ajax-error-modal');
                }
            });
        },

        // End Update page Quickview

        // Update WishList Page
        createWishListTplItem: function(ProductHandle) {
            var wishListCotainer = $('[data-wishlist-container]');

            jQuery.getJSON( window.router + '/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
                productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'">';
                productHTML += '<div class="column col-img"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div></div>';
                productHTML += '<div class="column col-prod">';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a>';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div></div>'; 
                productHTML += '<div class="column col-price text-center"><div class="price-box">'+ price_min +'</div></div>';
                productHTML += '<div class="column col-remove text-center"><a class="whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>';
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-' + product.id +'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" data-form-id="#wishlist-product-form-' + product.id +'" type="submit">'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
                    }
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                } else {
                    productHTML += '<button class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                }

                productHTML += '</form></div>';
              productHTML += '</div></div>';

                wishListCotainer.append(productHTML);
              soun.initAddToCart();
              soun.doAddOrRemoveWishlish();
                var regex = /(<([^>]+)>)/ig;
                var href = $('.wrapper-wishlist a.share').attr("href");
                href += encodeURIComponent( product.title + '\nPrice: ' + price_min.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + product.url +'\n\n');
                $('.wrapper-wishlist a.share').attr("href", href );
            });
        },
       
        setAddedForWishlistIcon: function(ProductHandle) {
            var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
                idxArr = wishListsArr.indexOf(ProductHandle);

            if(idxArr >= 0) {
                wishlistElm.addClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            }
            else {
                wishlistElm.removeClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.add_wishlist);
            };
        },
        doAddOrRemoveWishlish: function() {
            var iconWishListsSlt = '[data-icon-wishlist]';
          
            doc.off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
              e.preventDefault();
                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('product-handle'),
                    idxArr = wishListsArr.indexOf(ProductHandle);

                if(!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.remove_wishlist);

                    if($('[data-wishlist-container]').length) {
                        soun.createWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('items', JSON.stringify(wishListsArr));
                } else {
                    self.removeClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.add_wishlist);

                    if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('items', JSON.stringify(wishListsArr));

                    
                };

                soun.setAddedForWishlistIcon(ProductHandle);
            });
        },
        initWishListIcons: function() {
            var wishListItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

            if (!wishListItems.length) {
                return;
            }

            for (var i = 0; i < wishListItems.length; i++) {
                var icon = $('[data-product-handle="'+ wishListItems[i] +'"]');
                icon.addClass('whislist-added');
                icon.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            };
        },
        initWishLists: function() {
            if (typeof(Storage) !== 'undefined') {
                var data = JSON.parse(localStorage.getItem('items'));

                if (data.length <= 0) {
                    return;
                }

                data.forEach(function(item) {
                    soun.createWishListTplItem(item);
                });

                this.translateBlock('.wishlist-page');

            } else {
                alert('Sorry! No web storage support..');
            }
        },

        // End Update WishLisst Page

        initColorSwatchGrid: function () {
            var itemSwatchSlt = '.item-swatch li label';

            body.off('click.toggleClass').on('click.toggleClass', itemSwatchSlt, function () {
                var self = $(this),
                    productItemElm = self.closest('.grid-item, .grid__item'),
                    sidebarWidgetProduct = productItemElm.closest('.sidebar-widget-product');

                $('.item-swatch li label').removeClass('active');
                self.addClass('active');

                var newImage = self.data('img');

                if (sidebarWidgetProduct.length) {
                    newImage = newImage.replace('800x', 'large');
                }

                if (newImage) {
                    productItemElm.find('.product-grid-image .images-one').attr({
                        src: newImage,
                        "srcset": newImage,
                        "data-src": newImage
                    });

                    return false;
                }
            });
        },

        initPaginationPage: function () {
            var paginationSlt = '.pagination-page a , .infinite-scrolling a ';

            body.off('click', paginationSlt).on('click', paginationSlt, function (e) {
                if(Shopify.queryParams){
                    e.preventDefault();

                var page = $(this).attr('href').match(/page=\d+/g);

                if (page) {
                    Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
                    if (Shopify.queryParams.page) {
                        var newurl = soun.ajaxCreateUrl();

                        soun.isSidebarAjaxClick = true;

                        History.pushState({
                            param: Shopify.queryParams
                        }, newurl, newurl);

                        soun.doAjaxToolbarGetContent(newurl);

                        var elm = $('[data-section-type="collection-template"] .toolbar');

                        if (!elm.length) {
                            elm = $('[data-search-page]');
                        }

                        var top = elm.offset().top;

                        $('body,html').animate({
                            scrollTop: top
                        }, 600);
                    };
                };
                }


            });
        },

        queryParams: function () {
            Shopify.queryParams = {};

            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        },

        filterAjaxClick: function (baseLink) {
            delete Shopify.queryParams.page;

            var newurl = soun.ajaxCreateUrl(baseLink);

            soun.isSidebarAjaxClick = true;

            History.pushState({
                param: Shopify.queryParams
            }, newurl, newurl);
        },

        ajaxCreateUrl: function (baseLink) {
            var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

            if (baseLink) {
                if (newQuery != "")
                    return baseLink + "?" + newQuery;
                else
                    return baseLink;
            }
            return location.pathname + "?" + newQuery;
        },
        doAjaxLimitGetContent: function (value) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "Post",
                url:  window.router + '/cart.js',
                data: {
                    "attributes[pagination]": value
                },

                success: function (data) {
                    window.location.reload();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },
                dataType: 'json'
            });
        },

        doAjaxToolbarGetContent: function (newurl) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxMapData(data);
                    soun.initColorSwatchGrid();
                    soun.setTextForSortbyFilter();
                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    };
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },
        doAjaxSidebarGetContent: function (newurl) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxMapData(data);
                    soun.initColorSwatchGrid();
                    soun.ajaxFilterClearTags();
                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    };
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        ajaxMapData: function (data) {
            var curCollTemplate = $('.collection-template'),
                curBreadcrumb = curCollTemplate.find('.breadcrumb'),
                curSidebar = curCollTemplate.find('.sidebar'),
                curCollHeader = curCollTemplate.find('.collection-header'),
                curProColl = curCollTemplate.find('.product-collection'),
                curPadding = curCollTemplate.find('.padding'),

                newCollTemplate = $(data).find('.collection-template'),
                newBreadcrumb = newCollTemplate.find('.breadcrumb'),
                newSidebar = newCollTemplate.find('.sidebar'),
                newCollHeader = newCollTemplate.find('.collection-header'),
                newProColl = newCollTemplate.find('.product-collection'),
                newPadding = newCollTemplate.find('.padding');

            curBreadcrumb.replaceWith(newBreadcrumb);
            curSidebar.replaceWith(newSidebar);
            curCollHeader.replaceWith(newCollHeader);
            curProColl.replaceWith(newProColl);

            if (curPadding.length > 0) {
                curPadding.replaceWith(newPadding);
            } else {
                if(curCollTemplate.find('.col-main').length) {
                    curCollTemplate.find('.col-main').append(newPadding);
                } else {
                    curCollTemplate.find('.col-no-sidebar').append(newPadding);
                }

            };

            soun.translateBlock('.collection-template');

            if ($('[data-view-as]').length) {
                soun.viewModeLayout();
            };

            if (soun.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        },
        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.grid-item'),
                strClass = 'col-12 col-6 col-md-4 col-lg-3 col5',
                gridClass = 'grid-2 grid-3 grid-4 grid-5 products-grid products-list';

            switch (col) {
                case 1:
                    if(gridItem.hasClass('grid-item-mansory')) {
                        products.removeClass(gridClass).addClass('products-list');
                    } else {
                        products.removeClass('products-grid').addClass('products-list');
                    }

                    gridItem.removeClass(strClass).addClass('col-12');
                    break;

                default:
                    switch (col) {
                        case 2:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-2');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6');
                            break;

                        case 3:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-3');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4');
                            break;

                        case 4:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-4');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3');
                            break;

                        case 5:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-5');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3 col5');
                            break;
                    }
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                soun.viewModeLayout();
            }
        },

        changeQuantityAddToCart: function () {
            var buttonSlt = '[data-minus-quantity], [data-plus-quantity]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]').length > 0 ? self.siblings('input[name="quantity"]') : self.siblings('input[name="group_quantity"]');



                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 0):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);
            });
        },

        expressAjaxAddToCart: function(variant_id, quantity, cartBtn, form) {
            $.ajax({
                type: "post",
                url:  window.router + "/cart/add.js",
                data: 'quantity=' + quantity + '&id=' + variant_id,
                dataType: 'json',

                beforeSend: function() {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.adding +"...");
                    }, 100);
                },

                success: function(msg) {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.thank_you);
                    }, 600);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_more + "...");
                    }, 1000);

                    soun.updateDropdownCart();

                    cartBtn.addClass('add_more');
                    form.next('.feedback-text').text(window.inventory_text.cart_feedback);
                },

                error: function(xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_to_cart);
                    }, 400);
                }
            });
        },

        initAddToCart: function () {
            var btnAddToCartSlt = '[data-btn-addToCart]';

            doc.off('click.addToCart', btnAddToCartSlt).on('click.addToCart', btnAddToCartSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var self = $(this);
                var thisForm = $(self.data('form-id'));
                
                var data = thisForm.serialize();

                if (self.attr('disabled') !== "disabled") {
                    var productItem = self.closest('.product-item');

                    if (productItem.length < 1) {
                        var sectionsProduct = self.closest('[data-section-type="product"]');

                        if (!sectionsProduct.length) {
                            sectionsProduct = self.closest('.quickview-tpl');
                        }

                        productItem = sectionsProduct.find('.product-shop');
                    };

                    var form = productItem.find('form'),
                        handle = productItem.find('.product-grid-image').data('collections-related') || sectionsProduct.data('collections-related');

                    // var variant_id = form.find('select[name=id]').val();
                    // if (!variant_id) {
                    //     variant_id = form.find('input[name=id]').val();
                    // };

                    // var quantity = form.find('input[name=quantity]').val();
                    // if (!quantity) {
                    //     quantity = 1;
                    // };

                    switch (window.ajax_cart) {
                        case "none":
                            form.submit();
                            break;

                        case "normal":
                            var title = productItem.find('.product-title').html();
                            var image = productItem.find('.product-grid-image img').attr('src');

                            if(!image) {
                                image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                            }

                            soun.doAjaxAddToCartNormal(data, title, image);
                            break;

                        
                    };

                }
                return false;
            });

            soun.closeSuccessModal();
        },
      

        changeVariantSelectOption: function() {
            var selectSlt = '[data-select-change-variant]';

            doc.on('change', selectSlt, function() {
                var value = $(this).val(),
                    dataImg = $(this).find('option:selected').data('img'),
                    dataPrice = $(this).find('option:selected').data('price'),
                    parent = $(this).closest('.grouped-product');

                parent.find('input[type=hidden]').val(value);
                parent.find('.product-img img').attr({ src: dataImg });
                parent.find('[data-price-change]').html(Shopify.formatMoney(dataPrice, window.money_format));

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-select-change-variant] span.money', 'money_format');
                }
            });
        },

        closeSuccessModal: function () {
            var ajaxCartModal = $('[data-ajax-cart-success], [data-quickview-modal], [data-compare-modal], [data-compare-message-modal], [data-lookbook-moda]'),
                closeWindow = ajaxCartModal.find('.close-modal, .continue-shopping'),
                CartModal = $('[data-ajax-cart-success]'),
                modalContent = ajaxCartModal.find('.halo-modal-content');

            closeWindow.click(function (e) {
                e.preventDefault();
              var removeContent = CartModal.find('.cart-modal-content .item.item-bundle');
                ajaxCartModal.fadeOut(500, function () {
                    html.removeClass('halo-modal-open');
                    html.css({
                        "overflow": ""
                    });

                    if (body.hasClass('template-cart')) {
                        window.location.reload();
                    }
                    if (body.hasClass('modal-open')) {
                      body.removeClass('modal-open');
                    }
                    if ($('.modal-backdrop').hasClass('show')) {
                      $('.modal-backdrop').removeClass('show');
                      $('.modal-backdrop').hide();
                    }
                  // setTimeout(function(){
                    removeContent.remove();
                  // },200)
                });
            });

            ajaxCartModal.on('click', function (e) {
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    ajaxCartModal.fadeOut(500, function () {
                        html.removeClass('halo-modal-open');
                        html.css({
                            "overflow": ""
                        });

                        if (body.hasClass('template-cart')) {
                            window.location.reload();
                        }
                      if (body.hasClass('popup-quickview')) {
                            $('.custom_video_qv .videoWrapper .video_qv iframe').remove();
                        }
                        if (body.hasClass('modal-open')) {
                          body.removeClass('modal-open');
                        }
                        if ($('.modal-backdrop').hasClass('show')) {
                          $('.modal-backdrop').removeClass('show');
                          $('.modal-backdrop').hide();
                        }
                      if($('.halo-modal-content .is-bundle').length ){
                        $('[data-ajax-cart-success] .close-modal').trigger('click');
                      }
                    });
                };
            });
        },

        doAjaxAddToCartNormal: function(data, title, image) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function () {
                    var ajaxCartModal = $('[data-ajax-cart-success]'),
                        modalContent = ajaxCartModal.find('.cart-modal-content');

                    modalContent.find('.ajax-product-title').html(soun.translateText(title));
                    modalContent.find('.ajax-product-image').attr('src', image);
                    modalContent.find('.message-added-cart').show();

                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open'); 

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        soun.closeLookbookModal();
                    });
                    soun.updateDropdownCart();
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        getPopupShoppingCart: function (shouldShowModel, handle) {
            var ajaxCartModal = $('[data-ajax-cart-success]'),
                modalContent = ajaxCartModal.find('.cart-popup-content'),
                collUpsell = ajaxCartModal.find('.cart-popup-coll-related');

            $.get("/cart?view=json", function (data) {
                modalContent.html(data);

                if (shouldShowModel) {
                    if (handle != '/collections/?view=related') {
                        collUpsell.load('' + handle + '');
                    } else {
                        collUpsell.load('/collections/all?view=related');
                    };
                }
            }).always(function () {
                soun.updateDropdownCart();

                soun.sounTimeout = setTimeout(function () {
                    soun.translateBlock('[data-ajax-cart-success]');

                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    };
                }, 1000);

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-ajax-cart-success] span.money', 'money_format');
                }

                if (shouldShowModel) {
                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        soun.closeLookbookModal();
                    });
                }
            });
        },

        doAjaxUpdatePopupCart: function (quantity, id) {
            $.ajax({
                type: 'POST',
                url: '/cart/change.js',
                data: {
                    id: id,
                    quantity: quantity
                },
                dataType: 'json',

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (result) {
                    soun.getPopupShoppingCart(false);
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        initChangeQuantityButtonEvent: function () {
            var buttonSlt = '[data-minus-quantity-cart], [data-plus-quantity-cart]',
                buttonElm = $(buttonSlt);

            doc.off('click.updateCart').on('click.updateCart', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var btn = $(this);
                var id = btn.closest("[data-product-id]").data("product-id");
                var quantity = parseInt(btn.siblings('input[name="quantity"]').val());

                if (btn.hasClass('plus')) {
                    quantity += 1;
                } else {
                    quantity -= 1;
                };

                soun.doAjaxUpdatePopupCart(quantity, id);

            });
        },

        initQuantityInputChangeEvent: function () {
            var quantityIptSlt = '[data-quantity-input]';

            doc.on('change', quantityIptSlt, function () {
                var id = $(this).closest("[data-product-id]").data("product-id"),
                    quantity = parseInt($(this).val());

                soun.doAjaxUpdatePopupCart(quantity, id);
            });
        },

        removeCartItem: function () {
            var removeSlt = '.cart-remove';

            doc.on('click', removeSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var id = $(this).closest("[data-product-id]").data("product-id");

                soun.doAjaxUpdatePopupCart(0, id);
            });
        },

        initSoldOutProductShop: function () {
            var soldProduct = $('.product-shop [data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        initCustomerViewProductShop: function () {
            var customerView = $('.product-shop [data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },
        initCountdownNormal: function () {
            var countdownElm = $('[data-countdown-normal]');
            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');
                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>D</span><span class="bw">:</span></div>' +
                            '<div class="clock-item"><span class="num">%H</span><span>H</span><span class="bw">:</span></div>' +
                            '<div class="clock-item"><span class="num">%M</span><span>M</span><span class="bw">:</span></div>' +
                            '<div class="clock-item"><span class="num">%S</span><span>S</span></div>'));
                    });
            });
        },
        initShowMoreCollections: function() {
            var colItems = $('.page-collections-list .list-categories .halo-item:hidden'),
                dataLimit = $('.list-categories').data('limit'),
                showMorebtn = $('.page-collections-list .infinite-scrolling-col-list a');
            showMorebtn.on('click', function(e) {
                soun.showLoading();
                var willshowItem = $('.page-collections-list .list-categories .halo-item:hidden:lt(' + dataLimit + ')');
                e.preventDefault();
                willshowItem.removeClass('d-none').addClass('d-block');
                var remainingItem = $('.page-collections-list .list-categories .halo-item:hidden');
                if (remainingItem.length == 0) {
                    showMorebtn.fadeOut('slow');
                }
                setTimeout(function(){
                     soun.hideLoading(); 
                 }, 400);
            });
        },
        initSliderFeaturedProducts: function () {
          var featuredProduct = $('[data-featured-products]');

          featuredProduct.each(function () {
            var self = $(this),
                productGrid = self.find('.products-grid'),
                gridItemWidth = productGrid.data('row');

            if(productGrid.not('.slick-initialized')) {
              productGrid.slick({
                slidesToShow: gridItemWidth,
                slidesToScroll: 1,
                dots: false,
                speed: 800,
                autoplay: false,
                infinite: false,
                nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                responsive: [
                  {
                    breakpoint: 1400,
                    settings: {
                      slidesToShow: 4,
                      slidesToScroll: 2
                    }
                  },
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 4,
                      slidesToScroll: 2,
                      arrows:false,
                      dots: true              
                    }
                  },
                  {
                    breakpoint: 992,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      arrows:false,
                      dots: true                  
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 2,
                      arrows:false,
                      dots: true
                    }
                  }
                ]
              });
            };
          });
        },
        initBrandsSlider: function() {
            var brandsSlider = $('[data-brands-slider]');

            brandsSlider.each(function () {
                var self = $(this);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: self.data('rows'),
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            });
        },

        intTermConditionsChecked: function(){
            var inputWrapper = $('.terms_conditions label');

            var checkBox = $('.terms_conditions input[type="checkbox"]');

            if (checkBox.checked == true) {
                checkBox.parent().next().find('.btn-checkout').removeClass('disagree_conditions');
            } else {
                checkBox.parent().next().find('.btn-checkout').addClass('disagree_conditions');
                checkBox.prop('checked', false);
            }

            inputWrapper.off('click').on('click', function (e) {
                var inputTrigger= $(this).parent().find('.conditions'),
                    divAddClassbtn = $(this).parent().parent().find('.btn-checkout');
                if (!inputTrigger.prop('checked')) {
                    divAddClassbtn.removeClass('disagree_conditions');
                    inputTrigger.prop('checked', true);
                } else {
                    divAddClassbtn.addClass('disagree_conditions');
                    inputTrigger.prop('checked', false);
                }

            });
        },
        setShowmore_description: function() {
            if (!$('.description_showmore').length) {
                return
            }

            if ($(window).width() <= 768) {

                var $showmore = $('.showmore'),
                    $showless = $('.showless'),
                    $showmore_wrapper = $('.description_showmore').parent();

                $showmore_wrapper.css('max-height', 150);

                $showmore.on('click', function() {
                    $showmore_wrapper.css('max-height', 'none');
                    $showmore.removeClass('show').addClass('hide');
                    $showless.removeClass('hide').addClass('show');
                });

                $showless.on('click', function() {
                    $showmore_wrapper.css('max-height', 150);
                    $showless.removeClass('show').addClass('hide');
                    $showmore.removeClass('hide').addClass('show');
                });
            }
        },

        initSliderRecommendations: function() {
            var DataRecommendations = $('[data-recommendations-grid]'),
                productGrid = DataRecommendations.find('.products-grid ');

            productGrid.each(function() {
                var self = $(this),
                    rows = productGrid.data('row');
                                     

                if(self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: rows,
                        slidesToScroll: 1,
                        dots: false,
                        speed: 800,
                        autoplay: false,
                        infinite: false,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                        responsive: [
                        {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 2
                            }
                            },
                            {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 2,
                                arrows:false,
                                dots: true              
                            }
                            },
                            {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                arrows:false,
                                dots: true                  
                            }
                            },
                            {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                                arrows:false,
                                dots: true
                            }
                            }
                        ]
                    });
                };
            });
        },

        initProductMoreview: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav,
                    adaptiveHeight:true
                });

                sliderNav.slick({
                    infinite: true,
                    slidesToShow: sliderNav.data('rows'),
                    vertical: vertical,
                    slidesToScroll: 1,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                    responsive: [{
                            breakpoint: 1200,
                            settings: {
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');

                if(inputChecked.length) {
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },

        changeSwatch: function (swatchSlt) {
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');

                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for');

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');

                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                }
            });
        },
         changeSwatchValue: function(){
            var selectList = $('.swatch'),
                selectItem = selectList.find('.swatch-element input[type="radio"]');
            selectItem.on('change', function(){
                  if($(this).is(':checked')){
                   var thisValue = $(this).next('label').text();
                    var thisDropLabel = $(this).parents().parents('.swatch').find('.swatch-value');
                    thisDropLabel.text(thisValue);
                  }
                });
          },

        productPageInitProductTabs: function () {
            var listTabs = $('.tabs__product-page'),
                tabLink = listTabs.find('[data-tapTop]'),
                tabContent = listTabs.find('[data-TabContent]');

            tabLink.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curTab = $(this),
                    curTabContent = $(curTab.data('target')),
                    ulElm = curTab.closest('.list-tabs');

                if (ulElm.length) {
                    if (!$(this).hasClass('active')) {
                        tabLink.removeClass('active');
                        tabContent.removeClass('active');

                        curTab.addClass('active');
                        ulElm.next().find(curTab.data('target')).addClass('active');
                    }
                } else {
                    if($('.product-template-full-width').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');

                            curTabContent.show(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        } else {
                            curTab.removeClass('active');

                            curTabContent.hide(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        };
                    } else if($('.has-sticky-product-img').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.show();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.hide();
                        };
                    } else {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.slideDown();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.slideUp();
                        };
                    }

                };
            });

            var sprBadge = '.product-shop .spr-badge',
                btnReviewSlt = '.product-template-full-width .spr-summary-actions-newreview';

            doc.on('click.triggerTabsReviews', sprBadge, function () {
                if (listTabs.length) {
                    $('html,body').animate({
                        scrollTop: listTabs.offset().top
                    }, 400);

                    var activeTab = listTabs.find('[data-target="#collapse-tab2"]');

                    if (!activeTab.hasClass('active')) {
                        activeTab.trigger('click');
                    }
                };
            });

            if($('.product-template-full-width').length) {
                doc.on('click', btnReviewSlt, function() {
                    $(document.body).trigger("sticky_kit:recalc");
                });
            };
        },
        openSearchForm: function () {
            var iconSearchSlt = '[data-search-mobile-toggle]',
                wrapperHeader = $('.wrapper-header'),
                formSearch = wrapperHeader.find('.search-form'),
                hideSearch = $('.close-search');

            doc.off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.addClass('search-open');
            });
          
            
            doc.off('click.hideSearch').on('click.hideSearch', function (e) {
                var searchForm = $('.wrapper-header-bt .header-search');

                if (!searchForm.is(e.target) && !searchForm.has(e.target).length) {
                    html.removeClass('search-open');

                    $('.quickSearchResultsWrap').hide();
                }
            });
        },

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },

        stickyFixedTopMenu: function() {
            if(window.fixtop_menu) {
                if(window.innerWidth >= 1200) {
                    $('[data-sticky-mb]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-pc]').sticky({
                                zIndex: 99
                            });

                            $('[data-sticky-pc]').on('sticky-start', function() {
                                body.addClass('has_sticky');
                            });

                            $('[data-sticky-pc]').on('sticky-end', function() {
                                body.removeClass('has_sticky');
                            });
                        }, 100
                    );
                } else {
                    $('[data-sticky-pc]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-mb]').sticky({
                                zIndex: 99
                            });
                        }, 100
                    );
                };
            };
        },

        handleScrollDown: function() {
            var iconSrollDownSlt = '[data-scroll-down]',
                iconSrollDown = $(iconSrollDownSlt);

            iconSrollDown.each(function() {
                var self = $(this);
                var target = self.closest('.shopify-section').next('.shopify-section').attr('id');

                self.attr('href', '#'+ target +'');

                doc.off('click.handleScrollDown', iconSrollDownSlt).on('click.handleScrollDown', iconSrollDownSlt, function(e) {
                    e.preventDefault();

                    var scroll = $(this.getAttribute('href'));

                    if( scroll.length ) {
                        $('html, body').stop().animate({
                            scrollTop: scroll.offset().top
                        }, 500);
                    };
                });
            });
        },

        initStickyAddToCart: function() {
            var blockSticky = $('[data-sticky-add-to-cart]'),
                sltVariantActive = blockSticky.find('.pr-active'),
                variantElm = blockSticky.find('.pr-swatch');

            if(blockSticky.length) {
                var showHideVariantsOptions = function() {
                    sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {
                        e.preventDefault();

                        blockSticky.toggleClass('open-sticky');
                    });

                    doc.off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
                        if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                            blockSticky.removeClass('open-sticky');
                        };
                    })
                };

                var handleActiveVariant = function() {
                    variantElm.off('click.activeVar').on('click.activeVar', function(e) {
                        var self = $(this),
                            text = self.text(),
                            value = self.data('value'),
                            newImage = self.data('img');

                        variantElm.removeClass('active');
                        self.addClass('active');
                        blockSticky.toggleClass('open-sticky');

                        blockSticky.find('.action input[type=hidden]').val(value);
                        sltVariantActive.attr('data-value', value).text(text);

                        var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');

                        swatchNameValue.each(function() {
                            var slt = $(this).data('value');

                            $('[data-value="'+slt+'"]').closest('.swatch').find('#'+slt+'').click();
                        });

                        if(self.hasClass('sold-out')) {
                            blockSticky.find('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
                        }else {
                            blockSticky.find('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
                        };

                        $('.pr-img img').attr({ src: newImage });

                        return false;
                    });
                };

                var stickyAddToCart = function() {
                    doc.on('click', '[data-sticky-btn-addToCart]', function(e) {
                        e.preventDefault();

                        if($('#add-to-cart-form [data-btn-addToCart]').length) {
                            $('#add-to-cart-form [data-btn-addToCart]').click();
                        } else if($('#add-to-cart-form [data-grouped-addToCart]').length) {
                            $('#add-to-cart-form [data-grouped-addToCart]').click();
                        };

                        return false;
                    });
                };

                var activeVariantSelected = function() {
                    var optionSelected = $('#product-selectors option:selected'),
                        value = optionSelected.val(),
                        stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
                        stickyText = stickyActive.text();

                    sltVariantActive.text(stickyText);
                    stickyActive.addClass('active');

                    var str = stickyActive.data('img');

                    $('.pr-img img').attr({ src: str });

                    $(".swatch .swatch-element").each(function(e) {
                        var idVariant = $(this).find('input:radio').attr('id');

                        $('.swatch input.text[data-value="'+idVariant+'"]').appendTo($(this));
                    });

                    $('.selector-wrapper').change(function() {
                        var n = $("#product-selectors").val();

                        $('.sticky_form .pr-selectors li').each(function(e) {
                            var t = $(this).find('a').data('value');

                            if(t == n){
                                $(this).find('a').addClass('active')
                            } else{
                                $(this).find('a').removeClass('active')
                            }
                        });

                        $("#product-selectors").change(function() {
                            var str = "";

                            $("#product-selectors option:selected").each(function() {
                                str += $(this).data('imge');
                            });

                            $('.pr-img img').attr({ src: str });
                        }).trigger("change");

                        if(variantElm.hasClass('active')) {
                            var h = $('.sticky_form .pr-swatch.active').text();

                            $('.sticky_form .action input[type=hidden]').val(n);
                            sltVariantActive.text(h);
                            sltVariantActive.attr('data-value', n);
                        };
                    });
                };

                var offSetTop = $('#add-to-cart-form .groups-btn').offset().top;

                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();

                    if (scrollTop > offSetTop) {
                        body.addClass('show_sticky');
                    }
                    else {
                        body.removeClass('show_sticky');
                    }
                });

                showHideVariantsOptions();
                handleActiveVariant();
                stickyAddToCart();
                activeVariantSelected();
            };
        },


        wrapTable: function(){
            var table = $('.tab-content').find('table');
            if(table.length){
                table.each(function(){
                    $(this).wrap('<div class="table-wrapper"></div>')
                })
            }
        },
        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code,
                    success: function(response){
                        console.log('Discount code added');
                    }
                });
            }

        },
//       ----------------popup video-----------
      videoProductPopup: function(){
        $( ".video-mp" ).click(function() {
         $(this).parent().find(".modal_cms").addClass("show-modal");
        });

        $( ".modal_cms .header .close-button" ).click(function() {
          $(".modal_cms").removeClass("show-modal");
        });

        $(".modal-cms-overlay").click(function() {
          $(".modal_cms").removeClass("show-modal");
        });
      },
//       -----------scroll link----------
        smoothScrolling: function () {
          $(".header-bottom .site-nav li a, .cart-icon a, .acc-mb a, .header-mb nav li a, .custom-block-feature .features-botton a, .banner-parallax .banner-content .banner_left a, .template-product .product-shop .group_item a").off('click.scrollTop').on('click', function(event) {
            if (this.hash !== "") {
              event.preventDefault();
              var hash = this.hash;
              $('html, body').animate({
                scrollTop: $(hash).offset().top
              }, 1200);
            } // End if
          });
        },
        // Update Bundle 
        initBundleProducts: function() {

            var btnAddToCartSlt = '[data-bundle-addToCart]',
                bundleImagesSlide = $('[data-bundle-images-slider]'),
                btnToggleOptionsSlt = '.fbt-toogle-options',
                btnClosseOptionsSlt = '.close-options',
                bundlePrice = $('.products-grouped-action .bundle-price'),
                bundleCheckbox = '.bundle-checkbox';

            var replaceDiscountRate = function(){
                if(bundlePrice.length > 0){
                    var discountRate = bundlePrice.data('discount-rate')*100;
                    var discountText = $('.products-grouped-action .discount-text span');
                    if(discountText.length > 0){
                        discountText.each(function(){
                            $(this).text($(this).text().replace('[discount]',discountRate)).parent().show();
                        })
                    }

                }
            }

            var bundleSlider = function() {
                if(bundleImagesSlide.length && bundleImagesSlide.not('.slick-initialized')) {
                    var images = bundleImagesSlide.data('rows');

                    bundleImagesSlide.slick({
                        get slidesToShow() {
                            if(images >= 5) {
                                return this.slidesToShow = 4;
                            }
                            else {
                                return this.slidesToShow = images;
                            }
                        },
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                   
                        responsive: [
                          {
                            breakpoint: 1400,
                            settings: {
                              slidesToShow: 4,
                              slidesToScroll: 2
                            }
                          },
                          {
                            breakpoint: 1200,
                            settings: {
                              slidesToShow: 3,
                              slidesToScroll: 1,
                              arrows:false,
                              dots: true              
                            }
                          },
                          {
                            breakpoint: 992,
                            settings: {
                              slidesToShow: 3,
                              slidesToScroll: 1,
                              arrows:false,
                              dots: true                  
                            }
                          },
                          {
                            breakpoint: 768,
                            settings: {
                              slidesToShow: 2,
                              slidesToScroll: 1,
                              arrows:false,
                              dots: true
                            }
                          }
                        ]
                    });
                }
            };

            var toggleVariantOptions = function() {
                body.off('click.toggleVariantOptions', btnToggleOptionsSlt).on('click.toggleVariantOptions', btnToggleOptionsSlt, function(e) {
                    e.preventDefault();

                    $(this).next().slideToggle();
                })
            };
            var closeVariantOptions = function(){
                 body.off('click.btnClosseOptionsSlt', btnClosseOptionsSlt).on('click.btnClosseOptionsSlt', btnClosseOptionsSlt, function(e) {
                    e.preventDefault();
                    $(this).parent().slideToggle();
                })
            }

            var handleCheckedProduct = function() {
                // check all checkbox on loadpage
                $('.fbt-checkbox input').prop('checked',true);

                body.off('click.checkedProduct', bundleCheckbox).on('click.checkedProduct', bundleCheckbox, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        ipt = self.prev(),
                        dataId = self.closest('.fbt-product-item').data('bundle-product-id');

                    if(!ipt.prop('checked')) {
                        ipt.prop('checked', true);
                        $('[data-bundle-product-id="'+ dataId +'"]').addClass('isChecked');
                    } else {
                        ipt.prop('checked', false);

                        $('[data-bundle-product-id="'+ dataId +'"]').removeClass('isChecked');
                    };
                    updateTotalPrice();
                })
            };

            var initSelectedSwatch = function() {
                $('.fbt-product-item').each(function() {
                    var self = $(this);
                    var productId = self.data('bundle-product-id');
                    var selectedVariantId = $(this).find('[name="group_id"]').val();
                    var productOpts = self.find('.swatch');
                    var variantArr = window.productVariants[productId];

                    if (!variantArr) {
                        return;
                    }
                    // Get selected variant
                    var selectedVariant = variantArr.find(function(variant){
                        return variant.id == selectedVariantId
                    });

                    // Check selected swatch
                    productOpts.each(function(index){
                        var optionIndex = 'option' + (index + 1);
                        var selectedSwatch = $(this).find('.swatch-element[data-value="'+selectedVariant[optionIndex]+'"]');

                        selectedSwatch.find('input').prop('checked', true);
                    })

                });

            }

            var updateTotalPrice = function() {
                var bundleProItem = $('.fbt-product-item.isChecked');
                var bundlePrice = $('.products-grouped-action .bundle-price');
                var oldPrice = $('.products-grouped-action .old-price');
                var discountRate = bundlePrice.data('discount-rate');
                var totalPrice = 0;
                var checkedProductLength = $('.fbt-product-item.isChecked').length;
                var maxProduct = $('.fbt-product-item').length;

                bundleProItem.each(function() {
                    var selectElm = $(this).find('select[name=group_id]'),
                        inputElm = $(this).find('input[name=group_id]');

                    if(selectElm.length) {
                        var price = selectElm.find(':selected').data('price');
                    } else {
                      if (inputElm.length) {
                        var price = $(this).find('input[name=group_id]').data('price');
                      } else {
                        var price = $(this).find('input[name=id]').data('price');
                      }
                    }

                    if(price) {
                        totalPrice += price;

                        if(bundlePrice.length > 0 && oldPrice.length > 0){
                            oldPrice.html(Shopify.formatMoney(totalPrice, window.money_format));
                            bundlePrice.html(Shopify.formatMoney(totalPrice*(1 - discountRate), window.money_format));
                             if(checkedProductLength == maxProduct){
                                window.bundleMatch = true;
                                bundlePrice.show();
                                oldPrice.show();
                                $('.products-grouped-action .price').hide();
                            }else{
                                window.bundleMatch = false;
                                bundlePrice.hide();
                                oldPrice.hide();
                                $('.products-grouped-action .price').show();
                            }
                        }

                        $('.products-grouped-action .total .price').html(Shopify.formatMoney(totalPrice, window.money_format));


                    };
                })
                if (soun.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            };

            var disableSoldoutSwatchAllBundles = function(){
                var productItem = $('.fbt-product-item');
                productItem.each(function(){
                    var self = $(this);
                    disableSoldoutSwatchBundle(self);
                })
            };

            var disableSoldoutSwatchBundle = function(productItem){
                var productId = productItem.data('bundle-product-id');
                var variantList = window.productVariants[productId];
                var options = productItem.find('[data-option-idx]');
                var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-idx');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 0:
                        // loop through all swatchs in option 1 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 1:
                        // loop through all swatchs in option 2 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 2:
                        // loop through all swatchs in option 3 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                    }
                });
            };

            var changeSwatchProductBundle = function() {
                var swatchSlt = '.fbt-product-item .swatch :radio';

                doc.off('change.changeBundleSwatch', swatchSlt).on('change.changeBundleSwatch', swatchSlt, function(e) {
                    var self = $(this);
                    if (self.prop('checked')) {
                        var productItem = $(this).closest('.fbt-product-item');
                        var productId = productItem.data('bundle-product-id');
                        var variantList = window.productVariants[productId];
                        var optionIdx = self.closest('[data-option-idx]').data('option-idx');
                        var swatches = productItem.find('.swatch-element');
                        var thisVal = self.val();
                        var selectedVariant;
                        var fbtPrice = productItem.find('.fbt-prices'),
                            priceSale = fbtPrice.find('.price-sale'),
                            productPrice = fbtPrice.find('[data-fbt-price-change]');
                        var productInput = productItem.find('[name=group_id]');
                        // Get selected swatches
                        var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                        var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                        var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();
                        // Re-active all swatches
                        swatches.removeClass('soldout');
                        swatches.find(':radio').prop('disabled',false);
                        // Auto get first available variant
                        switch (optionIdx){
                            case 0:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == thisVal && variant.option2 == selectedSwatchOpt2 && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                     // variant was sold out, so auto select other available variant
                                    var altAvailableVariants = variantList.find(function(variant){
                                        return variant.option1 == thisVal && variant.available;
                                    })
                                    selectedVariant =  altAvailableVariants;
                                };
                                break;
                            case 1:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #2')
                                };
                                break;
                            case 2:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                   selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #3')
                                };
                                break;
                        }

                        productInput.val(selectedVariant.id);

                        // Check new swatch input
                        initSelectedSwatch();
                        // Disable sold out swatches base on new checked inputs
                        disableSoldoutSwatchBundle(productItem);

                        // Do select callback function
                         productPrice.html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                         // change variant id of main product for adding to cart
                         productItem.find('input[name=id][type=hidden]').val(selectedVariant.id)

                            if (selectedVariant.compare_at_price > selectedVariant.price) {
                                priceSale.find('[data-fbt-price-change]').addClass('special-price');
                                priceSale.find('.old-price').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format)).show();
                            }
                            else {
                                priceSale.find('.old-price').hide();
                                priceSale.find('[data-fbt-price-change]').removeClass('special-price');
                            }

                            productItem.find('select').val(selectedVariant.id).trigger('change');

                            updateTotalPrice();
        
                            if (soun.checkNeedToConvertCurrency()) {
                                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            }

                            // Change product image
                            var newImage = productInput.find('option:selected',this).attr('data-image');
                            if(newImage != undefined){
                                var productImage = $('.fbt-image-item[data-bundle-product-id="'+productId+'"]').find('img');
                                productImage.attr('src',newImage)
                            }

                    }
                });
            };

            var initBundleAddToCart = function() {

                doc.off('click.bundleAddToCart', btnAddToCartSlt).on('click.bundleAddToCart', btnAddToCartSlt, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        form = self.closest('form'),
                        curPro = form.find('[data-collections-related]'),
                        handle = curPro.data('collections-related'),
                        bundleProduct = form.find('[data-grouped-product-item].isChecked'),
                        title = $('h1.product-title').text(),
                        image = $('[id^="product-featured-image"]').first().attr('src');

                    if(self.attr('disabled') !== "disabled") {
                        soun.showLoading();
                        Shopify.queue = [];
                        var i = 0;
                        bundleProduct.each(function() {
                            var variantId = $(this).find('[name=group_id]').val();

                            if(variantId) {
                                Shopify.queue.push( {
                                    variantId: variantId,
                                    quantity: 1
                                });

                            };
                        });

                        Shopify.moveAlong = function() {
                            if (Shopify.queue.length) {
                                var request = Shopify.queue.shift();
                                soun.showLoading();
                                Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
                                soun.sounTimeout = setTimeout(function(){
                                    soun.hideLoading();
                                },5000)
                            }
                            else {
                                soun.hideLoading();
                                var variant_id = curPro.find('[name=id]').val();
                                var formData = $(self.data('form-id'));
                                var data = formData.serialize();
                                var quantity = 1;
                                switch (window.ajax_cart) {
                                    case "none":
                                      form.submit();
                                      break;

                                    case "normal":
                                        form.submit();
                                        break;

                                    case "upsell":
                                        form.submit();
                                        break;
                                };
                             
                                // add discount code first
                                try{
                                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                                    soun.apply_discount( discount_code );
                                }
                                catch(e){
                                    console.log(e)
                                }
                                return false;
                            };
                        }

                        Shopify.moveAlong();

                    }

                });

                 
            };
            replaceDiscountRate();
            bundleSlider();
            toggleVariantOptions();
            closeVariantOptions();
            handleCheckedProduct();
            initSelectedSwatch();
            disableSoldoutSwatchAllBundles();
            changeSwatchProductBundle();
            updateTotalPrice();
            initBundleAddToCart();
        },
        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code + "?redirect=/cart",
                    success: function(response){
                      window.location.href = '/discount/' + discount_code + '?redirect=/cart';
                      console.log('Discount code added');
                    }
                });
            }
        },
        checkBundleProducts: function() {
          var discount_code = $.cookie('discount_code');
          if( discount_code != "" && discount_code != null ){
            var mainProduct = discount_code.replace('FBT-BUNDLE-', '');
            if( mainProduct != '')
                getShoppingCart();
          }

            function getShoppingCart () {

                if( $('ul.cart-list li').length > 0 ) {
                var check = false;
                var cart = [];
                $('ul.cart-list li').each(function(i, el) {
                  var product_id = $(el).data('product_id');
                  if( product_id == mainProduct){
                    check = true;
                  }
                  if(cart.indexOf( product_id ) == -1)
                    cart.push( product_id );
                });

                if( check == true ){
                  $.ajax({
                    url: "/collections/bundle-" + mainProduct + "?view=bundle-json",
                    success: function(response){
                      var myBundle = JSON.parse(response);
                      if(cart.length >= myBundle.results.length) {
                        checkProductInCart(cart, myBundle.results);
                      }
                      else
                        remove_discount();
                    }
                  });
                }
                else 
                  remove_discount();
              }
          }

          function checkProductInCart(cart, collection){
            var i = 0;
            collection.forEach(function(el) {
              if(cart.indexOf(el.id) != -1) {
                i++;
              }
            });
            if( i != collection.length)
              remove_discount();
          }

          function remove_discount(){
            $.ajax({
              url: "/checkout?discount=%20",
              success: function(response){
                // $.cookie('discount_code', '');
                console.log('Discount code removed')
              }
            });
          }
        },
        hide_filter: function(){
          $(".sidebar-tags .widget-content ul").each(function() {   
            if ($(this).children('li').length > 0) {
              $(this).parents('.sidebar-tags').show();
            } else { 
              $(this).parents('.sidebar-tags').hide();
            }
          });
        },

        // End Update Bundle 
        productRecomendation: function() {
          var $container = $('.js-product-recomendation');
          var productId = $container.data('productId');
          var template = $container.data('template');
          var sectionId = $container.data('sectionId');
          var limit = $container.data('limit');
          var productRecommendationsUrlAndContainerClass =
               window.router + '/recommendations/products?&section_id='+ sectionId +'&limit=' + limit + '&product_id=' + productId + ' .product-recommendations';
          $container.parent().load(productRecommendationsUrlAndContainerClass, function(){
            if (template != '') {
              $('.js-product-recomendation .products-grid').addClass('verticle');
            }
            soun.translateBlock('#product-recommendations');
            soun.initSliderRecommendations();
          } );
          
        },

        appendProductRecomendation: function(){
          var ProductRecomendation = $('#product-recommendations'),
              appenRecomendation = $('.template-product .product .product_bottom');
              appenRecomendation1 = $('.template-product .product .product_bottom .relate-verticle');
              appenRecomendation2 = $('.template-product .product .relate-verticle').find('[data-sticky-3]');
              ProductRecomendation.appendTo(appenRecomendation);
              ProductRecomendation.appendTo(appenRecomendation1);
              ProductRecomendation.appendTo(appenRecomendation2);

          
        },

//       ---------------header mobile--------------
      header_mobile:function(){
        $('.header-mb .mn_mobile nav ul').html($('.site-nav').html());

        $('.header-mb .mn_mobile .icon-nav').click(function() {
          //         debugger;
          if($('body').hasClass('open-mn')){
            $('body').removeClass('open-mn');
          }
          else{
            $('body').addClass('open-mn');
          }
        });

        $('.overlay-mn, .close-mm').click(function(){
          $('body').removeClass('open-mn');
        });  
        var w = window.innerWidth;
        if (w <= 1024) {
          $('.top-right .lang-currency-groups').appendTo('.header-mb .language-mobile ');
        }

        $('.header-mb .nav-bar>li  a').click(function(e){
          $('body').removeClass('open-mn');
        });
      },
      openSubmenuMobile:function(){
        $(".header-mb .nav-bar li.dropdown .icon-dropdown").click(function(e){
          $(this).next(".sub-menu-open").removeClass("sub-menu-open");
          $(this).next().addClass("sub-menu-open");
        });
        $(".header-mb .nav-bar li.dropdown .icon-dropdown.back-submenu").click(function(e){
          $(this).parent().parent(".sub-menu-open").removeClass("sub-menu-open");
        });
      }
 };



})(jQuery);
