function confirmation(html,action,type){
    $('.confirmation-dialog-notice').html(html);
    $('#confirmation-dialog').modal('show');
    $('.btn-confirmation-dialog-yes').attr('onClick', action);
}

function siteUrl(uri){

    var origin = window.location.origin;
    var base = "produksi_minyak";
    var url = origin + '/' + base;

    return url + '/' + uri;
}