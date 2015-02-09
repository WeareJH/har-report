var path      = require("path");
var fs        = require("fs-extra");
var each      = require("async-each-series");
var logger    = require("./lib/logger");
var Immutable = require("immutable");

/**
 * @type {{cwd: (String)}}
 */
var defaultConfig = Immutable.fromJS({
    cwd:    process.cwd(),
    outdir: "report",
    logLevel: "info"
});

module.exports = function (opts) {

    opts = opts || {};

    var config = defaultConfig.mergeDeep(Immutable.fromJS(opts.config || {}));

    logger.setLevel(config.get("logLevel"));

    runTasks({
        tasks:  require("./reporters/index"),
        input:  opts.input,
        config: config,
        cb: opts.cb || function (err) {
            if (err) {
                console.log(err.message);
                console.log(err.stack);
            }
        }
    });
};

/**
 * @param opts
 */
function runTasks(opts) {

    var files = [];
    var logs  = [];

    each(opts.tasks, function (task, cb) {

        logger.debug("{yellow:--->} {grey:Running task:   {grey:%s}", task.name);

        task.fn({
            input: opts.input
        }, function (err, out) {
            if (err) {
                return cb(err);
            }
            if (out) {
                if (out.file) {
                    files.push(writeFile({file: out.file, config: opts.config}));
                }
                if (out.log) {
                    logs.push(out.log);
                    logMessage({log: out.log, config: opts.config});
                }
            }

            logger.debug("{green:---+} {grey:Completed task: {grey:%s}", task.name);

            cb(null);
        });

    }, function (err) {

        if (err) {
            return opts.cb(err);
        }

        opts.cb(null, {
            files: files,
            logs:  logs
        });
    });
}

function logMessage (opts) {
    if (Array.isArray(opts.log)) {
        opts.log.forEach(function (item) {
            logger[item.level].apply(logger, item.message);
        });
    }
}

/**
 * @param opts
 */
function writeFile (opts) {

    var content  = opts.file.content || "";
    var filepath = path.join(opts.config.get("cwd"), opts.config.get("outdir"), opts.file.path);

    if (opts.file.type === "json") {
        content = JSON.stringify(opts.file.data, null, 4);
    }

    fs.ensureDirSync(path.dirname(filepath));
    fs.writeFileSync(filepath, content);

    opts.file.filepath = filepath;
    return opts.file;
}