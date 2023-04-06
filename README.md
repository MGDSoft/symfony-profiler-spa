# Symfony profiler for your SPA

### Here's a quick installation guide

Install the bundle into your **API PROJECT**

```shell
composer req mgdsoft/symfony-profiler-spa --dev
```

Add the new route to your **API PROJECT**:

```yaml
# config/routes/dev/mgd_profiler_spa.yaml
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
<script src="//<your api.yourdomain>/bundles/symfonyprofilerspa/load_toolbar_spa.js"></script>
```

That's all! The `load_toolbar_spa.js` is created in vanilla JavaScript, so it's available for use in all frameworks and
libraries.

## How it works

If you take a look inside `src/Resources/public/load_toolbar_spa.js`, you'll find a simple script that creates an HTTP
interceptor. The first `x-debug-token-link` header it detects will trigger a request to the API server to retrieve the
profiler.

Enjoy!