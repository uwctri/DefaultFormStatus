defaultFormStatus.noteHTML = `
<tr id="default-form-status-custom-note-tr" sq_id="default-form-status-custom-note-tr">
    <td class="labelrc col-12" colspan="2">
        <div class="blue"> Note </div>
    </td>
</tr>`;
$(document).ready(function () {
    if ( defaultFormStatus.config.note )
        $("[sq_id=\\{\\}]").before(defaultFormStatus.noteHTML.replace('Note',defaultFormStatus.config.note));
    if ( $("[id$=_complete-tr] select").val()=="0" && defaultFormStatus.config.select)
        $("[id$=_complete-tr] select").last().val(defaultFormStatus.config.select);
    if ( defaultFormStatus.config.hide )
        $("[sq_id=\\{\\}]").last().hide().next().hide();
});
