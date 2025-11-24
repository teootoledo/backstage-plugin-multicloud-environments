# Publishing Guide

This project uses **Semantic Release** to automatically version and publish packages to NPM.

## How it Works

1.  **Commit Changes**: You make changes and commit them using [Conventional Commits](https://www.conventionalcommits.org/).
    - `fix: ...` -> Patch release (0.0.1)
    - `feat: ...` -> Minor release (0.1.0)
    - `feat!: ...` or `BREAKING CHANGE:` -> Major release (1.0.0)

2.  **Push to Main**: When you push to the `main` branch, a GitHub Actions workflow (`release.yml`) is triggered.

3.  **Automated Release**:
    - The workflow runs tests and builds the project.
    - `multi-semantic-release` analyzes your commits.
    - It determines the next version number.
    - It generates a changelog.
    - It publishes the new versions to NPM.
    - It creates a GitHub Release.

## Manual Publishing (Fallback)

If the automated workflow fails or you need to bootstrap the packages (e.g., first publish), you can publish manually from your local machine.

**Prerequisites:**
- You must be logged in to NPM (`npm login`).
- You must have permissions to publish to the `@teootoledo` scope.

**Steps:**

1.  **Build the project**:
    ```bash
    yarn install
    yarn tsc
    yarn build
    ```

2.  **Publish Common Package**:
    ```bash
    cd plugins/multicloud-environments-common
    npm publish --access public
    cd ../..
    ```

3.  **Publish Backend Plugin**:
    ```bash
    cd plugins/multicloud-environments-backend
    npm publish --access public
    cd ../..
    ```

4.  **Publish Frontend Plugin**:
    ```bash
    cd plugins/multicloud-environments
    npm publish --access public
    cd ../..
    ```

## Troubleshooting

- **404 Not Found during publish**: Ensure you have removed `private: true` from the `package.json` files.
- **Permissions errors**: Verify you are logged in to the correct NPM account.
