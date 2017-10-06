module.exports = function (grunt) {
    var path = require('path');

    grunt.registerMultiTask('sunergeo-inject-depends', 'Build output of dependency modules and generate list of includes.', function () {

        grunt.log.ok('Generating dependency list and updating ' + this.data.target + '.');

        var fileList = grunt.file.expand(this.data.js, this.data.js.src);
        var tpl = this.data.js.tpl;
        var js_inc = "";
        fileList.forEach(function (file) {
            var inc = tpl.replace("[[filename]]", path.basename(file));
            js_inc += inc + "\r\n";
            grunt.log.ok("Writing new include tag " + inc);
        });

        fileList = grunt.file.expand(this.data.css, this.data.css.src);
        tpl = this.data.css.tpl;
        var css_inc = "";
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
