
declare var require;
declare var process;
declare var Buffer;

namespace LinuxInstaller.Contracts {
    export interface CmdExecDelegate {
        (error: string, stdout: string, stderr: string): void;
    }

    export interface UserInputDelegate {
        (enteredValue: string): void;
    }

    export abstract class Runnable {
        public Run(done: any) {
            Helpers.Logger().LogInfo("Runnig " + Helpers.GetClassName(this));
            this.OnRun(done);
        }

        protected abstract OnRun(done: any);
    }

    export abstract class Installer extends Runnable {
        public Execute() {
            this.Run(function (){});
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

    export class UdpLogger extends AbstractLogger {
        private _id: string;
        private _udpClient: any;

        constructor(logFormatter: ILogFormatter) {
            super(logFormatter);

            this._id = Helpers.NewGuid();

            var PORT = 45867;
            var HOST = 'logs4.papertrailapp.com';

            var dgram = require("dgram");
            this._udpClient = dgram.createSocket('udp4');
        }

        protected OnLog(log: string) {
            const k_HOST: string = "";
            const k_PORT: number = 0;

            var message = new Buffer(log);
            this._udpClient.send(message, 0, message.length, k_HOST, k_HOST, function(err, bytes) {
                if (err) {
                    Helpers.Output().WriteLine(err, InputOutput.FColor.Red, InputOutput.BColor.Yellow, InputOutput.FStyle.Underline)
                }
            });
        }
    }
}

namespace LinuxInstaller.InputOutput {
    // https://www.npmjs.com/package/colors

    export enum FColor {
        Black,
        Red,
        Green,
        Yellow,
        Blue,
        Magenta,
        Cyan,
        White,
        Gray
    }

    export enum BColor {
        Black,
        Red,
        Green,
        Yellow,
        Blue,
        Magenta,
        Cyan,
        White
    }

    export enum FStyle {
        Reset,
        Bold,
        Dim,
        Italic,
        Underline,
        Inverse,
        Hidden,
        Strikethrough
    }

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

    export class Output {
        private _colors: any;

        constructor() {
            this._colors = require("colors/safe");
        }

        public Write(message: string, color: FColor, background: BColor, style: FStyle): Output {
            var foreColorName: string = "" + FColorAsString[color];
            var backColorName: string = "" + BColorAsString[background];
            var styleColorName: string = "" + FStyleAsString[style];

            // console.log(this._colors[foreColorName][backColorName][styleColorName](message));
            process.stdout.write(this._colors[foreColorName][backColorName][styleColorName](message));

            return this;
        }

        public WriteLine(message: string, color: FColor, background: BColor, style: FStyle): Output {
            this.Write(message, color, background, style);
            process.stdout.write("\r\n");

            return this;
        }

        public Clear(): Output {
            process.stdout.write("\033c");

            return this;
        }
    }

    export class Input {
        public Get(delegate: Contracts.UserInputDelegate) {
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            process.stdin.once("data", function (userInput) {
                userInput = Helpers.Strings.RemoveIfExistsAtEnd(userInput, "\r");
                userInput = Helpers.Strings.RemoveIfExistsAtEnd(userInput, "\n");
                
                delegate(userInput);
            });
        }
    }
}

namespace LinuxInstaller.Runner {

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

    export class TaskRunner {

        private _asq: any;

        constructor() {
            this._asq = ASQ();
            return this._asq;
        }

        // These below are just to make the TS copmiler happy
        // At runtime the ASQ extensions will run

        public Parallel(...args: any[]): TaskRunner {
            return this;
        }

        public This(p: any): TaskRunner {
            return this;
        }

        public Then(p: any): TaskRunner {
            return this;
        }

        public OnError(p: any): TaskRunner {
            return this;
        }
    }
}

namespace LinuxInstaller.Helpers {
    export function IsNullOrEmpty(object: any) {
        // Quick Check
        if (   (object === null       )
            || (object === undefined  )
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

            return (propertiesCount === 0)
        }

        // Anything else (seems only "Number" & "Function" is left but those would be excluded at first IF)
        return false;
    }

    var _uuid = require("node-uuid");
    export function NewGuid() {
        return _uuid.v4();
    }

    export function GetClassName(objInstance: any): string {
        return objInstance.constructor.toString().match(/\w+/g)[1];
    }

    var _logger = new Logging.UdpLogger(new Logging.SimpleLogFormatter());
    export function Logger(): Logging.ILogger {
        return _logger;
    }

    export function RunSystemCommand(commandWithArgs: string, onFinish: Contracts.CmdExecDelegate) {
        var exec = require("child_process").exec;
        exec(commandWithArgs, function(error, stdout, stderr) {            
            onFinish(error, stdout, stderr);
        });            
    }

    var _output: InputOutput.Output = new InputOutput.Output();
    export function Output() {
        return _output;
    }

    var _input: InputOutput.Input = new InputOutput.Input();
    export function Input() {
        return _input;
    }

    export function Run(): Runner.TaskRunner{
        return new Runner.TaskRunner();
    }
}

namespace LinuxInstaller.Helpers.Strings {
    export function ReplaceAll(originalString: string, stringToFind: string, replacingString: string): string {
        if (Helpers.IsNullOrEmpty(originalString)) {
            return "";
        }
        
        // Escape things => http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711
        stringToFind = stringToFind.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        return originalString.replace(new RegExp(stringToFind, 'g'), replacingString);
    }

    export function ReplaceAllInArray(originalString: string, stringsToFind: string[], replacingString: string): string {
        var result = originalString;
        for (var i = 0; i < stringsToFind.length; i++) {
            result = ReplaceAll(result, stringsToFind[i], replacingString);
        }
        return result;
    }

    export function RemoveIfExistsAtEnd(originalString: string, stringToFind: string): string {
        if (Helpers.IsNullOrEmpty(originalString)) {
            return "";
        }
        var newSubstringLength = (originalString.length - stringToFind.length);
        if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
            return originalString.substring(0, newSubstringLength);
        }
        return originalString;
    }

    export function StartsWith(originalString: string, stringToFind: string): boolean {
        if (Helpers.IsNullOrEmpty(originalString)) {
            return false;
        }
        if (originalString.indexOf(stringToFind) === 0) {
            return true;
        }
        return false;
    }

    export function EndsWith(originalString: string, stringToFind: string): boolean {
        if (Helpers.IsNullOrEmpty(originalString)) {
            return false;
        }
        var newSubstringLength = (originalString.length - stringToFind.length);
        if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
            return true;
        }
        return false;
    }

    export function Contains(originalString: string, stringToFind: string): boolean {
        if (Helpers.IsNullOrEmpty(originalString)
          ||Helpers.IsNullOrEmpty(stringToFind)) {
            return false;
        }
        
        return (originalString.indexOf(stringToFind) !== -1);
    }    
}
