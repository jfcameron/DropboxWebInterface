package grimhaus.dropboxWebInterface;

public class Application 
{    
    private static GUIManager   m_GUI          = new GUIManager();
    private static IndexManager m_IndexManager = new IndexManager();

    //program entry point
    public static void main(String[] args) 
    {
        m_IndexManager.test();
        
        m_GUI.log("This is the end, my friend.");
        m_GUI.log("This is the end, my friend.");
        
        //while(true);
        
    }
    
}
