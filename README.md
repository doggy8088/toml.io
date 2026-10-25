# toml.io

The public facing site at https://toml.io

## Contributing

* Copy spec/en to create new locale directory
* Update _locale.md with the name of the language in its own alphabet
* Translate index.html if you want
* Create a version in the form of v1.0.0.md

## Deployment

The site is published to GitHub Pages at <https://toml.gh.miniasp.com> by
`.github/workflows/pages.yml`. Pushes to the repository's default branch build
the site and deploy the `publish` directory. The workflow can also be run
manually from the Actions tab.

The custom domain requires this DNS record:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `toml.gh.miniasp.com` | `doggy8088.github.io` |

Netlify relied on server-side redirects for `/` and pretty URLs such as
`/en/latest`. `lib/pages_redirects.js` generates equivalent static redirect
pages during `yarn build` so those URLs keep working on GitHub Pages.
