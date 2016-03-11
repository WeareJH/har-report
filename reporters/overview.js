var path  = require("path");

module.exports = function logCookies (opts, done) {

    var outfile = "overview-report.json";

    var js     = [];
    var css    = [];
    var images = [];

    var out = opts.input.log.entries.map(function (item) {
        var url = require("url").parse(item.request.url);
        if (path.extname(url.pathname).slice(1) === "js") {
            js.push(item.request.url);
        }
        if (path.extname(url.pathname).slice(1) === "css") {
            css.push(item.request.url);
        }
        if (path.extname(url.pathname).slice(1).match(/jpe?g|png/i)) {
            images.push(item.request.url);
        }
        return item.request.url;
    });

    var dataOut = {
        url: opts.input.log.pages[0].title,
        reportType: "Overview of requests",
        "Number of requests" : out.length,
        "Breakdown": {
            "JS": {
                count: js.length,
                files: js
            },
            "CSS": {
                count: css.length,
                files: css
            },
            "Images": {
                count: images.length,
                files: images
            }
        }
    };
    if (out.length) {
        return done(null, {
            files: [
                {
                    type: "json",
                    path: outfile,
                    data: dataOut
                },
                {
                    type: "txt",
                    path: 'images.txt',
                    content: images.join('\n')
                },
                {
                    type: "txt",
                    path: "css.txt",
                    content: css.join('\n')
                },
                {
                    type: "txt",
                    path: "js.txt",
                    content: js.join('\n')
                }
            ],
            log: [
                {
                    level: "info",
                    message: ["Overview file report written to {yellow:%s}", outfile]
                },
                {
                    level: "info",
                    message: ["newline separated files with links to css/js/images saved as txt files"]
                }
            ]
        });
    }

    done(null);
};
