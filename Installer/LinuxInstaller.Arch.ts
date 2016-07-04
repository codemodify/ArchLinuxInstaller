/// <reference path="LinuxInstaller.ts"/>

namespace LinuxInstaller.Arch {
    export class Installer extends Contracts.Installer {
        public Run() {
            Helpers.Output().Clear();

            var task1: DiskPartitionTask = new DiskPartitionTask();

            Helpers.Run()
                .This(function (done) {
                    task1.Execute(done);
                })
                .Then(function (done){
                    done();
                })
                .OnError(function (error){
                    Helpers.Logger().LogError(error);
                });
        }
    }

    class DiskPartitionTask implements Contracts.Task {
        public EfiPartition: string;
        public SwapPartition: string;
        public RootPartition: string;

        Execute(parentDone: any) {
            var thisRef = this;

            var cmd: string = "cfdisk";

            Helpers.Run()
                .This(function (done){
                    Helpers.RunSystemCommand(cmd, function(error: string, stdout: string, stderr: string) {
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
}

(new LinuxInstaller.Arch.Installer()).Run();