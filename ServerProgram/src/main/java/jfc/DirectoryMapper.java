package jfc;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.simple.JSONObject;

/**
 * DirectoryMapper user points the object @ a directory, object traverses
 * directories creating a tree structure that represents the directory structure
 * found and contents found therein
 */
public class DirectoryMapper
{
    private final String m_DropboxPublicDirectoryRoot;
    private final String m_DropboxPublicRootURL;
    private final String m_DirectoryMapOutputPath;
    private final String m_MetaDataOutputPath;

    public DirectoryMapper(
            String aDropboxPublicDirectoryRoot,
            String aDropboxPublicRootURL,
            String aDirectoryMapOutputPath)
    {
        m_DropboxPublicDirectoryRoot = aDropboxPublicDirectoryRoot;
        m_DropboxPublicRootURL = aDropboxPublicRootURL;
        m_DirectoryMapOutputPath = aDirectoryMapOutputPath + "json/directorymap/";
        m_MetaDataOutputPath = aDirectoryMapOutputPath + "json/";

        System.out.print(""
                + "DropboxPublicDirectoryRoot: " + m_DropboxPublicDirectoryRoot
                + "\nDropboxPublicRootURL: " + m_DropboxPublicRootURL
                + "\nDirectoryMapOutputPath: " + m_DirectoryMapOutputPath);

        mapRecursive(m_DropboxPublicDirectoryRoot);
        writeMetaData();
    }

    // This implementation is ridiculous. Repalce with a json writer from simple-json
    /**
     * maps directory specified at aPath recursively called on child directories
     */
    private void mapRecursive(String aPath)
    {
        String URLPath = m_DropboxPublicDirectoryRoot;

        //System.out.print("Mapping \"" + URLPath + "\"\n");

        File directory = new File(aPath);

        File[] fileList = directory.listFiles((File f) -> f.isFile());
        File[] directoryList = directory.listFiles((File f) -> f.isDirectory());

        //for (File f : fileList)
          //  System.out.print(f.getPath().replace(m_DropboxPublicDirectoryRoot, m_DropboxPublicRootURL));

        for (File f : directoryList)
            mapRecursive(f.getPath());

        // Render directory and content file
        File file = new File(m_DirectoryMapOutputPath + URLPath);

        file.mkdirs();

        File fout = new File(m_DirectoryMapOutputPath + URLPath + "/content.json");

        try
        {
            FileOutputStream fos = new FileOutputStream(fout);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8"));

            //filestart
            bw.write("{\n");

            //subdir loop
            bw.write("    \"subDirectories\" :\n    [\n");

            for (File f : directoryList)
            {
                bw.write("\"" + f.getPath().replace(m_DropboxPublicDirectoryRoot, "") + "\"");

                if (directoryList[directoryList.length - 1] != f)
                    bw.write(",");

                bw.newLine();
            }

            bw.write("\n    ],\n\n");

            //directory items loop
            bw.write("    \"directoryItems\" :\n    [\n");

            for (File f : fileList)
            {
                bw.write("\"" + f.getPath().replace(m_DropboxPublicDirectoryRoot, m_DropboxPublicRootURL) + "\"");

                if (fileList[fileList.length - 1] != f)
                    bw.write(",");

                bw.newLine();
            }

            bw.write("\n    ]\n");

            //END OF FILE
            bw.write("\n}");

            bw.close();
        }
        catch (IOException ex)
        {
            System.out.print(ex.getMessage());

            Logger.getLogger(DirectoryMapper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // This implementation is ridiculous. Repalce with a json writer from simple-json
    private void writeMetaData()
    {
        File file = new File(m_MetaDataOutputPath);
        file.mkdirs();

        File fout = new File(m_MetaDataOutputPath + "/metadata.json");

        try
        {
            FileOutputStream fos = new FileOutputStream(fout);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8"));

            ////////////////////////////////////////////////
            JSONObject jsRoot = new JSONObject();
            jsRoot.put("timestamp", "zipzap");
            
            System.out.print(Thread.currentThread().getStackTrace()[1].getMethodName()+"\nTESTEST\n\n");
            System.out.print(jsRoot.toString());
            System.out.print("\n\n");
            ////////////////////////////////////////////////////////
            
            //filestart
            bw.write("{\n");

            //timestamp
            bw.write("    \"timestamp\" : \"");

            long timeInMillis = System.currentTimeMillis();
            Calendar cal1 = Calendar.getInstance();
            cal1.setTimeInMillis(timeInMillis);
            SimpleDateFormat dateFormat = new SimpleDateFormat("hh:mm:ss a, dd日MM月yyyy年");

            bw.write(dateFormat.format(cal1.getTime()));
            bw.write("\",\n");

            //dropbox root url
            bw.write("    \"dropboxPublicRootURL\" : \"");
            bw.write(m_DropboxPublicRootURL);
            bw.write("\"\n\n");

            //END OF FILE
            bw.write("\n}");

            bw.close();
        }
        catch (IOException ex)
        {
            System.out.print(ex.getMessage());

            Logger.getLogger(DirectoryMapper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
