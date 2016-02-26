# API Redirect

A simple api redirect :)

A improvement from [NodeApiRedirect](https://github.com/mozartdiniz/NodeAPIRedirect).

## How to use

Just read `configuration/configuration.sample.json` and
`configuration/configuration.sample2.json`, understand and create your
own `configuration/configuration.json`.

If you using for client side development, needed a url to your
`index.html` file, because all requests at root path are redirected to
your api.

## How to run

```bash
npm start
```

You can pass host address as a parameter also:

```bash
npm start http://anotherdomain.test.com
```