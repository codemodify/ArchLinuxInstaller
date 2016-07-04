
declare var require;

namespace LinuxInstaller.Contracts {
    export interface Task {
        Execute();
    }

    export interface CmdExecDelegate {
        (error: string): void;
    }

    export abstract class Installer {
        protected _tasks: Contracts.Task[];

        public abstract ConfigureTasks();

        public Run() {
            if (this._tasks === null)
                return;

            for (var i=0; i < this._tasks.length; i++) {
                this._tasks[i].Execute();
            }
        }
    }
}

namespace LinuxInstaller.Logging {
    export enum LogType {
        Error,
        Warning,
        Info
    }

    var LogTypeAsString = [
        "Error  ",
        "Warning",
        "Info   "
    ];

    export class LogEntity {
        Type: LogType;
        Message: string;
        
        constructor(type: LogType, message: string) {
            this.Type = type;
            this.Message = message;
        }
    }

    export interface ILogger {
        LogError(message: string);
        LogWarning(message: string);
        LogInfo(message: string);
    }

    interface ILoggerImpl {
        Log(logEntity: LogEntity);
    }
    
    interface ILogFormatter {
        Format(logEntity: LogEntity): string;
    }

    export class SimpleLogFormatter implements ILogFormatter {
        Format(logEntity: LogEntity): string {
            var formattedLog = ""
                + "[" + LogTypeAsString[logEntity.Type] + "]"
                + "-" + logEntity.Message;

            return formattedLog;
        }
    }
    
    export abstract class AbstractLogger implements ILogger, ILoggerImpl {
        private _logFormatter: ILogFormatter;
        protected _logEntity: LogEntity;

        constructor(logFormatter: ILogFormatter) {
            this._logFormatter = logFormatter;
        }

        public Log(logEntity: LogEntity) {
            this._logEntity = logEntity;
            this.OnLog(this._logFormatter.Format(logEntity));
        }
        
        public LogError(message: string) {
            this.Log(new Logging.LogEntity(Logging.LogType.Error, message));
        }

        public LogWarning(message: string) {
            this.Log(new Logging.LogEntity(Logging.LogType.Warning, message));
        }

        public LogInfo(message: string) {
            this.Log(new Logging.LogEntity(Logging.LogType.Info, message));
        }

        protected abstract OnLog(log: string);
    }

    export class NoLogger extends AbstractLogger {
        protected OnLog(log: string) {}      
    }

    export class ConsoleLogger extends AbstractLogger {
        constructor(logFormatter: ILogFormatter) {
            super(logFormatter);
        }

        protected OnLog(log: string) {
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
        }
    }
}

namespace LinuxInstaller.Helpers {
    export function RunSystemCommand(commandWithArgs: string, onFinish: Contracts.CmdExecDelegate) {
        var exec = require("child_process").exec;
        exec(commandWithArgs, function(error, stdout, stderr) {
            onFinish(error);
        });            
    }

    var _logger = new Logging.ConsoleLogger(new Logging.SimpleLogFormatter());
    export function Logger(): Logging.ILogger {
        return _logger;
    }
}