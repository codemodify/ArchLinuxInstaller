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
            }
            return Installer;
        }());
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
        }());
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
        }());
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
        }());
        Logging.AbstractLogger = AbstractLogger;
        var NoLogger = (function (_super) {
            __extends(NoLogger, _super);
            function NoLogger() {
                _super.apply(this, arguments);
            }
            NoLogger.prototype.OnLog = function (log) { };
            return NoLogger;
        }(AbstractLogger));
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
        }(AbstractLogger));
        Logging.ConsoleLogger = ConsoleLogger;
    })(Logging = LinuxInstaller.Logging || (LinuxInstaller.Logging = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var InputOutput;
    (function (InputOutput) {
        // https://www.npmjs.com/package/colors
        (function (FColor) {
            FColor[FColor["Black"] = 0] = "Black";
            FColor[FColor["Red"] = 1] = "Red";
            FColor[FColor["Green"] = 2] = "Green";
            FColor[FColor["Yellow"] = 3] = "Yellow";
            FColor[FColor["Blue"] = 4] = "Blue";
            FColor[FColor["Magenta"] = 5] = "Magenta";
            FColor[FColor["Cyan"] = 6] = "Cyan";
            FColor[FColor["White"] = 7] = "White";
            FColor[FColor["Gray"] = 8] = "Gray";
        })(InputOutput.FColor || (InputOutput.FColor = {}));
        var FColor = InputOutput.FColor;
        (function (BColor) {
            BColor[BColor["Black"] = 0] = "Black";
            BColor[BColor["Red"] = 1] = "Red";
            BColor[BColor["Green"] = 2] = "Green";
            BColor[BColor["Yellow"] = 3] = "Yellow";
            BColor[BColor["Blue"] = 4] = "Blue";
            BColor[BColor["Magenta"] = 5] = "Magenta";
            BColor[BColor["Cyan"] = 6] = "Cyan";
            BColor[BColor["White"] = 7] = "White";
        })(InputOutput.BColor || (InputOutput.BColor = {}));
        var BColor = InputOutput.BColor;
        (function (FStyle) {
            FStyle[FStyle["Reset"] = 0] = "Reset";
            FStyle[FStyle["Bold"] = 1] = "Bold";
            FStyle[FStyle["Dim"] = 2] = "Dim";
            FStyle[FStyle["Italic"] = 3] = "Italic";
            FStyle[FStyle["Underline"] = 4] = "Underline";
            FStyle[FStyle["Inverse"] = 5] = "Inverse";
            FStyle[FStyle["Hidden"] = 6] = "Hidden";
            FStyle[FStyle["Strikethrough"] = 7] = "Strikethrough";
        })(InputOutput.FStyle || (InputOutput.FStyle = {}));
        var FStyle = InputOutput.FStyle;
        var FColorAsString = [
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "magenta",
            "cyan",
            "white",
            "gray"
        ];
        var BColorAsString = [
            "bgBlack",
            "bgRed",
            "bgGreen",
            "bgYellow",
            "bgBlue",
            "bgMagenta",
            "bgCyan",
            "bgWhite"
        ];
        var FStyleAsString = [
            "reset",
            "bold",
            "dim",
            "italic",
            "underline",
            "inverse",
            "hidden",
            "strikethrough"
        ];
        var Output = (function () {
            function Output() {
                this._colors = require("colors/safe");
            }
            Output.prototype.Write = function (message, color, background, style) {
                var foreColorName = "" + FColorAsString[color];
                var backColorName = "" + BColorAsString[background];
                var styleColorName = "" + FStyleAsString[style];
                // console.log(this._colors[foreColorName][backColorName][styleColorName](message));
                process.stdout.write(this._colors[foreColorName][backColorName][styleColorName](message));
                return this;
            };
            Output.prototype.WriteLine = function (message, color, background, style) {
                this.Write(message, color, background, style);
                process.stdout.write("\r\n");
                return this;
            };
            Output.prototype.Clear = function () {
                process.stdout.write("\033c");
                return this;
            };
            return Output;
        }());
        InputOutput.Output = Output;
        var Input = (function () {
            function Input() {
            }
            Input.prototype.Get = function (delegate) {
                process.stdin.resume();
                process.stdin.setEncoding("utf8");
                process.stdin.once("data", function (userInput) {
                    userInput = LinuxInstaller.Helpers.Strings.RemoveIfExistsAtEnd(userInput, "\r");
                    userInput = LinuxInstaller.Helpers.Strings.RemoveIfExistsAtEnd(userInput, "\n");
                    delegate(userInput);
                });
            };
            return Input;
        }());
        InputOutput.Input = Input;
    })(InputOutput = LinuxInstaller.InputOutput || (LinuxInstaller.InputOutput = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var Runner;
    (function (Runner) {
        // Depends on - https://github.com/getify/asynquence
        var ASQ = require("asynquence");
        ASQ.extend("Parallel", function __build__(api, internals) {
            return api.gate;
        });
        ASQ.extend("This", function __build__(api, internals) {
            return api.then;
        });
        ASQ.extend("Then", function __build__(api, internals) {
            return api.then;
        });
        ASQ.extend("OnError", function __build__(api, internals) {
            return api.or;
        });
        var TaskRunner = (function () {
            function TaskRunner() {
                this._asq = ASQ();
                return this._asq;
            }
            // These below are just to make the TS copmiler happy
            // At runtime the ASQ extensions will run
            TaskRunner.prototype.Parallel = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this;
            };
            TaskRunner.prototype.This = function (p) {
                return this;
            };
            TaskRunner.prototype.Then = function (p) {
                return this;
            };
            TaskRunner.prototype.OnError = function (p) {
                return this;
            };
            return TaskRunner;
        }());
        Runner.TaskRunner = TaskRunner;
    })(Runner = LinuxInstaller.Runner || (LinuxInstaller.Runner = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var Helpers;
    (function (Helpers) {
        function IsNullOrEmpty(object) {
            // Quick Check
            if ((object === null)
                || (object === undefined)
                || (object === "undefined"))
                return true;
            // [] or ""
            if (object.constructor === Array || object.constructor === String)
                return (object.length === 0);
            // {}
            if (object.constructor === Object) {
                var propertiesCount = 0;
                for (var propertyName in object) {
                    propertiesCount++;
                    break;
                }
                return (propertiesCount === 0);
            }
            // Anything else (seems only "Number" & "Function" is left but those would be excluded at first IF)
            return false;
        }
        Helpers.IsNullOrEmpty = IsNullOrEmpty;
        var _logger = new LinuxInstaller.Logging.ConsoleLogger(new LinuxInstaller.Logging.SimpleLogFormatter());
        function Logger() {
            return _logger;
        }
        Helpers.Logger = Logger;
        function RunSystemCommand(commandWithArgs, onFinish) {
            var exec = require("child_process").exec;
            exec(commandWithArgs, function (error, stdout, stderr) {
                onFinish(error, stdout, stderr);
            });
        }
        Helpers.RunSystemCommand = RunSystemCommand;
        var _output = new LinuxInstaller.InputOutput.Output();
        function Output() {
            return _output;
        }
        Helpers.Output = Output;
        var _input = new LinuxInstaller.InputOutput.Input();
        function Input() {
            return _input;
        }
        Helpers.Input = Input;
        function Run() {
            return new LinuxInstaller.Runner.TaskRunner();
        }
        Helpers.Run = Run;
    })(Helpers = LinuxInstaller.Helpers || (LinuxInstaller.Helpers = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
var LinuxInstaller;
(function (LinuxInstaller) {
    var Helpers;
    (function (Helpers) {
        var Strings;
        (function (Strings) {
            function ReplaceAll(originalString, stringToFind, replacingString) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return "";
                }
                // Escape things => http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711
                stringToFind = stringToFind.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                return originalString.replace(new RegExp(stringToFind, 'g'), replacingString);
            }
            Strings.ReplaceAll = ReplaceAll;
            function ReplaceAllInArray(originalString, stringsToFind, replacingString) {
                var result = originalString;
                for (var i = 0; i < stringsToFind.length; i++) {
                    result = ReplaceAll(result, stringsToFind[i], replacingString);
                }
                return result;
            }
            Strings.ReplaceAllInArray = ReplaceAllInArray;
            function RemoveIfExistsAtEnd(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return "";
                }
                var newSubstringLength = (originalString.length - stringToFind.length);
                if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
                    return originalString.substring(0, newSubstringLength);
                }
                return originalString;
            }
            Strings.RemoveIfExistsAtEnd = RemoveIfExistsAtEnd;
            function StartsWith(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return false;
                }
                if (originalString.indexOf(stringToFind) === 0) {
                    return true;
                }
                return false;
            }
            Strings.StartsWith = StartsWith;
            function EndsWith(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return false;
                }
                var newSubstringLength = (originalString.length - stringToFind.length);
                if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
                    return true;
                }
                return false;
            }
            Strings.EndsWith = EndsWith;
            function Contains(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)
                    || Helpers.IsNullOrEmpty(stringToFind)) {
                    return false;
                }
                return (originalString.indexOf(stringToFind) !== -1);
            }
            Strings.Contains = Contains;
        })(Strings = Helpers.Strings || (Helpers.Strings = {}));
    })(Helpers = LinuxInstaller.Helpers || (LinuxInstaller.Helpers = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
/// <reference path="LinuxInstaller.ts"/>
var LinuxInstaller;
(function (LinuxInstaller) {
    var Arch;
    (function (Arch) {
        var Installer = (function (_super) {
            __extends(Installer, _super);
            function Installer() {
                _super.apply(this, arguments);
            }
            Installer.prototype.Run = function () {
                LinuxInstaller.Helpers.Output().Clear();
                var task1 = new DiskPartitionTask();
                LinuxInstaller.Helpers.Run()
                    .This(function (done) {
                    task1.Execute(done);
                })
                    .Then(function (done) {
                    done();
                })
                    .OnError(function (error) {
                    LinuxInstaller.Helpers.Logger().LogError(error);
                });
            };
            return Installer;
        }(LinuxInstaller.Contracts.Installer));
        Arch.Installer = Installer;
        var DiskPartitionTask = (function () {
            function DiskPartitionTask() {
            }
            DiskPartitionTask.prototype.Execute = function (parentDone) {
                var thisRef = this;
                var cmd = "cfdisk";
                LinuxInstaller.Helpers.Run()
                    .This(function (done) {
                    LinuxInstaller.Helpers.RunSystemCommand(cmd, function (error, stdout, stderr) {
                        done();
                    });
                })
                    .Then(function (done) {
                    LinuxInstaller.Helpers.Output().WriteLine("Disk Partition Finished. \r\n" +
                        "I need the partition names for EFI, Swap & Root. EFI and Root are required.", LinuxInstaller.InputOutput.FColor.White, LinuxInstaller.InputOutput.BColor.Black, LinuxInstaller.InputOutput.FStyle.Underline);
                    LinuxInstaller.Helpers.Output().Write("EFI:  ", LinuxInstaller.InputOutput.FColor.Cyan, LinuxInstaller.InputOutput.BColor.Black, LinuxInstaller.InputOutput.FStyle.Bold);
                    LinuxInstaller.Helpers.Input().Get(function (enteredValue1) {
                        thisRef.EfiPartition = enteredValue1;
                        LinuxInstaller.Helpers.Output().Write("Swap: ", LinuxInstaller.InputOutput.FColor.Green, LinuxInstaller.InputOutput.BColor.Black, LinuxInstaller.InputOutput.FStyle.Bold);
                        LinuxInstaller.Helpers.Input().Get(function (enteredValue2) {
                            thisRef.SwapPartition = enteredValue2;
                            LinuxInstaller.Helpers.Output().Write("Root: ", LinuxInstaller.InputOutput.FColor.Green, LinuxInstaller.InputOutput.BColor.Black, LinuxInstaller.InputOutput.FStyle.Bold);
                            LinuxInstaller.Helpers.Input().Get(function (enteredValue3) {
                                thisRef.RootPartition = enteredValue3;
                                LinuxInstaller.Helpers.Output().WriteLine("EFI  -> " + thisRef.EfiPartition, LinuxInstaller.InputOutput.FColor.Yellow, LinuxInstaller.InputOutput.BColor.Magenta, LinuxInstaller.InputOutput.FStyle.Italic);
                                LinuxInstaller.Helpers.Output().WriteLine("Swap -> " + thisRef.SwapPartition, LinuxInstaller.InputOutput.FColor.Yellow, LinuxInstaller.InputOutput.BColor.Magenta, LinuxInstaller.InputOutput.FStyle.Italic);
                                LinuxInstaller.Helpers.Output().WriteLine("Root -> " + thisRef.RootPartition, LinuxInstaller.InputOutput.FColor.Yellow, LinuxInstaller.InputOutput.BColor.Magenta, LinuxInstaller.InputOutput.FStyle.Italic);
                                done();
                            });
                        });
                    });
                })
                    .Then(function (done) {
                    parentDone();
                    done();
                })
                    .OnError(function (error) {
                    parentDone.fail(error);
                });
            };
            return DiskPartitionTask;
        }());
    })(Arch = LinuxInstaller.Arch || (LinuxInstaller.Arch = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
(new LinuxInstaller.Arch.Installer()).Run();
