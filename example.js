var json = require("./test/fixtures/my-website.json");

require("./")({
    input: json,
    config: {
        logLevel: "debug"
    },
    cb: function (err, out) {
        console.log(out);
    }
});