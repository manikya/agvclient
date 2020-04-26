$(document).ready(() => {
    var queryParams = getQueryParams();
    var target = queryParams.get('target');
    $('#target-ip').val(target);
});


function getQueryParams()
{
    var query = window.location.search.split('?');
    if ( query.length == 2  )
    {
        return new Map( query[1].split('&').map( (e) => e.split('=') ) );
    }
    return new Map();
}