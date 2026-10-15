$(document).ready(() => {
    let settings = ExternalModules.UWMadison.defaultFormStatus.settings;
    const sanitizeNoteHtml = (html) => {
        const template = document.createElement("template");
        template.innerHTML = html;

        template.content.querySelectorAll("script, style, iframe, object, embed, svg, math, template, link, meta, base")
            .forEach((element) => element.remove());
        template.content.querySelectorAll("*").forEach((element) => {
            Array.from(element.attributes).forEach(({ name, value }) => {
                const attribute = name.toLowerCase();
                const dangerousUrl = ["href", "src", "xlink:href", "action", "formaction", "poster"].includes(attribute) &&
                    /^\s*(javascript|vbscript|data):/i.test(value);
                if (attribute.startsWith("on") || dangerousUrl) element.removeAttribute(name);
            });
        });

        return template.innerHTML;
    };
    let html = `
    <tr id="default-form-status-custom-note-tr" sq_id="default-form-status-custom-note-tr">
        <td class="labelrc col-12" colspan="2">
            <div class="blue"> Note </div>
        </td>
    </tr>`;

    if (settings.note) {
        const note = $(html);
        note.find(".blue").html(sanitizeNoteHtml(settings.note));
        $("[sq_id=\\{\\}]").before(note);
    }

    if ($("[id$=_complete-tr] select").val() == "0" && settings.select)
        $("[id$=_complete-tr] select").last().val(settings.select);

    if (settings.hide) {
        $("#__LOCKRECORD__-tr").hide();
        $(`#${getParameterByName("page")}_complete-tr`).hide();
        $(`#${getParameterByName("page")}_complete-sh-tr`).hide();
    }

    if (settings.firstLoad && settings.save)
        dataEntrySubmit('submit-btn-savecontinue');
});