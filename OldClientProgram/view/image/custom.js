function $_GET(param)
{
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace
    (
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) 
        { // callback
            vars[key] = value !== undefined ? value : '';
        
        }
    
    );

    if ( param )
    {
        return vars[param] ? vars[param] : null;
    
    }

    return vars;

}

var src =($_GET("f")? $_GET("f"): "/");

img = document.getElementById('image');
img.src = src;
document.getElementById('downloadlink').href = src;