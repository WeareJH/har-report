var _      = require("lodash");

module.exports = function logCookies (opts, done) {

    var outFile = "duplicate-cookies.json";

    var out = opts.input.log.entries.filter(function (item) {
        return item.response.cookies.length;
    }).filter(function (item) {
        return _.uniq(item.response.cookies, "name").length !== item.response.cookies.length;
    });

    if (out.length) {
        return done(null, {
            file: {
                type: "json",
                path: outFile,
                data: out
            },
            log: [
                {
                    level: "info",
                    message: ["Duplicate cookies detected. See {yellow:%s} in the reports folder", outFile]
                }
            ]
        });
    }

    done(null);
};