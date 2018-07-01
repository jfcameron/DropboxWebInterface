package jfc;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DirectoryMapper user points the object @ a directory, object traverses
 * directories creating a tree structure that represents the directory structure
 * found and contents therein
 */
public class DirectoryMapper
{
    private final String m_DropboxPublicDirectoryRoot;
    private final String m_DropboxPublicRootURL;
    private final String m_DirectoryMapOutputPath;
    private final String m_MetaDataOutputPath;

    public DirectoryMapper(
            final String aDropboxPublicDirectoryRoot,
            final String aDropboxPublicRootURL,
            final String aDirectoryMapOutputPath)
    {
        m_DropboxPublicDirectoryRoot = aDropboxPublicDirectoryRoot;
        m_DropboxPublicRootURL = aDropboxPublicRootURL;
        m_DirectoryMapOutputPath = aDirectoryMapOutputPath + "json/directorymap/";
        m_MetaDataOutputPath = aDirectoryMapOutputPath + "json/";

        System.out.print(""
                + "DropboxPublicDirectoryRoot: " + m_DropboxPublicDirectoryRoot
                + "\nDropboxPublicRootURL: " + m_DropboxPublicRootURL
                + "\nDirectoryMapOutputPath: " + m_DirectoryMapOutputPath + "\n");

        mapRecursive(m_DropboxPublicDirectoryRoot);
        writeMetaData();
    }

    /**
     * maps directory specified at aPath recursively called on child directories
     */
    private void mapRecursive(final String aPath)
    {
        String URLPath = m_DropboxPublicDirectoryRoot;

        File directory = new File(aPath);

        File[] fileList = directory.listFiles((File f) -> f.isFile());
        File[] directoryList = directory.listFiles((File f) -> f.isDirectory());

        for (final File f : directoryList)
            mapRecursive(f.getPath());

        System.out.print("Mapping " + aPath + "\n");

        final String pathToSubdirectoryRelativeToRootDirectory = aPath.replace(URLPath, "");

        final File file = new File(m_DirectoryMapOutputPath + pathToSubdirectoryRelativeToRootDirectory);
        file.mkdirs();

        final File fout = new File(m_DirectoryMapOutputPath + pathToSubdirectoryRelativeToRootDirectory + "" + "/content.json");

        try (final FileOutputStream fos = new FileOutputStream(fout))
        {
            try (final BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8")))
            {
                final JSONObject jsRoot = new JSONObject();
                {
                    final JSONArray jsSubDirectoriesList = new JSONArray();

                    for (File f : directoryList)
                        jsSubDirectoriesList.add(f.getPath().replace(m_DropboxPublicDirectoryRoot, ""));

                    jsRoot.put("subDirectories", jsSubDirectoriesList);
                }
                {
                    final JSONArray jsDirectoryItems = new JSONArray();

                    for (File f : fileList)
                    {
                        final JSONObject currentItem = new JSONObject();

                        currentItem.put("URL", f.getPath().replace(m_DropboxPublicDirectoryRoot, ""));

                        String[] splitString = f.getPath().split("\\."); //"." has meaning in regex therefore must escape it

                        String type = "file";

                        if (splitString.length > 1)
                        {
                            switch (splitString[splitString.length - 1].toLowerCase())
                            {
                                case "png":
                                case "jpg":
                                case "jpeg":
                                case "gif":
                                {
                                    type = "image";
                                }
                                break;
                                
                                case "mp4":
                                case "webm":
                                case "mkv":
                                {
                                    type = "video";
                                }
                                break;
                                
                                case "mp3":
                                {
                                    type = "audio";
                                }
                                break;
                                
                                case "txt":
                                case "pdf":                                    
                                {
                                    type = "document";
                                }
                            }

                            //System.out.print(type + "\n");
                        }

                        currentItem.put("Type", type);

                        jsDirectoryItems.add(currentItem);
                    }

                    jsRoot.put("directoryItems", jsDirectoryItems);
                }

                bw.write(jsRoot.toString());
                bw.close();
            }
        }
        catch (IOException ex)
        {
            System.out.print(ex.getMessage());

            Logger.getLogger(DirectoryMapper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void writeMetaData()
    {
        final File file = new File(m_MetaDataOutputPath);
        file.mkdirs();

        try (final FileOutputStream fos = new FileOutputStream(new File(m_MetaDataOutputPath + "/metadata.json")))
        {
            try (final BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8")))
            {
                final JSONObject jsRoot = new JSONObject();
                final JSONObject jsTimeStamp = new JSONObject();

                Calendar.getInstance().setTimeInMillis(System.currentTimeMillis());

                jsTimeStamp.put("Year", Calendar.getInstance().get(Calendar.YEAR));
                jsTimeStamp.put("Month", Calendar.getInstance().get(Calendar.MONTH));
                jsTimeStamp.put("Day", Calendar.getInstance().get(Calendar.DAY_OF_MONTH));
                jsTimeStamp.put("Hour", Calendar.getInstance().get(Calendar.HOUR_OF_DAY));
                jsTimeStamp.put("Minute", Calendar.getInstance().get(Calendar.MINUTE));
                jsTimeStamp.put("Second", Calendar.getInstance().get(Calendar.SECOND));

                jsRoot.put("timestamp", jsTimeStamp);

                jsRoot.put("dropboxPublicRootURL", m_DropboxPublicRootURL);

                bw.write(jsRoot.toString());
                bw.close();
            }
        }
        catch (IOException ex)
        {
            System.out.print(ex.getMessage());

            Logger.getLogger(DirectoryMapper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
