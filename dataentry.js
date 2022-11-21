$(document).ready(() => {
    let settings = ExternalModules.UWMadison.defaultFormStatus.settings;
    let html = `
    <tr id="default-form-status-custom-note-tr" sq_id="default-form-status-custom-note-tr">
        <td class="labelrc col-12" colspan="2">
            <div class="blue"> Note </div>
        </td>
    </tr>`;

    if (settings.note)
        $("[sq_id=\\{\\}]").before(html.replace('Note', settings.note));

    if ($("[id$=_complete-tr] select").val() == "0" && settings.select)
        $("[id$=_complete-tr] select").last().val(settings.select);

    if (settings.hide)
        $("[sq_id=\\{\\}]").last().hide().next().hide();

    if (settings.firstLoad && settings.save)
        dataEntrySubmit('submit-btn-savecontinue');
});