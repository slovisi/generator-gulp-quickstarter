A Yeoman Front-End Boilerplate Generator

This is my first attempt at a generator, and a way for me to familiarize with nodejs. Please bear with me while I painfully try to improve my skills.

## Features

* Built-in preview server with BrowserSync
* Automatic compilation of SCSS with Compass
* Image Optimization
* Zurb Panini flat file generator using Handlebars

## Getting Started

- Install dependencies: `npm install --global yo gulp bower`
- Install the generator: `npm install --global generator-gulp-quickstarter`
- Run `yo gulp-quickstarter` to scaffold your app
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp` to build your webapp for production
- Run `gulp optimize` to minify CSS & JS

## How to Work with gulp-quickstarter

- Work in the app/ directory
- The result will be found in the dist/ directory
- You can add a page in the app/pages/ directory, config the page this block :

<pre><code>---
layout: default
current:
   name: Home
---</code></pre>

- Example : you want to add a specific javascript files for your homepage, named home.js, you just have to create home.js file in the app/src/custom/ directory and configure the page this way :

<pre><code>---
layout: default
current:
   name: Home
   script:
       - home
---</code></pre>

- If you really need it you can add several specific javascript files :

<pre><code>---
layout: default
current:
   name: Home
   script:
       - file1
       - file2
       - file3
---</code></pre>

- Take a look at app/layout/default.hbs to see how to call partials

- To use datas from the datas/ folder
<pre><code>---
{{filename.variablename}}
---</code></pre>

- To call a partial from partials/ folder
<pre><code>---
{{> partialname}}
---</code></pre>

- You can add Handlebars helpers by creating a helpers/ forlder in app/. Refer to Panini documentation on [how to declare helpers](https://github.com/zurb/panini#helpers)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
