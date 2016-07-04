

namespace LinuxInstaller.Defaults {
}

namespace LinuxInstaller {
    export function Run() {
        
    }

    var _tasks: Contracts.Task[];
    export function Add(task: Contracts.Task) {
        _tasks.push(task);
    }
}