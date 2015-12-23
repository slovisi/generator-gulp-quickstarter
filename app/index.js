'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
    constructor: function () {
        var testLocal;

        generators.Base.apply(this, arguments);

        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });

        this.option('skip-install-message', {
            desc: 'Skips the message after the installation of dependencies',
            type: Boolean
        });

    },
    initializing: function() {
        this.pkg = require('../package.json');
    },
    prompting: function () {
        var done = this.async();

        if (!this.options['skip-welcome-message']) {
            this.log(yosay('Generator Quickstarter 2 : A Yeoman Front-End Boilerplate Generator'));
        }

        var prompts = [{
            type    : 'input',
            name    : 'siteName',
            message : 'What is your project name?',
            default : 'My Website',
            store   : true
        },{
            type    : 'input',
            name    : 'siteLanguage',
            message : 'What is your project main language?',
            default : 'fr',
            store   : true
        },{
            type    : 'input',
            name    : 'gAnalytics',
            message : 'Do you have a Google Analytics ID?',
            default : 'UA-XXXXX-X',
            store   : true
        },{
            type: 'confirm',
            name: 'supportIe8',
            message: 'Would you like to support IE8?',
            default: false
        },{
            type: 'confirm',
            name: 'includeModernizr',
            message: 'Would you like to include Modernizr?',
            default: true
        }, {
            type: 'confirm',
            name: 'includeJQuery',
            message: 'Would you like to include jQuery?',
            default: true
        }];

        this.prompt(prompts, function(answers) {

            this.gAnalytics = answers.gAnalytics;
            this.siteName = answers.siteName;
            this.siteLanguage = answers.siteLanguage;
            this.supportIe8 = answers.supportIe8;
            this.includeModernizr = answers.includeModernizr;
            this.includeJQuery = answers.includeJQuery;


            done();
        }.bind(this));
    },
    writing: {
        gulpfile: function() {
            this.fs.copyTpl(
                this.templatePath('gulpfile.babel.js'),
                this.destinationPath('gulpfile.babel.js'),
                {
                  date: (new Date).toISOString().split('T')[0],
                  name: this.pkg.name,
                  version: this.pkg.version,
                  includeModernizr: this.includeModernizr
                }
            );
        },
        packageJSON: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
        },
        git: function () {
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore'));

            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes'));
        },
        bower: function () {
            var bowerJson = {
                name: _s.slugify(this.appname),
                private: true,
                dependencies: {}
            };

            if (this.includeJQuery) {
                if (this.supportIe8) {
                    bowerJson.dependencies['jquery'] = '~1.11.3';
                } else {
                    bowerJson.dependencies['jquery'] = '~2.1.4';
                }
            }

            this.fs.writeJSON('bower.json', bowerJson);
            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
        },
        editorConfig: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('_eslintignore'),
                this.destinationPath('.eslintignore'));
        },
        h5bp: function () {
            this.fs.copy(
                this.templatePath('favicon.ico'),
                this.destinationPath('app/favicon.ico')
            );

            this.fs.copy(
                this.templatePath('apple-touch-icon.png'),
                this.destinationPath('app/apple-touch-icon.png')
            );

            this.fs.copy(
                this.templatePath('robots.txt'),
                this.destinationPath('app/robots.txt'));
        },
        styles: function () {
            this.fs.copy(
                this.templatePath('scss/screen.scss'),
                this.destinationPath('app/scss/screen.scss')
            );
            this.fs.copy(
                this.templatePath('scss/optionnal/_webfonts.scss'),
                this.destinationPath('app/scss/optionnal/_webfonts.scss')
            );
            this.fs.copy(
                this.templatePath('scss/partials/_application.scss'),
                this.destinationPath('app/scss/partials/_application.scss')
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_boilerplate-defaults.scss'),
                this.destinationPath('app/scss/partials/_boilerplate-defaults.scss')
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_config.scss'),
                this.destinationPath('app/scss/partials/_config.scss'),
                {
                  supportIe8: this.supportIe8
                }
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_debug.scss'),
                this.destinationPath('app/scss/partials/_debug.scss')
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_helpers.scss'),
                this.destinationPath('app/scss/partials/_helpers.scss')
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_normalize.scss'),
                this.destinationPath('app/scss/partials/_normalize.scss')
            );
            this.fs.copyTpl(
                this.templatePath('scss/partials/_print.scss'),
                this.destinationPath('app/scss/partials/_print.scss')
            );

        },
        copy: function() {
            this.fs.copy(
                this.templatePath('*.html'),
                this.destinationPath('app'));
            this.fs.copy(
                this.templatePath('config.rb'),
                this.destinationPath('config.rb'));
            this.fs.copy(
                this.templatePath('img'),
                this.destinationPath('app/img/'));
            this.fs.copyTpl(
                this.templatePath('datas/data.json'),
                this.destinationPath('app/datas/data.json'),{
                    siteName: this.siteName,
                    siteLanguage: this.siteLanguage
                });
            this.fs.copyTpl(
                this.templatePath('datas/ganalytics.json'),
                this.destinationPath('app/datas/ganalytics.json'),{
                    gAnalytics: this.gAnalytics
                });
            this.fs.copy(
                this.templatePath('font'),
                this.destinationPath('app/font/'));
            this.fs.copyTpl(
                this.templatePath('layouts/default.hbs'),
                this.destinationPath('app/layouts/default.hbs'),
                {
                  includeModernizr: this.includeModernizr,
                  includeJQuery: this.includeJQuery
                }
            );
            this.fs.copy(
                this.templatePath('pages'),
                this.destinationPath('app/pages/'));
            this.fs.copy(
                this.templatePath('partials'),
                this.destinationPath('app/partials/'));
        },
        script: function() {
            this.fs.copy(
                this.templatePath('js/*'),
                this.destinationPath('app/src/'));
            mkdirp(
                this.destinationPath('app/src/custom')
            );
            mkdirp(
                this.destinationPath('app/src/plugins')
            );
        }
    },
    install: function () {
        this.installDependencies({
            skipMessage: this.options['skip-install-message'],
            skipInstall: this.options['skip-install']
        });
    },

    end: function () {
        var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
        var howToInstall =
            '\nAfter running ' +
            chalk.yellow.bold('npm install & bower install') +
            ', inject your' +
            '\nfront end dependencies by running ' +
            chalk.yellow.bold('gulp wiredep') +
            '.';

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }

        // wire Bower packages to .html
        wiredep({
            bowerJson: bowerJson,
            directory: 'bower_components',
            ignorePath: /^(\.\.\/)*\.\./,
            src: 'app/index.html'
        });
        // wire Bower packages to .scss
        wiredep({
            bowerJson: bowerJson,
            directory: 'bower_components',
            ignorePath: /^(\.\.\/)+/,
            src: 'app/scss/*.scss'
        });

    }
});
