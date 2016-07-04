var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinuxInstaller;
(function (LinuxInstaller) {
    var Contracts;
    (function (Contracts) {
        var Installer = (function () {
            function Installer() {
                this.ConfigureTasks();
            }
            Installer.prototype.Run = function () {
                if (this._tasks === null)
                    return;
                for (var i = 0; i < this._tasks.length; i++) {
                    this._tasks[i].Execute();
                }
            };
            return Installer;
        })();
        Contracts.Installer = Installer;
    })(Contracts = LinuxInstaller.Contracts || (LinuxInstaller.Contracts = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var Logging;
    (function (Logging) {
        (function (LogType) {
            LogType[LogType["Error"] = 0] = "Error";
            LogType[LogType["Warning"] = 1] = "Warning";
            LogType[LogType["Info"] = 2] = "Info";
        })(Logging.LogType || (Logging.LogType = {}));
        var LogType = Logging.LogType;
        var LogTypeAsString = [
            "Error  ",
            "Warning",
            "Info   "
        ];
        var LogEntity = (function () {
            function LogEntity(type, message) {
                this.Type = type;
                this.Message = message;
            }
            return LogEntity;
        })();
        Logging.LogEntity = LogEntity;
        var SimpleLogFormatter = (function () {
            function SimpleLogFormatter() {
            }
            SimpleLogFormatter.prototype.Format = function (logEntity) {
                var formattedLog = ""
                    + "[" + LogTypeAsString[logEntity.Type] + "]"
                    + "-" + logEntity.Message;
                return formattedLog;
            };
            return SimpleLogFormatter;
        })();
        Logging.SimpleLogFormatter = SimpleLogFormatter;
        var AbstractLogger = (function () {
            function AbstractLogger(logFormatter) {
                this._logFormatter = logFormatter;
            }
            AbstractLogger.prototype.Log = function (logEntity) {
                this._logEntity = logEntity;
                this.OnLog(this._logFormatter.Format(logEntity));
            };
            AbstractLogger.prototype.LogError = function (message) {
                this.Log(new Logging.LogEntity(Logging.LogType.Error, message));
            };
            AbstractLogger.prototype.LogWarning = function (message) {
                this.Log(new Logging.LogEntity(Logging.LogType.Warning, message));
            };
            AbstractLogger.prototype.LogInfo = function (message) {
                this.Log(new Logging.LogEntity(Logging.LogType.Info, message));
            };
            return AbstractLogger;
        })();
        Logging.AbstractLogger = AbstractLogger;
        var NoLogger = (function (_super) {
            __extends(NoLogger, _super);
            function NoLogger() {
                _super.apply(this, arguments);
            }
            NoLogger.prototype.OnLog = function (log) { };
            return NoLogger;
        })(AbstractLogger);
        Logging.NoLogger = NoLogger;
        var ConsoleLogger = (function (_super) {
            __extends(ConsoleLogger, _super);
            function ConsoleLogger(logFormatter) {
                _super.call(this, logFormatter);
            }
            ConsoleLogger.prototype.OnLog = function (log) {
                if (this._logEntity.Type == LogType.Error) {
                    console.error(log);
                }
                else if (this._logEntity.Type == LogType.Info) {
                    console.info(log);
                }
                else if (this._logEntity.Type == LogType.Warning) {
                    console.warn(log);
                }
                else {
                    console.log(log);
                }
            };
            return ConsoleLogger;
        })(AbstractLogger);
        Logging.ConsoleLogger = ConsoleLogger;
    })(Logging = LinuxInstaller.Logging || (LinuxInstaller.Logging = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var Helpers;
    (function (Helpers) {
        function RunSystemCommand(commandWithArgs, onFinish) {
            var exec = require("child_process").exec;
            exec(commandWithArgs, function (error, stdout, stderr) {
                onFinish(error);
            });
        }
        Helpers.RunSystemCommand = RunSystemCommand;
        var _logger = new LinuxInstaller.Logging.ConsoleLogger(new LinuxInstaller.Logging.SimpleLogFormatter());
        function Logger() {
            return _logger;
        }
        Helpers.Logger = Logger;
    })(Helpers = LinuxInstaller.Helpers || (LinuxInstaller.Helpers = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
