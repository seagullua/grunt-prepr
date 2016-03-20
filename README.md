grunt-prepr
=============

[Grunt][grunt] task that provides a C/C++ like preprocessor (with some limitations, see examples) for JavaScript, CSS and other source code. Supported directives are:

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

Install this task next to your project's `grunt.js` gruntfile with:

```shell
npm install grunt-prepr
```

Then add the line bellow to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-prepr');
```

## How to config

The standard Grunt conventions are followed when configuring task:

```javascript
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

## Using as browserify transform

```javascript
browserify:     {
    options:      {
        transform:  [ require('grunt-prepr').browserify(["DEBUG"]) ],
    }
}
```

## Examples

For more details, refer to the [examples](https://github.com/antivanov/grunt-prepr/tree/master/examples) in the repository and Jasmine [specs](https://github.com/antivanov/grunt-prepr/tree/master/spec).

Although the examples below deal only with JavaScript and CSS, the preprocessor can be used for any source files.

### Conditionals

Input:

```javascript
function add(x, y) {
//#ifdef DEBUG
	console.log("add(" +  x + ", " + y + ")");
//#endif
	return x + y;
}
```

Task configuration:

```javascript
grunt.initConfig({
  prepr: {
    dev: {
      defined: ["DEBUG"],
      src: "src/*.js",
      dest: "build"
    },
    prod: {
      defined: ["PROD"],
      src: "src/*.js",
      dest: "dist"
    }
  }
});
```

Result of running `grunt prepr:prod`:

```javascript
function add(x, y) {
	return x + y;
}
```

Result of running `grunt prepr:dev`:

```javascript
function add(x, y) {
	console.log("add(" +  x + ", " + y + ")");
	return x + y;
}
```

So in the development version logging to console will be left intact while in the production version it will be removed.

### Defining macros

With macros we can, for example, define colors in CSS.

Input:

```css
/* #define $COLOR1 rgb(12, 12, 12)
   #define $COLOR2 rgb(23, 45, 67)
   #define $DEFAULT_BOX_WIDTH 300px*/
.container {
    width: $DEFAULT_BOX_WIDTH;
    position: relative;
}

.button {
    background-color: $COLOR1;
}
```

Output:

```css
.container {
    width: 300px;
    position: relative;
}

.button {
    background-color: rgb(12, 12, 12);
}
```

Macros can also take parameters, please, refer to the Jasmine specs.

## Avoid abusing macros

A word of caution about using macros. The same concerns as in C/C++ apply, the preprocessor is pretty unaware of the structure of the
code (unlike Lisp [macros](http://www.gigamonkeys.com/book/macros-defining-your-own.html)). It treats code as strings and modifications then are pretty limited, the source code with preprocessor directives may become invalid if not handled by a preprocessor and moreover the resulting code may also be invalid if the macros were defined incorrectly.

I would say that `#define` should not be used with JavaScript in most of the cases because of these limitations. Just use the normal functions instead. For example,

instead of:

```javascript
#define MAX(X, Y) (X > Y ? X : Y)

MAX(3, 4);
```

use pure JavaScript solution:

```javascript
function max(x, y) {
    return x > y ? x : y;
}

max(3, 4);
```

## License

MIT License
(c) [Anton Ivanov](http://smthngsmwhr.wordpress.com/)

Credits
---------------

The following plugins are used during the build:

* JSHint for Grunt [grunt-contrib-jshint][grunt-contrib-jshint]
* Jasmine for Grunt [grunt-contrib-jasmine][grunt-contrib-jasmine]

The task was inspired by:

* C preprocessor [c-preprocessor][c-preprocessor]

[c-preprocessor]: http://en.wikipedia.org/wiki/C_preprocessor
[grunt]: https://github.com/cowboy/grunt
[grunt-contrib-jshint]: https://github.com/gruntjs/grunt-contrib-jshint
[grunt-contrib-jasmine]: https://github.com/gruntjs/grunt-contrib-jasmine