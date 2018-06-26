var src =($_GET("f")? $_GET("f"): "/");

//Set source
document.getElementById('video-source').src = src;   
               
//Set type
var fileType = src.split("/").pop().split(".").pop();
                
//VIDEO
if (fileType == "flv")
    document.getElementById('video-source').type = "video/flv";    
else if (fileType == "mp4")
    document.getElementById('video-source').type = "video/mp4"; 
else if (fileType == "webm")
    document.getElementById('video-source').type = "video/webm"; 
                
//AUDIO audio/mp3
else if (fileType == "mp3")
{
    document.getElementById('video-source').type = "audio/mp3"; 
    console.log("hio");
    
}

//generate information
var fileName = decodeURI(src.split("/").pop());
document.getElementById('fileTypeDisplay').innerHTML = fileType;
document.getElementById('downloadLink').innerHTML = '<a href=\"'+src+'\">'+fileName+"</a>";
document.getElementById('ArticleHeader').innerHTML = fileName.replace(fileType,"").slice(0, -1); 
