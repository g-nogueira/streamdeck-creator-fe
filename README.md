## Docker Container

```bash
docker compose up -d
```

or

```bash
docker compose up -d --build
```

## Developing

Once you've created a project and installed dependencies with `npm install`, start a development server:

```bash
npm install

# Pull mdi icons
node ./tools/pull-mdi-icons.js

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
