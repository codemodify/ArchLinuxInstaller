/// <reference path="LinuxInstaller.ts"/>

namespace LinuxInstaller.Arch {
    export class Installer extends Contracts.Installer {
        protected OnRun(parentDone: any) {
            var partitionningTask: DiskPartitionTask = new DiskPartitionTask();

            Helpers.Run()
                .This(function (done) {
                    partitionningTask.Run(done);
                })
                .Then(function (done){
                    var task = new NewFsTask(
                        partitionningTask.EfiPartition,
                        partitionningTask.SwapPartition,
                        partitionningTask.RootPartition
                    );
                    task.Run(done);
                })
                .Then(function (done){
                    parentDone();
                    done();
                })
                .OnError(function (error){
                    Helpers.Logger().LogError(error);
                });
        }
    }

    class DiskPartitionTask extends Contracts.Runnable {
        public EfiPartition: string;
        public SwapPartition: string;
        public RootPartition: string;

        protected OnRun(parentDone: any) {
            var thisRef = this;

            Helpers.Run()
                .This(function (done){
                    var cmd: string = "cfdisk";

                    Helpers.Logger().LogInfo("Step " + cmd);

                    Helpers.RunSystemCommand(cmd, "", function() {
                        done();
                    });
                })
                .Then(function(done) {
                    Helpers.Output().WriteLine(
                        "Disk Partition Finished. \r\n" +
                        "I need the partition names for EFI, Swap & Root. EFI and Root are required.",
                        InputOutput.FColor.White,
                        InputOutput.BColor.Black,
                        InputOutput.FStyle.Underline
                    );

                    Helpers.Output().Write("EFI:  ", InputOutput.FColor.Cyan, InputOutput.BColor.Black, InputOutput.FStyle.Bold);
                    Helpers.Input().Get(function (enteredValue1: string) {
                        thisRef.EfiPartition = enteredValue1;

                        Helpers.Output().Write("Swap: ", InputOutput.FColor.Green, InputOutput.BColor.Black, InputOutput.FStyle.Bold);
                        Helpers.Input().Get(function (enteredValue2: string) {
                            thisRef.SwapPartition = enteredValue2;

                            Helpers.Output().Write("Root: ", InputOutput.FColor.Green, InputOutput.BColor.Black, InputOutput.FStyle.Bold);
                            Helpers.Input().Get(function (enteredValue3: string) {
                                thisRef.RootPartition = enteredValue3;

                                Helpers.Output().WriteLine("EFI  -> " + thisRef.EfiPartition, InputOutput.FColor.Yellow, InputOutput.BColor.Magenta, InputOutput.FStyle.Italic);
                                Helpers.Output().WriteLine("Swap -> " + thisRef.SwapPartition, InputOutput.FColor.Yellow, InputOutput.BColor.Magenta, InputOutput.FStyle.Italic);
                                Helpers.Output().WriteLine("Root -> " + thisRef.RootPartition, InputOutput.FColor.Yellow, InputOutput.BColor.Magenta, InputOutput.FStyle.Italic);

                                done();
                            });
                        });
                    });
                })
                .Then(function(done) {
                    parentDone();
                    done();
                })
                .OnError(function(error) {
                    parentDone.fail(error);
                })
        }
    }

    class NewFsTask extends Contracts.Runnable {
        private _efi: string;
        private _swap: string;
        private _root: string;

        constructor(efi: string, swap: string, root: string) {
            super();

            this._efi = efi;
            this._swap = efi;
            this._root = root;
        }

        protected OnRun(parentDone: any) {
            var thisRef = this;

            Helpers.Run()
                .This(function (done){
                    Helpers.RunSystemCommand("mkfs.msdos " + thisRef._efi, function(error: string, stdout: string, stderr: string) {
                        done();
                    });
                })
                .Then(function(done) {
                    if (!Helpers.IsNullOrEmpty(thisRef._swap)) {
                        Helpers.RunSystemCommand("mkswap " + thisRef._swap, function(error: string, stdout: string, stderr: string) {
                            done();
                        });
                    }
                    else {
                        done();
                    }
                })
                .Then(function(done) {
                    Helpers.RunSystemCommand("mkfs.ext4 " + thisRef._root, function(error: string, stdout: string, stderr: string) {
                        done();
                    });
                })
                .Then(function(done) {
                    parentDone();
                    done();
                })
                .OnError(function(error) {
                    parentDone.fail(error);
                })
        }
    }
}

(new LinuxInstaller.Arch.Installer()).Execute();