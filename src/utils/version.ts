
/**
 * Application version following semantic versioning (SemVer) principles
 * MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes
 * - MINOR: New features without breaking changes
 * - PATCH: Bug fixes and small improvements
 */

export const APP_VERSION = "1.2.1";

export const APP_BUILD_DATE = "2025-04-12";

/**
 * Returns a formatted version string for display
 * @returns Formatted version string
 */
export const getVersionDisplay = (): string => {
  return `v${APP_VERSION}`;
};

/**
 * Returns the detailed version information
 * @returns Object with version details
 */
export const getVersionInfo = () => {
  return {
    version: APP_VERSION,
    buildDate: APP_BUILD_DATE,
    channel: process.env.NODE_ENV === "production" ? "production" : "development",
  };
};
