# APIRedirect

A beautiful api redirect for all web projects.

A improvement from
[NodeApiRedirect](https://github.com/mozartdiniz/NodeAPIRedirect).

## Summary

- [Configuration](#configuration)
  - [Files](#files)
  - [Properties](#properties)
- [How to run](#how-to-run)
- [Issues](#issues)
- [Thanks](#thanks)
- [License](#license)
- [More](#more)

## Configuration

Before, see the `configuration.sample.json` file located at *configuration* 
folder.

### Files

**API Redirect** always read `configuration.json` file located
at *configuration* folder.

#### Multiple files

You can have several others *configuration* files, but remember to
set **default** property in `configuration.json`, like this:

**configuration.google.json**
```json
{
  "host": "https://google.com",
  "port": 3000,
  "root_folder": "/path/to/project",
  "bind": [
    {
      "uri": "/index",
      "path": "/index.html"
    },
    {
      "uri": "/resources/",
      "path": "/resources/"
    }
  ]
}
```

**configuration.json**
```json
{
  "default": "google"
}
```

In this case, **default** property is a alias to your API
(`configuration. + api + .json`).

#### Only one file

You can also have several APIs in only one file, like this:

**configuration.google.json**
```json
{
  "default": "api_1",
  "api_1": {
    "host": "https://api_1.com",
    "port": 3000,
    "root_folder": "/path/to/project",
    "bind": [
      {
        "uri": "/index",
        "path": "/index.html"
      },
      {
        "uri": "/resources/",
        "path": "/resources/"
      }
    ]
  },
  "api_2": {
    "host": "https://api_2.test.com",
    "port": 4000,
    "root_folder": "/path/to/project",
    "bind": [
      {
        "uri": "/index",
        "path": "/index.html"
      },
      {
        "uri": "/resources/",
        "path": "/resources/"
      }
    ]
  }
}
```

In this case, **default** property is a key to your API object (`configurationFileContent[api]`).

### Properties

- **default**

> required

A alias to your API.

- **host**

> required

Your API host.

- **port**

> required

Server listening at this property.

- **root_folder**

> required

Root folder to your project.

- **bind**

> required

Object to bind a **uri** in a **path** or **folder**.

He is used in **express** configuration like this:

```javascript
app.use(uri, express.static(root_folder + path));
```

or

```javascript
app.use(express.static(folder));
```

**Attention**: If you using for client side development, needed a url to your
`index.html` file, because all requests at root path are redirected to
your API.

For instance:
```json
{
    "uri": "/index",
    "path": "/index.html"
}
```

Now, just open your API host with `/index`.
> Example: http://localhost:3000/index

- **request**

> optional

This object is used to set properties for all requests.

  - **timeout** - Set timeout for all requests, value will be in milliseconds.
  - **headers** - Any properties in this object will be added in all requests header.

For instance:
```json
"request": {
    "timeout": 60000,
    "headers": {
        "Authorization": "Basic VGhhbmsgeW91IGZvciBkZWNvZGUgdGhpcyBzdHJpbmcuIDop"
    }
}
```

- **override_responses**

> optional

This object is used to override responses. Very good to tests.

For instance:
```json
"override_responses": {
    "/login": [
        {
            "field": "targetUrl",
            "value": "http://localhost:3000/index"
        }
    ]
}
```

In this case, the field *targetUrl* of response in request `/login`
will be change to *http://localhost:3000/index*.

> **value** can to accept chain objects like 'myObject.myProperty.test'.

- **log**

> optional

This object is used to set log properties.

  - **colors** - Show colors.
  - **print_response** - Show all responses.
  - **print_request_info** - Show requests information as status code, time of response, url...
  - **print_request_error** - Show request errors.
  
For instance:
```json
"log": {
    "colors": true,
    "print_response": true,
    "print_request_info": true,
    "print_request_error": true
}
```

## How to run

In root folder of this project, type:
```bash
node main.js
```

But you can pass some arguments also:

- **-a, --api**
- **-h, --host**
- **-p, --port**

For instance:
```bash
node main.js --host http://anotherdomain.test.com --port 3000
```

## Issues

Questions, bug reports, improve documentation, and feature request please
search through existing [issue](https://github.com/hpedrorodrigues/ApiRedirect/issues)
and if you don't find and open a one new 
[issue](https://github.com/hpedrorodrigues/ApiRedirect/issues/new).
If you need support send me an [email](mailto:hs.pedro.rodrigues@gmail.com).

## Thanks

[Augusto Monteiro](https://github.com/augustomna2010) for **multiple 
configuration** files and **CLI** options.

## License

API Redirect is released under the MIT license. See [LICENSE](./LICENSE) for more details.

## More

API Redirect is a work in progress, feel free to improve it.