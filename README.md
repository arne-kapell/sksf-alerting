# SKS-F Alerting UI

... nutzt Nuxt v3 (basierend auf Vue v3).
## Useful Links

[Nuxt.js documentation (short)](https://v3.nuxtjs.org/docs) | [Vue.js guide (more details)](https://v3.vuejs.org/guide)

## Setup

Yarn is recommended and can be installed [here](https://yarnpkg.com/getting-started/install) or via [HomeBrew](https://formulae.brew.sh/formula/yarn#default) (MacOS) and [Chocolatey](https://community.chocolatey.org/packages/yarn) (Windows).

**If nodejs>=16.10 is installed, just run `corepack enable` to enable yarn.**

Make sure to install the dependencies

```bash
yarn install
```

## Development

Start the development server on http://localhost:3000

```bash
yarn dev
```

Fix code styling and scan for problems
```bash
# just logging
yarn lint

# automatically try to fix them
yarn lint:fix
```

## Deployment

The Nuxt application is deployed with Heroku and can be reached at 

https://sks-f.herokuapp.com/

## Ideas
- tailwind theme designer: https://www.vue-tailwind.com/theme-builder