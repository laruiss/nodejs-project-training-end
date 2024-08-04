# API for Vue.js training

## This project

This RESTful web API server is an enhanced version of the server we built together in the Node.js training.

This is a non-exhaustive list of enhancements that were added:

- ✨ encrypt passwords with bcrypt
- ✨ handle labels on media
- ✨ handle complex relations between tables
- ✨ handle email workflow for user creation
- ✨ handle email workflow for reset password
- ♻️ refactor for a better code organization
- 🔒 handle access token (in `Authorization` header) and refresh token (in *httpOnly cookie*)
- ✅ add tests in the `api.http` file
- 🧑‍💻 add container for mailpit

## How to use it

We will use it as our API server for our front SPA.

You must perform the following actions to make it work:

- [X] launch the `pnpm i` command to install al dependencies (ALREADY DONE)
- [ ] replace `<username>` and `<password>` in `.docker/docker-compose.yml` with a proper username and password
- [ ] copy `.env-example` to `.env` and replace `<username>` and `<password>` with the same values you wrote in `.docker/docker-compose.yml`
- [ ] also in `.env`: enter your OMDB API key
- [ ] in `.vscode/settings.json` at the end of the file, enter your  OMDB API key
- [ ] launch the `pnpm prisma` command to generate prisma client
- [ ] launch the `pnpm prisma:deploy` command to (re)play all migrations (changes to the DB)

## Optional (but strongly recommended)

Configure git:

```sh
git config --global user.email "your.email@domain.com"
git config --global user.name "Your name"
```

Commit the project as it is now:

```sh
git commit -m "feat: ✨ create functional api"
```
