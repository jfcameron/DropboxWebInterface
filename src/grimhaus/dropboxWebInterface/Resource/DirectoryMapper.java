/*
 * DirectoryMapper
 * user points the object @ a directory,
 * object traverses dir and subdirs, creating
 * a tree structure that represents the directory
 * structure found and contents found therein
 *
 */
package grimhaus.dropboxWebInterface.Resource;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DirectoryMapper 
{
    private final grimhaus.dropboxWebInterface.GUI.Logger m_Logger;
    private final String m_DropboxPublicDirectoryRoot;
    private final String m_DropboxPublicRootURL;
    private final String m_DirectoryMapOutputPath;
    
    public DirectoryMapper(grimhaus.dropboxWebInterface.GUI.Logger aLogger, String aDropboxPublicDirectoryRoot, String aDropboxPublicRootURL, String aDirectoryMapOutputPath)
    {
        m_Logger = aLogger;
        m_DropboxPublicDirectoryRoot = aDropboxPublicDirectoryRoot;
        m_DropboxPublicRootURL = aDropboxPublicRootURL;
        m_DirectoryMapOutputPath = aDirectoryMapOutputPath+"json/directorymap/";
        
        mapRecursive(m_DropboxPublicDirectoryRoot);
        
        /*{
            try 
            {
                File file = new File(m_DirectoryMapOutputPath);
                file.mkdirs();
                
                file = new File(m_DirectoryMapOutputPath+"sampleFile.txt");
                //file.mkdirs();
            
                if(file.createNewFile())
                    System.out.println("File creation successfull");
                else
                    System.out.println("Error while creating File, file already exists in specified path");
                
            }
            
            catch(IOException io) 
            {
                io.printStackTrace();
                
            }
    
        }*/
        
    }
    
    /*
    * maps directory specified at aPath
    * recursively called on child directories
    *
    */
    private void mapRecursive(String aPath)
    {
        String URLPath = aPath.replace(m_DropboxPublicDirectoryRoot,"").replace("\\","/");
        
        if (URLPath.startsWith("/"))
            URLPath = URLPath.replaceFirst("/","");
        
        m_Logger.log
        (
            "*************************\n" +
            "Mapping \"" + URLPath + "\"\n" +
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
        
        m_Logger.log(m_DirectoryMapOutputPath+URLPath+"*************");
        
        //
        // Render directory and content file
        //
        File file = new File(m_DirectoryMapOutputPath+URLPath);
        file.mkdirs();

        File fout = new File(m_DirectoryMapOutputPath+URLPath+"/content.json");
        
        try 
        {
            FileOutputStream fos = new FileOutputStream(fout);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
 
            //filestart
            bw.write("{\n");
            
            //subdir loop
            bw.write("    \"subDirectories\" :\n    [\n");
            
            for ( File f : directoryList)
            {
                bw.write("\""+f.getPath().replace(m_DropboxPublicDirectoryRoot,"").replace("\\","/")+"\"");
                
                
                if (directoryList[directoryList.length-1] != f)
                {
                    bw.write(",");
                    
                }
                
		bw.newLine();                
                
            }
            
            bw.write("\n    ],\n\n");
            
            //directory items loop
            bw.write("    \"directoryItems\" :\n    [\n");
            
            for ( File f : fileList)
            {
                bw.write("\""+f.getPath().replace(m_DropboxPublicDirectoryRoot,m_DropboxPublicRootURL).replace("\\","/")+"\"");
                
                
                if (fileList[fileList.length-1] != f)
                {
                    bw.write(",");
                    
                }
                
		bw.newLine();                
                
            }
            
            bw.write("\n    ]\n");
        
            
            //END OF FILE
            bw.write("\n}");
            
            bw.close();
     
        } 
        
        catch (IOException ex) 
        {
            Logger.getLogger(DirectoryMapper.class.getName()).log(Level.SEVERE, null, ex);
        
        }
        
    }
        
}
