defaultFormStatus.html = `
<div class="customFormStatus">
    <span>Form Status</span>
    <div class="container dfsOuterFrame">
        <div class="dfsInnerFrame">
            <div class="row align-items-center">
                <div class="col-3">End-of-form Note:</div>
                <div class="col-9" style=""><input id="formStatusNote" type="text" style="width:100%;"></div>
            </div>
            <div class="row align-items-center">
                <div class="col-3">Default Form Status:</div>
                <div class="col-9">
                    <select id="defaultFormStatus">
                        <option value="">None</option>
                        <option value="0">Incomplete</option>
                        <option value="1">Unverified</option>
                        <option value="2">Complete</option>
                    </select>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-3">Hide From Status?</div>
                <div class="col-9"><input id="hideFromStatus" type="checkbox"></div>
            </div>
        </div>
    </div>
</div>
`;

defaultFormStatus.css = `
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
</style>
`;

$(document).ready(function () {
    $('head').append(defaultFormStatus.css);
    $("#draggablecontainer_parent").after(defaultFormStatus.html);
    
    $('#formStatusNote').val(defaultFormStatus.config.note);
    $('#defaultFormStatus').val(defaultFormStatus.config.select);
    $('#hideFromStatus').prop('checked',defaultFormStatus.config.hide);
    
    $('#formStatusNote, #defaultFormStatus, #hideFromStatus').on('change', saveDFSsettings);
});

function saveDFSsettings() {
    defaultFormStatus.config.note = $('#formStatusNote').val();
    defaultFormStatus.config.select = $('#defaultFormStatus').val();
    defaultFormStatus.config.hide = $('#hideFromStatus').is(':checked');
    $.ajax({
        method: 'POST',
        url: defaultFormStatus.post,
        data: {
            pid: getParameterByName('pid'),
            prefix: defaultFormStatus.modulePrefix,
            form: getParameterByName('page'),
            note: defaultFormStatus.config.note,
            select: defaultFormStatus.config.select,
            hide: defaultFormStatus.config.hide
        },
        error: function(jqXHR, textStatus, errorThrown){ 
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        success: function(data){ 
            console.log(data);
        }
    });
}
