/*
 * DirectoryMapper
 * user points the object @ a directory,
 * object traverses dir and subdirs, creating
 * a tree structure that represents the directory
 * structure found and contents found therein
 *
 */
package grimhaus.dropboxWebInterface.Resource;

public class DirectoryMapper 
{
    private final grimhaus.dropboxWebInterface.GUI.Logger m_Logger;
    
    public DirectoryMapper(grimhaus.dropboxWebInterface.GUI.Logger aLogger)
    {
        m_Logger = aLogger;
        
        m_Logger.log("A DirectoryMapper is constructing");
                
    }
    
}
