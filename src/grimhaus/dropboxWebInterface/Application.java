package grimhaus.dropboxWebInterface;

public class Application 
{    
    //test objects
    private static final GUIManager       c_GUIManager       = new GUIManager();
    private static final DirectoryMapper  c_DirectoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.Logger)c_GUIManager);
    private static final DocumentRenderer c_DocumentRenderer = new DocumentRenderer((grimhaus.dropboxWebInterface.Logger)c_GUIManager);
    
    //program entry point
    public static void main(String[] args) 
    {
        c_DocumentRenderer.render("index.html", new TemplateVariableToHTTPContentMap
        (
                new VariableToHTTPContentPair("#BodyData#","Sorry nope"),
                new VariableToHTTPContentPair("#CurrentDirectoryData#","This is a thing")
                
        ));
        
        c_DocumentRenderer.render("hmm/test.html", new TemplateVariableToHTTPContentMap
        (
                new VariableToHTTPContentPair("#BodyData#","hello"),
                new VariableToHTTPContentPair("#CurrentDirectoryData#","whats up")
                
        ));
        
        c_DocumentRenderer.render("a/b/c/testingtseting.html", new TemplateVariableToHTTPContentMap
        (
                new VariableToHTTPContentPair("#BodyData#","Hello my friend"),
                new VariableToHTTPContentPair("#CurrentDirectoryData#","eyy")
                
        ));
        
    }
    
}
