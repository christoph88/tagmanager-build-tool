# google-tagmanager-gh-deploy

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Setup

1. set env variables
2. enable tagmanager api in google cloud
3. create service account for this api
4. go into tagmanager and give service account admin access by adding its email
5. give github actions read and write access
