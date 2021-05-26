jQuery(document).ready(function() {
    jQuery('.complete-h5p').submit(function (e) {
        var question = jQuery('#complete_h5p_button').data('confirm');
        var ok = confirm(question);
        if (ok) {
            return true;
        }
        else {
            //Prevent the submit event and remain on the screen
            e.preventDefault();
            return false;
        }
        e.preventDefault();
    });

    if (typeof H5P !== 'undefined' && H5P.externalDispatcher)
        H5P.externalDispatcher.on('xAPI', onXapi);
});
/**
 * Show error.
 */
function showError(message, code) {
    console.error("Unable to save xAPI statement");
    if( xapi_settings.alerts == true ){
        alert("Unable to save result data.\n\nMessage: " + message + "\n" + "Code: " + code);
    } else {
        console.log("Unable to save result data.\n\nMessage: " + message + "\n" + "Code: " + code);
    }
}

/**
 * Post error.
 */
function onXapiPostError(xhr, message, error) {
    //hideSpinner();

    console.log("xapi post error");
    console.log(xhr.responseText);

    showError(message, xhr.status);
}

/**
 * Post success.
 */
function onXapiPostSuccess(res, textStatus, xhr) {
    jQuery('#complete_h5p_button').removeAttr('disabled');

    if(res.data.result == 'reached'){
        if(res.data.reload){
            location.reload();
        }
    }
    /*if (!res.hasOwnProperty("ok")) {
        console.log("xapi post error");
        console.log(xhr.responseText);
        showError("Got bad response back...", 500);
    }

    if (!res.ok) {
        console.log("xapi post error");
        console.log(xhr.responseText);
        showError(res.message, res.code);
    }

    if (res.ok) {
        $.event.trigger({
            type: "h5pXapiStatementSaved",
            message: res.message
        });
    }*/
}
function onXapi(event) {
    if (!lpH5pSettings.ajax_url || !lpH5pSettings.conditional_h5p)
        return;
    if ((event.getVerb() === 'completed' || event.getVerb() === 'answered') && !event.getVerifiedStatementValue(['context', 'contextActivities', 'parent'])) {
        var score = event.getScore();//console.log(event);
        var maxScore = event.getMaxScore();
        var contentId = event.getVerifiedStatementValue(['object', 'definition', 'extensions', 'http://h5p.org/x-api/h5p-local-content-id']);
        if (lpH5pSettings.conditional_h5p != contentId)
            return;
        var data = {
            action: 'lph5p_process',
            score: score,
            maxScore: maxScore,
            contentId: contentId,
            item_id: lpH5pSettings.id,
            course_id: lpH5pSettings.course_id,
        };
        jQuery.ajax({
            type: "POST",
            url: lpH5pSettings.ajax_url,
            data: data,
            dataType: "json",
            success: onXapiPostSuccess,
            //error: onXapiPostError
        });
        //H5P.setFinished(contentId, score, maxScore);

    }
}