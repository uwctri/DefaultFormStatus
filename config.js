$(document).ready(function() {
    console.log("Loaded defaultFormStatus config")
    var pid = (new URLSearchParams(window.location.search)).get('pid');
    var url = window.location.href.split('/').slice(0,5).join('/');
    var $modal = $('#external-modules-configure-modal');
    $modal.on('show.bs.modal', function() {
        // Making sure we are overriding this modules's modal only.
        if ($(this).data('module') !== defaultFormStatus.modulePrefix)
            return;
    
        if (typeof ExternalModules.Settings.prototype.resetConfigInstancesOld === 'undefined')
            ExternalModules.Settings.prototype.resetConfigInstancesOld = ExternalModules.Settings.prototype.resetConfigInstances;

        ExternalModules.Settings.prototype.resetConfigInstances = function() {
            ExternalModules.Settings.prototype.resetConfigInstancesOld();

            if ($modal.data('module') !== defaultFormStatus.modulePrefix)
                return;
            
            $modal.find('thead').remove();
            $modal.find('tr[field=json]').hide();
            $modal.find('tr[field=info] a').on('click', function() {
                $modal.find('tr[field=json]').toggle();
            });
        };
    });

    $modal.on('hide.bs.modal', function() {
        // Making sure we are overriding this modules's modal only.
        if ($(this).data('module') !== defaultFormStatus.modulePrefix)
            return;

        if (typeof ExternalModules.Settings.prototype.resetConfigInstancesOld !== 'undefined')
            ExternalModules.Settings.prototype.resetConfigInstances = ExternalModules.Settings.prototype.resetConfigInstancesOld;

        $modal.removeClass('defaultFormStatusConfig');
    });
});