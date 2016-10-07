package grimhaus.dropboxWebInterface;

import grimhaus.dropboxWebInterface.Resource.DirectoryMapper;
import grimhaus.dropboxWebInterface.GUI.GUIManager;
import grimhaus.dropboxWebInterface.HTML.DocumentRenderer;
import grimhaus.dropboxWebInterface.HTML.TemplateVariableToHTMLContentMap;
import grimhaus.dropboxWebInterface.HTML.VariableToHTMLContentPair;


public class Application 
{    
    //test objects
    private static final GUIManager       c_GUIManager       = new GUIManager();
    private static final DirectoryMapper  c_DirectoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager);
    private static final DocumentRenderer c_DocumentRenderer = new DocumentRenderer((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager);
    
    //program entry point
    public static void main(String[] args) 
    {
        /*c_DocumentRenderer.render("index.html", new TemplateVariableToHTMLContentMap
        (
                new VariableToHTMLContentPair("#BodyData#","Sorry nope"),
                new VariableToHTMLContentPair("#CurrentDirectoryData#","This is a thing")
                
        ));*/
        
        
        
    }
    
}
