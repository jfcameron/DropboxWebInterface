package jfc;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Application
{
    private static String m_DropboxPublicDirectoryRoot = "";
    private static String m_DropboxPublicRootURL = "";
    private static String m_DirectoryMapOutputPath = "";

    private static boolean m_NoGUI = false;

    public static void main(String[] args)
    {
        System.out.print(""
                + BuildInfo.NAME + " " + BuildInfo.VERSION
                + "\ngit info: " + BuildInfo.Branch + ", " + BuildInfo.Commit
                + "\nbuild date: " + BuildInfo.Date + "\n");

        //for (String arg : args) blah blah blah
        if (loadSettings())
        {
            DirectoryMapper directoryMapper = new DirectoryMapper(m_DropboxPublicDirectoryRoot,
                    m_DropboxPublicRootURL,
                    m_DirectoryMapOutputPath);

            System.out.print("*********\nMapping is complete\n*********");
        }
        else
        {
            System.out.print("Settings could not be loaded from Settings.json. Please verify json contents and rerun the program.");
        }
    }

    //clean
    private static FileSystem initFileSystem(URI uri) throws IOException
    {
        try
        {
            return FileSystems.newFileSystem(uri, Collections.emptyMap());
        }
        catch (IllegalArgumentException e)
        {
            return FileSystems.getDefault();
        }
    }

    //Clean me up
    public static final String loadTextFile(final String aFileName)
    {
        String name = aFileName.substring(aFileName.lastIndexOf('/') + 1);
        String path = aFileName;
        String data = null;

        System.out.print("dir of resources: " + ClassLoader.getSystemClassLoader().getResource(".") + "\n");

        try
        {
            System.out.print("file to load: " + ClassLoader.getSystemClassLoader().getResource(aFileName).toURI() + "\n");
        }
        catch (URISyntaxException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        try
        {
            FileSystem fs = initFileSystem(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI());

            data = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI())));

            try //close is required by zip filesystem (load from jar) but is unsupported on e.g: UnixFileSystem
            {
                fs.close();
            }
            catch (java.lang.UnsupportedOperationException ex)
            {
            }
        }
        catch (IOException | URISyntaxException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        return data;
    }

    private static boolean loadSettings()
    {
        JSONParser parser = new JSONParser();

        try
        {
            JSONObject jsonObject = (JSONObject) parser.parse(loadTextFile("settings.json"));

            m_DropboxPublicDirectoryRoot = jsonObject.get("PathToDropboxPublicDirectoryRoot").toString();
            m_DropboxPublicRootURL = jsonObject.get("DropboxPublicRootURL").toString();
            m_DirectoryMapOutputPath = jsonObject.get("DirectoryMapOutputPath").toString();

            if ("".equals(m_DropboxPublicDirectoryRoot)
                    || "".equals(m_DropboxPublicRootURL)
                    || "".equals(m_DirectoryMapOutputPath))
            {
                System.out.print(
                        "Settings.json contains uninitalized values. Please fill out settings and rerun the program\n"
                        + "m_DropboxPublicDirectoryRoot: " + m_DropboxPublicDirectoryRoot + "\n"
                        + "m_DropboxPublicRootURL: " + m_DropboxPublicRootURL + "\n"
                        + "m_DirectoryMapOutputPath: " + m_DirectoryMapOutputPath + "\n");

                return false;
            }
        }
        catch (ParseException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        return true;
    }
}
