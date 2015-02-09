var json   = require("./fixtures/har.json");
var path   = require("path");
var har    = require("../");
var assert = require("chai").assert;

describe("Parsing cookie errors", function(){
    it("should return information about written files + logs", function(done) {
        har({
            input: json,
            cb: function (err, out) {

                var file = out.files.filter(function (item) {
                    return item.path === "cookie-report.json";
                })[0];

                assert.equal(file.data.length, 1);

                done();
            }
        });
    });
    it("should return information about written when `outdir` given", function(done) {
        har({
            config: {
                outdir: "reportz"
            },
            input: json,
            cb: function (err, out) {
                var file = out.files.filter(function (item) {
                    return item.path === "cookie-report.json";
                })[0];
                assert.include(
                    file.filepath,
                    path.resolve(process.cwd(), "reportz/cookie-report.json")
                );
                done();
            }
        });
    });
});
