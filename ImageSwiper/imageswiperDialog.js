'use strict';

(function () {
    /**
     * This extension collects the IDs of each datasource the user is interested in
     * and stores this information in settings when the popup is closed.
     */
    const datasourcesSettingsKey = 'ImageSwiper';

    $(document).ready(function () {
        // The only difference between an extension in a dashboard and an extension
        // running in a popup is that the popup extension must use the method
        // initializeDialogAsync instead of initializeAsync for initialization.
        // This has no affect on the development of the extension but is used internally.
        tableau.extensions.initializeDialogAsync().then(function (openPayload) {
            // The openPayload sent from the parent extension in this sample is the
            // default time interval for the refreshes.  This could alternatively be stored
            // in settings, but is used in this sample to demonstrate open and close payloads.
            $('#interval').val(openPayload);
            $('#closeButton').click(closeDialog);
        });
    });

    /**
     * Stores the selected datasource IDs in the extension settings,
     * closes the dialog, and sends a payload back to the parent.
     */
    function closeDialog() {
        const imageUrls = $('#images').val().split(';');
        const interval = $('#interval').val();
        const imageSwiperSettings = { imageUrls, interval };
        tableau.extensions.settings.set(datasourcesSettingsKey, JSON.stringify(imageSwiperSettings));

        tableau.extensions.settings.saveAsync().then(() => {
            tableau.extensions.ui.closeDialog('');
        });
    }
})();
