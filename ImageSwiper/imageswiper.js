'use strict';

(function () {
    let defaultIntervalInMS = '1000';
    const datasourcesSettingsKey = 'ImageSwiper';
    let swiper = null;

    $(document).ready(function () {
        // When initializing an extension, an optional object is passed that maps a special ID (which
        // must be 'configure') to a function.  This, in conjuction with adding the correct context menu
        // item to the manifest, will add a new "Configure..." context menu item to the zone of extension
        // inside a dashboard.  When that context menu item is clicked by the user, the function passed
        // here will be executed.
        tableau.extensions.initializeAsync({
            'configure': configure
        }).then(function () {
            // This event allows for the parent extension and popup extension to keep their
            // settings in sync.  This event will be triggered any time a setting is
            // changed for this extension, in the parent or popup (i.e. when settings.saveAsync is called).
            tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
                updateExtensionBasedOnSettings(settingsEvent.newSettings);
            });
        });
    });

    function configure() {
        const popupUrl = `${window.location.origin}/my_tableau_extension/ImageSwiper/imageswiperDialog.html`;

        tableau.extensions.ui.displayDialogAsync(popupUrl, defaultIntervalInMS, { height: 500, width: 500 }).then((closePayload) => {
            // The promise is resolved when the dialog has been expectedly closed, meaning that
            // the popup extension has called tableau.extensions.ui.closeDialog.
            $('#inactive').hide();
            $('#active').show();
            console.log('closePayload', closePayload);
        }).catch((error) => {
            // One expected error condition is when the popup is closed by the user (meaning the user
            // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
            switch (error.errorCode) {
                case tableau.ErrorCodes.DialogClosedByUser:
                    console.log('Dialog was closed by user');
                    break;
                default:
                    console.error(error.message);
            }
        });
    }

    /**
     * Helper that is called to set state anytime the settings are changed.
     */
    function updateExtensionBasedOnSettings(settings) {
        if (settings[datasourcesSettingsKey]) {
            const { imageUrls, interval } = JSON.parse(settings[datasourcesSettingsKey]);
            setupImages(imageUrls);

            if (!swiper) {
                setupSwiper(interval);
            }
        }
    }

    function setupImages(imageUrls) {
        let html = '';

        imageUrls.forEach(imgUrlItem => {
            html += `<div class="swiper-slide"><img src="${imgUrlItem}"></div>`;
        });

        $('.swiper-wrapper').append(html);
    }

    function setupSwiper(interval) {
        if (!interval) {
            defaultIntervalInMS = String(interval);
        }

        swiper = new Swiper('.swiper-container', {
            speed: 300,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: Number(defaultIntervalInMS),
            },
        });
    }
})();
