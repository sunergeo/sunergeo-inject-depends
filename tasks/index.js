module.exports = function (grunt) {
    var path = require('path');
    const fs = require('fs');
    var bower_dependencies = require('wiredep')();

    grunt.registerMultiTask('sunergeo-inject-depends', 'Build output of dependency modules and generate list of includes.', function () {
        grunt.log.ok('Generating dependency list and updating ' + this.data.target + '.');

        var fileList = grunt.file.expand(this.data.js, this.data.js.src);
        var tpl = this.data.js.tpl;
        var dest = this.data.js.dest;
        var js_inc = "";
        bower_dependencies.js.forEach(function (file) {
            var destfile = path.resolve(__filename, dest + "/" + path.basename(file));
            destfile = path.normalize(path.resolve(dest) + "/" + path.basename(file));
            fs.copyFileSync(file, destfile);
            grunt.log.ok("Copied file " + file + " to " + destfile);

            var inc = tpl.replace("[[filename]]", path.basename(file));
            js_inc += inc + "\r\n";

            grunt.log.ok("Writing new include tag " + inc);
        });
        fileList.forEach(function (file) {
            var inc = tpl.replace("[[filename]]", path.basename(file));
            js_inc += inc + "\r\n";
            grunt.log.ok("Writing new include tag " + inc);
        });

        fileList = grunt.file.expand(this.data.css, this.data.css.src);
        tpl = this.data.css.tpl;
        dest = this.data.css.dest;
        var css_inc = "";
        bower_dependencies.css.forEach(function (file) {
            var destfile = path.resolve(__filename, dest + "/" + path.basename(file));
            destfile = path.normalize(path.resolve(dest) + "/" + path.basename(file));
            fs.copyFileSync(file, destfile);
            grunt.log.ok("Copied file " + file + " to " + destfile);

            var inc = tpl.replace("[[filename]]", path.basename(file));
            css_inc += inc + "\r\n";

            grunt.log.ok("Writing new include tag " + inc);
        });
        fileList.forEach(function (file) {
            var inc = tpl.replace("[[filename]]", path.basename(file));
            css_inc += inc + "\r\n";
            grunt.log.ok("Writing new include tag " + inc);
        });

        var targetfile = grunt.file.read(this.data.target);
        targetfile = targetfile.replace("[[include_depends:js]]", js_inc);
        targetfile = targetfile.replace("[[include_depends:css]]", css_inc);

        if (grunt.file.write(this.data.target, targetfile)) {
            grunt.log.ok(this.data.target + ' successfully updated.');
        } else {
            grunt.fail.fatal("Could not write target file " + this.data.target);
        }
    });
};
