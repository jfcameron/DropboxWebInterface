package grimhaus.dropboxWebInterface;

public class Application 
{    
    //test objects
    private static final GUIManager       c_GUI              = new GUIManager();
    private static final DirectoryMapper  c_DirectoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.Logger)c_GUI);
    private static final DocumentRenderer c_DocumentRenderer = new DocumentRenderer((grimhaus.dropboxWebInterface.Logger)c_GUI);
    
    //program entry point
    public static void main(String[] args) 
    {
        c_DocumentRenderer.test();
        
    }
    
}
