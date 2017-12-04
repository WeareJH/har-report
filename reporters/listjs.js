const { sumSize } = require("../lib/utils");

var utils = require("../lib/utils");
var parse = require('url').parse;

module.exports = function logCookies (opts, done) {

    var outfile = "js-report.json";
    var target = parse(opts.input.log.entries[0].request.url);

    var out = opts.input.log.entries.filter(function (item) {
        var urlObj = require("url").parse(item.request.url);
        return require("path").extname(urlObj.pathname).slice(1) === "js";
    }).map(function (item) {
        return {
            url: item.request.url,
            body: item.response.content
        };
    });

    var own = out.filter(item => parse(item.url).host === target.host);
    var third = out.filter(item => parse(item.url).host !== target.host);

    var dataOut = {
        url: opts.input.log.pages[0].title,
        reportType: "JS resources",
        fileCount: out.length,
        totalSize: utils.humanFileSize(sumSize(out), true),
        ownDomain: {
            fileCount: own.length,
            totalSize: utils.humanFileSize(sumSize(own), true),
        },
        thirdParty: {
            fileCount: third.length,
            totalSize: utils.humanFileSize(sumSize(third), true),
        },
        filelist: out.map(function (item) {
            return item.url;
        }),
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
