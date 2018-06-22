package jfc;

import jfc.DirectoryMapper;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Date;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;

public class Application
{
    private static String m_DropboxPublicDirectoryRoot = "";
    private static String m_DropboxPublicRootURL = "";
    private static String m_DirectoryMapOutputPath = "";

    private static final Date buildDate = getClassBuildTime();

    private static boolean m_NoGUI = false;

    public static void main(String[] args)
    {
        checkArgs(args);

        System.out.print("DropBoxWebInterface\n"
                + "Build: " + buildDate.toString() + "\n"
                + "===========================\n\n");

        if (loadSettings())
        {
            DirectoryMapper directoryMapper = new DirectoryMapper(m_DropboxPublicDirectoryRoot, m_DropboxPublicRootURL, m_DirectoryMapOutputPath);

            System.out.print("*********\nMapping is complete\n*********");
        }
        else
        {
            System.out.print("Settings could not be loaded from Settings.json. Please verify json contents and rerun the program.");
        }
    }

    //Clean me up
    private static String sanitizeFilePath(final String aFileName)
    {
        return aFileName.startsWith("/") ? aFileName : "/" + aFileName;
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
        String path = sanitizeFilePath(aFileName);
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
            JSONObject jsonObject = (JSONObject) parser.parse(loadTextFile("settings.json"));//new FileReader("Settings.json"));

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

    private static void checkArgs(String[] args)
    {
        for (String s : args)
        {
            if (s.contentEquals("noGUI"))
            {
                m_NoGUI = true;
            }
        }
    }

    /**
     * Handles files, jar entries, and deployed jar entries in a zip file (EAR).
     *
     * @return The date if it can be determined, or null if not.
     */
    private static Date getClassBuildTime()
    {
        Date d = null;

        Class<?> currentClass = new Object()
        {
        }.getClass().getEnclosingClass();

        URL resource = currentClass.getResource(currentClass.getSimpleName() + ".class");

        if (resource != null)
        {
            if (resource.getProtocol().equals("file"))
            {
                try
                {
                    d = new Date(new File(resource.toURI()).lastModified());
                }
                catch (URISyntaxException ignored)
                {
                }
            }
            else
            {
                if (resource.getProtocol().equals("jar"))
                {
                    String path = resource.getPath();
                    d = new Date(new File(path.substring(5, path.indexOf("!"))).lastModified());
                }
                else
                {
                    if (resource.getProtocol().equals("zip"))
                    {
                        String path = resource.getPath();

                        File jarFileOnDisk = new File(path.substring(0, path.indexOf("!")));

                        try (JarFile jf = new JarFile(jarFileOnDisk))
                        {
                            ZipEntry ze = jf.getEntry(path.substring(path.indexOf("!") + 2));//Skip the ! and the /
                            long zeTimeLong = ze.getTime();
                            Date zeTimeDate = new Date(zeTimeLong);
                            d = zeTimeDate;
                        }
                        catch (IOException | RuntimeException ignored)
                        {
                        }
                    }
                }
            }
        }

        return d;
    }
}
