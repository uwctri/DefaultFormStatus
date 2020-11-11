defaultFormStatus.noteHTML = `
<tr id="default-form-status-custom-note-tr" sq_id="default-form-status-custom-note-tr">
    <td class="labelrc col-12" colspan="2">
        <div class="blue"> Note </div>
    </td>
</tr>`;
$(document).ready(function () {
    defaultFormStatus.config.save = defaultFormStatus.config.save == "true";
    defaultFormStatus.config.hide = defaultFormStatus.config.hide == "true";
    
    if ( defaultFormStatus.config.note )
        $("[sq_id=\\{\\}]").last().before(defaultFormStatus.noteHTML.replace('Note',defaultFormStatus.config.note));
    if ( $(`[id$=${getParameterByName('page')}_complete-tr] select`).val()=="0" && defaultFormStatus.config.select)
        $(`[id$=${getParameterByName('page')}_complete-tr] select`).val(defaultFormStatus.config.select);
    if ( defaultFormStatus.config.hide )
        $("[sq_id=\\{\\}]").last().hide().next().hide();
    if ( defaultFormStatus.config.firstLoad && defaultFormStatus.config.save ) 
        dataEntrySubmit('submit-btn-savecontinue');
});