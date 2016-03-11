module.exports = function logCookies (opts, done) {

    var outfile = "images.txt";

    var out = opts.input.log.entries.filter(function (item) {
        var urlObj = require("url").parse(item.request.url);
        var ext = require("path").extname(urlObj.pathname).slice(1);
        if (ext.match(/jpe?g|png/i)) {
            return true;
        }
        return false;
    }).map(function (item) {
        return item.request.url;
    });

    if (out.length) {
        return done(null, {
            file: {
                type: "txt",
                path: outfile,
                content: out.join("\n")
            },
            log: [
                {
                    level: "info",
                    message: ["Image file list written to {yellow:%s", outfile]
                }
            ]
        });
    }

    done(null);
};
