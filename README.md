# Eve Web Applicaition

This template provides a boilerplate setup to get React working in Vite with HMR.

Use **Yarn** for package management. 

### Includes:
- **Biome** for linting and formatting (nstead of eslint & prettier)
- Typescript
- **Tailwind v4** + DaisyUI v5 for styling
- **Tanstack Router** for file based routing
- **Tanstack Query** for data fetching and caching
- **PWA** support enabled by default
- Basic Auth Provider + Auth Routes setup that you can update as per requirement


### Environment Variables

Before running the application, you need to set up your environment variables:

1. Copy the example environment file:
   ```sh
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3003/api/v1  # Development
   # VITE_API_URL=https://eve-backend-bi8l.onrender.com/api/v1  # Production

   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

   # Google Places API Configuration
   VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```

3. **For Production**: Update `VITE_API_URL` to your production backend URL

4. **Google OAuth Setup**:
   - Get your Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Configure authorized JavaScript origins:
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - Configure authorized redirect URIs:
     - Development: `http://localhost:3000/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`

5. **Google Places API Setup**:
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Enable the "Places API" in your Google Cloud project
   - Add the API key to your `.env` file as `VITE_GOOGLE_PLACES_API_KEY`
   - For production, restrict the API key to your domain for security

### Commands
```sh
# install dependencies during development
yarn

# install dependencies in production 
yarn install --frozen-lockfile --non-interactive --production

# start dev server on port 3000
yarn dev

# format files
yarn format

# lint 
yarn lint

# build
yarn build

# preview the created build
yarn preview
```

### Notes
- In case you want to use **NPM**, update `engines` entry in `package.json` and delete `yarn.lock`.
- If you want ESLint + Prettier then you can use vite template from their docs. Rest of the setup remains same. 


### Useful references
- [Daisy UI Components](https://daisyui.com/components/button/)
- [Tanstack Example with React Query and File based routing](https://tanstack.com/router/latest/docs/framework/react/examples/kitchen-sink-react-query-file-based)
- [Authenticated Routes](https://tanstack.com/router/latest/docs/framework/react/examples/authenticated-routes)
- [Data fetching using Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start#web)
