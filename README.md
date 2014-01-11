grunt-prepr
=============

[Grunt][grunt] task that provides a C++ like preprocessor (with some limitations, see examples) for JavaScript, CSS and other source code. Supported directives are:

```
#ifdef
#ifndef
#endif
#define
#undef
```

The task allows to perform both conditional preprocessing of the source code and to define macros.

## Getting Started

### Setup task grunt-prepr with grunt.js

Install this task next to your project's [grunt.js gruntfile][getting_started] with:

```shell
npm install grunt-prepr
```

Then add the line bellow to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-prepr');
```

## How to config

The standard Grunt conventions are followed when configuring task:

```js
grunt.initConfig({
  grunt.initConfig({
    prepr: {
        //Mask, output directory specified
        target1: {
            defined: ["PROD"],
            src: "in/*.js",
            dest: "."
        },
        //Mask, outputting in the same directory
        target2: {
            defined: ["DEBUG"],
            src: "in/*.js"
        },
        //File mask, JS and CSS, output directory specified
        target3: {
            defined: ["DEBUG"],
            src: "in/*",
            dest: "."
        },
        //Processing single file
        target4: {
            src: "in/valid_styles_with_variables.css",
            dest: "."
        },
        //Processing recursively all JS files
        target5: {
            defined: ["DEBUG"],
            src: "in/**/*.js",
            dest: "."
        }
    }
  });
```

## Examples

TODO:

## License

MIT License
(c) [Anton Ivanov](http://smthngsmwhr.wordpress.com/)

Credits
---------------

The following plugins are used during the build:

* JSHint for Grunt [grunt-contrib-jshint][grunt-contrib-jshint]
* Jasmine for Grunt [grunt-contrib-jasmine][grunt-contrib-jasmine]

[grunt]: https://github.com/cowboy/grunt
[grunt-contrib-jshint]: https://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-jasmine]: https://github.com/gruntjs/grunt-contrib-jasmine