(function(){
  initAddonSelection();
  initAddonModals();
  inputProductOptionSelection();
  setTimeout(initAddToCart, 1000)
  // initAddToCart();
})();

/**
 * Initialize add-ons selection
 */
function initAddonSelection() {
  const addons = document.querySelectorAll('.product-addons__checkbox');

  addons.forEach(addon => {

    const addonProductId = addon.getAttribute('data-addon-id');
    const addonModalId = `addon-modal-${addonProductId}`;
    const addonModal = document.querySelector(`#${addonModalId}`);
    const doesModalExist = addonModal ? true : false;

    addon.addEventListener('change', function() {
      const addToCartButton = document.querySelector('#product-add-to-cart');
      if(addon.checked) {
        if(doesModalExist) {
          addonModal.classList.add('active');
          addonModal.closest('.addon-modals').classList.add('open');
          document.body.classList.add('overflow--hidden');
        }
      }
      // update ATC button
      if(addToCartButton) {
        const noOfSelectedAddonItems = 1 + Number(document.querySelectorAll('.product-addons__checkbox:checked').length);
        const atcBtnText = noOfSelectedAddonItems <= 1 ? 'Add to Cart' : `Add to Cart(${noOfSelectedAddonItems} Items)`;
        addToCartButton.value = atcBtnText;
      }
    });
  })
}

/**
 * Initialize Add-on options selection modals
 * @returns 
 */
function initAddonModals() {
  const modalsWrapper = document.querySelector('.addon-modals');
  if(!modalsWrapper) return;

  const closeModal = (modalWrapper) => {
    if(!modalWrapper) return;

    modalWrapper.classList.remove('open');
    document.body.classList.remove('overflow--hidden');
    const activeModals = modalWrapper.querySelectorAll('.addon-modal.active');

    if(!activeModals) return;

    activeModals.forEach(activeModal => {
      activeModal.classList.remove('active');
    });
  }

  modalsWrapper.addEventListener('click', function(event) {
    const isCloseTrigger = event.target.matches(".button-close-modal") || !(
      event.target.closest(".addon-modal") ||
      (event.target.classList && event.target.classList.contains("addon-modal"))
    );
    if(!isCloseTrigger) {
      return;
    }

    closeModal(modalsWrapper)
  });

  // individual modals
  const addonModals = modalsWrapper.querySelectorAll('.addon-modal');
  addonModals.forEach(addonModal => {
    addonModal.querySelector('.button--select').addEventListener('click', function(e) {
      closeModal(modalsWrapper)
    });
  });
}

/**
 * Initialize product option selection inside the modal
 */
function inputProductOptionSelection() {
  const swatches= document.querySelectorAll('.addon-option__selector__swatch');

  /**
   * Get Options Values From Swatch Elements
   * @returns 
   */
  const getSelectedOptions = () => {
    const options = [];
    swatches.forEach(swatch => {
      const checkedOption = swatch.querySelector('input[type="radio"]:checked');
      if(checkedOption) {
        options.push(checkedOption.value);
      }
    });

    return options;
  }

  const findVariantFromOptions = (variants, optionValues) => {
    const currentVariant = variants.find((variant) => {
      return !variant.options.map((option, index) => {
        return optionValues[index] === option;
      }).includes(false);
    });

    return currentVariant;
  }

  const updateAddonPrice = (variant, product_id) => {
    if(!variant) return;

    const modal = document.querySelector(`#addon-modal-${product_id}`);
    const priceContainer = modal.querySelector('.addon-modal__price');

    const retailPrice = priceContainer.querySelector('.price');
    const compareAtPrice = priceContainer.querySelector('.compare-price');
    const savePercentage = priceContainer.querySelector('.price-save');

    if(retailPrice) {
      const _price = Shopify.formatMoney(variant.price, window.addon.money_format)
      retailPrice.innerHTML = _price;
      updatePriceInAddonCards(product_id, _price);
    }

    if(variant.compare_at_price > variant.price) {
      if(compareAtPrice) {
        compareAtPrice.innerHTML = Shopify.formatMoney(variant.compare_at_price, window.addon.money_format);
        compareAtPrice.style.display = 'inline';
      }
  
      if(savePercentage) {
        const percentage = (variant.compare_at_price - variant.price)*100/variant.compare_at_price;
        savePercentage.innerHTML = `(Save ${Math.floor(percentage)}%)`;
        compareAtPrice.style.display = 'inline';
      }
    } else {
      if(compareAtPrice) {
        compareAtPrice.style.display = 'none';
      }
      if(savePercentage) {
        savePercentage.style.display = 'none';
      }
    }
  }

  const updatePriceInAddonCards = (product_id, price) => {
    const addonCard = document.querySelector(`.product-addon label[for='addon-${product_id}']`);
    addonCard.querySelector('.addon-price').innerHTML = `+${price}`;
  };

  const updateAddonVariantId = (variant, product_id) => {
    if(!variant) return;
    
    const addon = document.querySelector(`#addon-${product_id}`);
    if(addon) {
      addon.setAttribute('data-variant-id', variant.id);
    }
  }

  swatches.forEach(swatch => {
    const modal = swatch.closest('.addon-modal');
    const id = modal.getAttribute('id').split('-').pop();
    if(!id) return;

    swatch.querySelector('input[type="radio"]').addEventListener('change', function() {
      const productVariants = JSON.parse(modal.querySelector(`#ProductJson-${id}`).innerHTML);
      const options = getSelectedOptions();
      const variant = findVariantFromOptions(productVariants, options);

      const optionContainer = swatch.closest('.addon-option');
      const selectedOptionEle = optionContainer.querySelector('.addon-option__name span');
      if(selectedOptionEle && this.checked) {
        selectedOptionEle.textContent = this.value;
      }

      if(variant) {
        // console.log(variant);
        updateAddonPrice(variant, id);
        updateAddonVariantId(variant, id);
      }
    });
  });
}


function initAddToCart() {
  const addToCartForm = document.querySelector('#add-to-cart-form');
  const addToCartButton = addToCartForm.querySelector('#product-add-to-cart');
  const addons = document.querySelectorAll('.product-addon');
  const doAddonsExist = addons && addons.length;

  addToCartButton.addEventListener('click', function(e) {
    const selectedAddonsFlags = [];
    const addonItems = [];
    const serializeForm = function (form) {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        if(key.includes('opt-') || key.includes('form_type') || key.includes('utf8')) {
          continue;
        }
        const value = key === 'quantity' ? Number(formData.get(key)) : formData.get(key);
        obj[key] = value;
      }
      return obj;
    };

    for(let i = 0; i < addons.length; i++) {
      const addon = addons[i];
      const isSelected = addon.querySelector('input[type="checkbox"]').checked;

      selectedAddonsFlags.push(isSelected);

      if(isSelected) {
        addonItems.push({
          quantity: 1,
          id: addon.querySelector('input[type="checkbox"]').getAttribute('data-variant-id'),
          properties: {
            "addon": "yes"
          }
        })
      }
    }
    const isAnyAddonSelected = selectedAddonsFlags.includes(true);
    
    if(doAddonsExist && isAnyAddonSelected) {
      e.preventDefault();
      e.stopPropagation();

      // const formData = new FormData(addToCartForm);
      const formData = serializeForm(addToCartForm);
      const items = [
        {
          ...formData
        },
        ...addonItems
      ];



      const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Accept': `application/json` }
      };
      config.body = JSON.stringify({ items });

      fetch(`${addToCartForm.getAttribute('action')}.js`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            return;
          }

          window.location.href = '/cart';
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          
        });
    }
  });
}