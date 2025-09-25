import { useState, useEffect } from 'react';

interface Version {
  major: number;
  minor: number;
  patch: number;
}

const VERSION_KEY = 'app_version';
const UPDATE_COUNT_KEY = 'update_count';

export const useVersion = () => {
  const [version, setVersion] = useState<Version>({ major: 1, minor: 1, patch: 0 });

  useEffect(() => {
    // Load version from localStorage
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion) {
      try {
        const parsedVersion = JSON.parse(savedVersion);
        setVersion(parsedVersion);
      } catch (error) {
        console.error('Error parsing saved version:', error);
      }
    }
  }, []);

  const incrementVersion = () => {
    setVersion(prevVersion => {
      const currentUpdateCount = parseInt(localStorage.getItem(UPDATE_COUNT_KEY) || '0');
      const newUpdateCount = currentUpdateCount + 1;
      
      let newVersion: Version;
      
      if (newUpdateCount >= 20) {
        // Reset patch to 0 and increment minor version
        newVersion = {
          major: prevVersion.major,
          minor: prevVersion.minor + 1,
          patch: 0
        };
        // Reset update count
        localStorage.setItem(UPDATE_COUNT_KEY, '0');
      } else {
        // Increment patch version
        newVersion = {
          major: prevVersion.major,
          minor: prevVersion.minor,
          patch: prevVersion.patch + 1
        };
        localStorage.setItem(UPDATE_COUNT_KEY, newUpdateCount.toString());
      }

      // Save new version to localStorage
      localStorage.setItem(VERSION_KEY, JSON.stringify(newVersion));
      return newVersion;
    });
  };

  const getVersionString = () => {
    return `v${version.major}.${version.minor}.${version.patch}`;
  };

  return {
    version,
    versionString: getVersionString(),
    incrementVersion
  };
};