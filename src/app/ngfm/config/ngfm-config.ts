export interface NgfmConfig {
    /**
     * Whether the client app should create any path that the user navigates to within the allowed root,
     * if it doesn't exist. Usually this decision should be left to the server.
     */
    autoCreateDirectories?: boolean;
}
