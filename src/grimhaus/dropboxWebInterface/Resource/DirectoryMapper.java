/*
 * DirectoryMapper
 * user points the object @ a directory,
 * object traverses dir and subdirs, creating
 * a tree structure that represents the directory
 * structure found and contents found therein
 *
 */
package grimhaus.dropboxWebInterface.Resource;

import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;

public class DirectoryMapper 
{
    private final grimhaus.dropboxWebInterface.GUI.Logger m_Logger;
    private final String m_DropboxPublicDirectoryRoot;
    private final String m_DropboxPublicRootURL;
    
    public DirectoryMapper(grimhaus.dropboxWebInterface.GUI.Logger aLogger, String aDropboxPublicDirectoryRoot, String aDropboxPublicRootURL)
    {
        m_Logger = aLogger;
        m_DropboxPublicDirectoryRoot = aDropboxPublicDirectoryRoot;
        m_DropboxPublicRootURL = aDropboxPublicRootURL;
        
        mapRecursive(m_DropboxPublicDirectoryRoot);
        
    }
    
    /*
    * maps directory specified at aPath
    * recursively called on child directories
    *
    */
    private void mapRecursive(String aPath)
    {
        m_Logger.log
        (
            "*************************\n" +
            "Mapping \"" + aPath.replace(m_DropboxPublicDirectoryRoot,"").replace("\\","/") + "\"\n" +
            "*************************"
        );
        
        
        File directory = new File(aPath);
        
        FileFilter directoryFilter = new FileFilter() 
        {
            public boolean accept(File f) 
            {
                return f.isDirectory();
            
            }
        
        };
        
        FileFilter fileFilter = new FileFilter() 
        {
            public boolean accept(File f) 
            {
                return f.isFile();
            
            }
        
        };
      
        File[] fileList = directory.listFiles(fileFilter);
        File[] directoryList = directory.listFiles(directoryFilter);
        
        //m_Logger.log("Contents:");
        for ( File f : fileList)
        {
            m_Logger.log(f.getPath().replace(m_DropboxPublicDirectoryRoot,m_DropboxPublicRootURL).replace("\\","/"));
            
        }
        
        m_Logger.log("");
        
        for ( File f : directoryList) 
        {            
            mapRecursive(f.getAbsolutePath());
            
        }
        
        
        
    }
        
}
