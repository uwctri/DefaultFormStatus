$(document).ready(() => {
    const module = ExternalModules.UWMadison.defaultFormStatus;

    const html = `
    <div class="customFormStatus">
        <span>Form Status</span>
        <div class="container dfsOuterFrame">
            <div class="dfsInnerFrame">
                <div class="row align-items-center">
                    <div class="col-3">End-of-form Note:</div>
                    <div class="col-9" style=""><input id="formStatusNote" name="note" type="text" style="width:100%;"></div>
                </div>
                <div class="row align-items-center">
                    <div class="col-3">Default Form Status:</div>
                    <div class="col-9">
                        <select id="defaultFormStatus" name="select">
                            <option value="">None</option>
                            <option value="0">Incomplete</option>
                            <option value="1">Unverified</option>
                            <option value="2">Complete</option>
                        </select>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-3">Hide From Status?</div>
                    <div class="col-9"><input id="hideFromStatus" type="checkbox" name="hide"></div>
                </div>
                <div class="row align-items-center">
                    <div class="col-3">Auto Save On First Open?</div>
                    <div class="col-9"><input id="autoSave" type="checkbox" name="save"></div>
                </div>
            </div>
        </div>
    </div>`;

    const css = `
    <style>
    .customFormStatus {
        margin-top: 1rem;
    }
    .customFormStatus span {
        font-size: 16px;
        font-weight: bold;
        color: #800000;
    }
    .dfsOuterFrame {
        background-color: #ddd;
        max-width: 800px;
        border: 1px solid #bbb;
        margin: 1rem 0;
        padding: .75rem;
    }
    .dfsInnerFrame {
        background-color:#f3f3f3;
        border: 1px solid #bbb;
        padding: .25rem;
        font-weight: bold;
    }
    .dfsInnerFrame .row{
        margin: .75rem 0;
    }
    #west {
        height: min-content;
    }
    </style>`;

    /*
    If the autosave feature is enabled we can't allow the form status
    to default to "Incomplete" or blank as we won't be able to tell
    if we have saved yet. Force the user to pick something else.
    */
    const autoSaveStatus = () => {

        // Default back to allowing all options if autoSave is off
        $("#defaultFormStatus option").prop('disabled', false);
        if (!$('#autoSave').is(':checked')) return;

        // Auto save is on, ban "blank" and "Incomplete" options
        $("#defaultFormStatus option:lt(2)").prop('disabled', true);
        if (["1", "2"].includes($('#defaultFormStatus').val())) return;

        // Blank or incomplete are selected, set status to unverified
        $("#defaultFormStatus").val('1');
    }

    /*
    Save settings back to the project level, only send back the settings
    for the current instrument
    */
    const saveDFSsettings = () => {

        // Save all the Settings back to the global
        module.settings = {};
        $(".customFormStatus").find('input, select').each(function () {
            module.settings[$(this).attr('name')] =
                $(this).attr('type') == "checkbox" ? $(this).is(':checked') : $(this).val();
        });

        // Post Back to php
        module.ajax("save", module.settings).then((response) => {
            if (!response.success) {
                console.log("Issue writing Default Form Status back to server");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    // Load CSS and the HTML Form
    $('head').append(css);
    $("#draggablecontainer_parent").after(html);

    // Load the settings for display
    $.each(module.settings, (settingName, data) => {
        $(`[name = ${settingName}]`).val(data).prop('checked', data);
    });

    // Attach event listeners
    $('#autoSave').on('change', autoSaveStatus);
    $(".customFormStatus").find('input, select').on('change', saveDFSsettings);
});