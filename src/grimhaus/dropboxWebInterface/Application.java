package grimhaus.dropboxWebInterface;

import java.util.HashMap;
import java.util.Map;//remoev

public class Application 
{    
    //test objects
    private static final GUIManager       c_GUIManager       = new GUIManager();
    private static final DirectoryMapper  c_DirectoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.Logger)c_GUIManager);
    private static final DocumentRenderer c_DocumentRenderer = new DocumentRenderer((grimhaus.dropboxWebInterface.Logger)c_GUIManager);
    
    //program entry point
    public static void main(String[] args) 
    {
        //c_DocumentRenderer.render("index.html",                new HTMLTemplateVariableContentPair("#asdf#","somedata"));
        //c_DocumentRenderer.render("hmm/test.html",             new HTMLTemplateVariableContentPair("#123123#","123123123"));
        
        TemplateVariableToHTTPContentMap aContentMap = new TemplateVariableToHTTPContentMap();
        
        aContentMap.put("#BodyData#","Hello my friend");
        aContentMap.put("#CurrentDirectoryData#","eyy");
        
        c_DocumentRenderer.render("a/b/c/testingtseting.html", aContentMap);
        
    }
    
}
