var src =($_GET("f")? $_GET("f"): "/");

document.getElementById('document-view').src = "https://docs.google.com/gview?url="+src+"&embedded=true";   