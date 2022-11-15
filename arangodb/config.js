export default function getConfig(version) {
    const ver = version.split('.')
    const shortVersion = `${ver[0]}${ver[1]}`;
    const basePath = `https://download.arangodb.com/arangodb${shortVersion}/Community`
    return {
        Linux: {
            url: `${basePath}/Linux/arangodb${ver[0]}-linux-${version}.tar.gz`,
            pathInArchive: `arangodb3-linux-${version}`,
        },
        Windows: {
            url: `${basePath}/Windows/ArangoDB${ver[0]}-${version}_win64.zip`,
            pathInArchive: `ArangoDB3-${version}_win64`,
        },
        macOS: {
            url: `${basePath}/MacOSX/arangodb${ver[0]}-macos-${version}.tar.gz`,
            pathInArchive: `arangodb3-macos-${version}`,
        },
    };
}
