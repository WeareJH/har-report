var utils = require("../lib/utils");

module.exports = function logCookies (opts, done) {

    var outfile = "js-report.json";

    var out = opts.input.log.entries.filter(function (item) {
        var urlObj = require("url").parse(item.request.url);
        return require("path").extname(urlObj.pathname).slice(1) === "js";
    }).map(function (item) {
        return {
            url: item.request.url,
            body: item.response.content
        };
    });

    var size = out.reduce(function (size, item) {
        return size + (item.body.compression || item.body.size);
    }, 0);

    var dataOut = {
        url: opts.input.log.pages[0].title,
        reportType: "JS resources",
        fileCount: out.length,
        filelist: out.map(function (item) {
            return item.url;
        }),
        totalSize: utils.humanFileSize(size, true),
        files: out
    };

    if (out.length) {
        return done(null, {
            file: {
                type: "json",
                path: outfile,
                data: dataOut
            },
            log: [
                {
                    level: "info",
                    message: ["JS file report written to {yellow:%s", outfile]
                }
            ]
        });
    }

    done(null);
};