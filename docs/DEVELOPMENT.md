# Development Guide

This guide covers how to develop, test, and understand the architecture of the Multicloud Environments plugin.

## Project Structure

This project is a monorepo managed by Yarn Workspaces:

- **`plugins/multicloud-environments`**: The frontend plugin (React).
- **`plugins/multicloud-environments-backend`**: The backend plugin (Node.js/Express).
- **`plugins/multicloud-environments-common`**: Shared types and utilities.

## Architecture

The plugin follows a standard Backstage architecture:

1.  **Frontend**: Displays the "Environments" page. It fetches data from the backend plugin via the `BackstageBackendApi`.
2.  **Backend**: Exposes a REST API (`/api/multicloud-environments`).
3.  **Service Layer**: The `EnvironmentService` orchestrates data collection.
4.  **Providers**: The backend uses "Providers" to fetch data from different sources:
    - `AwsProvider`: Fetches EC2 instances using AWS SDK.
    - `OciProvider`: Fetches instances using OCI SDK.
    - `MockProvider`: Returns static data for testing.

## Running Locally

To run the plugin locally in isolation:

1.  **Install dependencies**:
    ```bash
    yarn install
    ```

2.  **Start the development server**:
    ```bash
    yarn dev
    ```
    This starts both the backend and frontend in a standalone mode.

## Testing

### Unit Tests

We use `jest` for unit testing.

To run all tests:
```bash
yarn test
```

To run tests for a specific package:
```bash
yarn workspace @teootoledo/backstage-plugin-multicloud-environments-backend test
```

### Testing with Mock Data

To test the UI without real cloud credentials:
1.  Open `app-config.local.yaml`.
2.  Enable the mock provider:
    ```yaml
    multicloudEnvironments:
      providers:
        mock:
          enabled: true
    ```
3.  Restart the backend (`yarn dev`).

## Linting & Type Checking

- **Lint**: `yarn lint`
- **Type Check**: `yarn tsc`
