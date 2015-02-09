var path      = require("path");
var fs        = require("fs-extra");
var each      = require("async-each-series");
var logger    = require("./lib/logger");
var Immutable = require("immutable");

/**
 * Default Configuration, can be extended
 * @type {any}
 */
var defaultConfig = Immutable.fromJS({
    cwd:    process.cwd(),
    outdir: "report",
    logLevel: "info",
    writeFiles: true
});

/**
 * Main export
 * @param {{input: object, config: [object], cb: function}} opts
 */
module.exports = function (opts) {

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
 * Run each task in sequence
 * @param {object} opts
 */
function runTasks(opts) {

    var files = [];
    var logs  = [];

    each(opts.tasks, function (task, cb) {

        logger.debug("{yellow:--->} {grey:Running task:   {grey:%s}", task.name);

        task.fn({input: opts.input}, function (err, out) {

            /**
             * Return early with any errors
             */
            if (err) {
                return cb(err);
            }

            /**
             * Accept any files/logs returned by a task
             */
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

    }, complete);

    /**
     * @param {Error} err
     * @returns {*}
     */
    function complete (err) {
        /**
         * Call user callback with any error
         */
        if (err) {
            return opts.cb(err);
        }

        /**
         * Call user callback with success
         */
        opts.cb(null, {
            files: files,
            logs:  logs
        });
    }
}

/**
 * @param {object} opts
 */
function logMessage (opts) {
    if (Array.isArray(opts.log)) {
        opts.log.forEach(function (item) {
            logger[item.level].apply(logger, item.message);
        });
    }
}

/**
 * @param {object} opts
 * @returns {object}
 */
function writeFile (opts) {

    var content  = opts.file.content || "";
    var filepath = path.join(opts.config.get("cwd"), opts.config.get("outdir"), opts.file.path);

    if (opts.file.type === "json") {
        content = JSON.stringify(opts.file.data, null, 4);
    }

    if (opts.config.get("writeFiles")) {
        fs.ensureDirSync(path.dirname(filepath));
        fs.writeFileSync(filepath, content);
    }

    opts.file.filepath = filepath;

    return opts.file;
}