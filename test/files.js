var json   = require("./fixtures/my-website.json");
var path   = require("path");
var har    = require("../");
var assert = require("chai").assert;

describe("Parsing cookie errors", function(){
    it("should return information about written files + logs", function(done) {
        har({
            input: json,
            cb: function (err, out) {
                assert.equal(out.files.length, 1);
                assert.include(
                    out.files[0].filepath,
                    path.resolve(process.cwd(), "report/duplicate-cookies.json")
                );
                assert.equal(out.logs.length, 1);
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
                assert.equal(out.files.length, 1);
                assert.include(
                    out.files[0].filepath,
                    path.resolve(process.cwd(), "reportz/duplicate-cookies.json")
                );
                assert.equal(out.logs.length, 1);
                done();
            }
        });
    });
});
