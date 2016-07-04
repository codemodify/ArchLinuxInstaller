/// <reference path="LinuxInstaller.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinuxInstaller;
(function (LinuxInstaller) {
    var Arch;
    (function (Arch) {
        var Installer = (function (_super) {
            __extends(Installer, _super);
            function Installer() {
                _super.call(this);
            }
            Installer.prototype.ConfigureTasks = function () {
                this._tasks = [
                    new DiskPartitionTask()
                ];
            };
            return Installer;
        })(LinuxInstaller.Contracts.Installer);
        Arch.Installer = Installer;
        var DiskPartitionTask = (function () {
            function DiskPartitionTask() {
            }
            DiskPartitionTask.prototype.Execute = function () {
                var cmd = "";
                LinuxInstaller.Helpers.Logger().LogInfo("Executing: " + cmd);
                LinuxInstaller.Helpers.RunSystemCommand(cmd, function (error) {
                    LinuxInstaller.Helpers.Logger().LogError(error);
                });
            };
            return DiskPartitionTask;
        })();
    })(Arch = LinuxInstaller.Arch || (LinuxInstaller.Arch = {}));
})(LinuxInstaller || (LinuxInstaller = {}));
(new LinuxInstaller.Arch.Installer()).Run();
