# Symfony profiler for your SPA (Single page application)

![Symfony Sersion](https://img.shields.io/badge/Symfony-5/6-purple.svg?style=flat-square&logo=symfony)
![php Version](https://img.shields.io/badge/php-7/8-blueviolet)
![Licence](https://img.shields.io/badge/Licence-MIT-brightgreen)


![example](https://github.com/MGDSoft/symfony-profiler-spa/blob/main/docs/example_profiler_spa.png?raw=true "photo")

### Here's a quick installation guide

Install the bundle into your **API PROJECT**

```shell
composer req mgdsoft/symfony-profiler-spa --dev
```

Add the new route to your **API PROJECT**:

```yaml
# config/routes/web_profiler.yaml
when@dev:
    mgd_profiler_spa:
        resource: '@SymfonyProfilerSPABundle/Resources/config/routing/routing.yml'
        prefix: /
```

Create the asset or copy if you are not using asset component:

```shell
bin/console assets:install
```

This execution will copy 'load_toolbar_spa.js' file to your public folder, you only have to include it in your html file
to your **FRONTEND project**:

```html
<script src="//yourdomain.lol/bundles/symfonyprofilerspa/load_toolbar_spa.js"></script>
```

That's all! The `load_toolbar_spa.js` is created in vanilla JavaScript, so it's available for use in all frameworks and
libraries. Interceptors available for XHR and fetch.

### JS Config

For custom url toolbar you have to use this custom attribute `data-url-toolbar`

```html
<script src="//yourdomain.lol/bundles/symfonyprofilerspa/load_toolbar_spa.js" defer data-url-toolbar="{ORIGIN}/internal/toolbar/{TOKEN}"></script>
```

## How it works

If you take a look inside `src/Resources/public/load_toolbar_spa.js`, you'll find a simple script that creates an HTTP
interceptor. The first `x-debug-token-link` header it detects will trigger a request to the API server to retrieve the
profiler.

Dont forget your nginx configuration to avoid cors

```nginx
add_header Access-Control-Allow-Origin "http://yourdomain.lol";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-debug-token-link, X-Debug-Token";
add_header Access-Control-Expose-Headers "X-Debug-Token, X-Debug-Token-Link";
```

Enjoy!
