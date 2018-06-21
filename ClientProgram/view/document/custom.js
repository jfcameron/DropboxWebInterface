var src =($_GET("f")? $_GET("f"): "/");

document.getElementById('downloadlink').innerHTML = "<a href=\'"+src+"\'>"+src.split("/").pop()+"</a>";
document.getElementById('document-view').src = "https://docs.google.com/gview?url="+src+"&embedded=true";
