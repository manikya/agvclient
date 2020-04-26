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
        var queryItems = query[1].split('&')
        var queryMap = new Map( queryItems.map( (e) => e.split('=') ) );
        return queryMap;
    }
    return null;
}