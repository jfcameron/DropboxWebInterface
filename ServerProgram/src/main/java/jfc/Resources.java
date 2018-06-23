package jfc;

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

/**
 *
 */
public class Resources
{
    private Resources()
    {
    }

    /**
     * RAII wrapper for FileSystem
     */
    private static class FileSystemWrapper
    {
        private FileSystem m_FileSystem;

        public FileSystem getFileSystem()
        {
            return m_FileSystem;
        }

        public FileSystemWrapper(URI uri) throws IOException
        {
            try
            {
                m_FileSystem = FileSystems.newFileSystem(uri, Collections.emptyMap());
            }
            catch (IllegalArgumentException e)
            {
                m_FileSystem = FileSystems.getDefault();
            }
        }

        protected void finalize() throws Throwable
        {
            try
            {
                try 
                {
                    // close is required by certain filesystems e.g jar
                    // but unrequired by others e.g UnixFileSystem
                    m_FileSystem.close();
                }
                catch (java.lang.UnsupportedOperationException ex)
                {
                }
            }
            catch (Throwable t)
            {
                throw t;
            }
            finally
            {
                super.finalize();
            }
        }
    }

    /**
     * load a text file from disk, jar or zip file
     *
     * @param aFileName path to a text file
     * @return contents of the file
     */
    public static final String loadTextFile(final String aFileName)
    {
        String name = aFileName.substring(aFileName.lastIndexOf('/') + 1);
        String path = aFileName;
        String data = null;

        try
        {
            FileSystemWrapper fs = new FileSystemWrapper(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI());

            data = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI())));
        }
        catch (IOException | URISyntaxException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        return data;
    }
}
