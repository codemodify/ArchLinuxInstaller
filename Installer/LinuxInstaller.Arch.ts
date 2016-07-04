/// <reference path="LinuxInstaller.ts"/>

namespace LinuxInstaller.Arch {
    export class Installer extends Contracts.Installer {
        public ConfigureTasks() {
            this._tasks = [
                new DiskPartitionTask()
            ];
        }
    }

    class DiskPartitionTask implements Contracts.Task {
        Execute() {

            var cmd: string = "";

            Helpers.Logger().LogInfo("Executing: " + cmd);

            Helpers.RunSystemCommand(cmd, function(error: string) {
                Helpers.Logger().LogError(error);
            });
        }
    }
}

(new LinuxInstaller.Arch.Installer()).Run();