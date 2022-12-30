# goodwave-frontend-template-next-react-query-mui

This package is the our basic Next / React query / Material UI frontend.

Remember to change app name everywhere.

&nbsp;

🔴 🔴 🔴 🔴 🔴 🔴 🔴

**Remember to customize the new repository's readme for your specific project.**

**DOCUMENTATION MUST ALWAYS BE UP TO DATE, COMPLETE AND EASILY LEGIBLE.**

**RESPECT OUR CODING RULES** : [READ THE RULES HERE](CODING-RULES.md)

🔴 🔴 🔴 🔴 🔴 🔴 🔴

&nbsp;
&nbsp;

## Main dependencies

- **Node** >= 19.x LTS
- **pnpm** >= 7.2.x

## Requirements

- husky `npx husky install` for pre-commit and pre-push hooks

## Development

- `pnpm install`
- Run with `pnpm dev`
- The file `.env.development` will be loaded (use for non sensitive variables, can be committed). You need `NEXT_PUBLIC_APP_API_URL`.
- The file `.env.development.local` will be loaded (use for sensitive variables such as API keys, listed in .gitignore as it must not be committed).
- ⚠ IMPORTANT : note that all public envars should have the prefix NEXT_PUBLIC (for example NEXT_PUBLIC_APP_API_URL)
- PWA : to test PWA in development mode `pnpm build & pnpm start`

## Test

- storybook : `pnpm storybook` for visual testing
- cypress : `pnpm cypress` for gui component testing and `pnpm cypress:headless:component` for cli component testing

## Production

- `pnpm install`
- Run with `pnpm build`
- Serve files in `/build` folder
- The file `.env.production` will be loaded (use for non sensitive variables, can be committed)
- The file `.env.production.local` will be loaded (use for sensitive variables such as API keys, listed in .gitignore as it must not be committed)
- To access React Query devtools type `window.toggleDevtools()` in the console

## Frontend specific code rules

### Next

- check the documentation of the new app directory of nextjs 13 [here](https://beta.nextjs.org/docs)
