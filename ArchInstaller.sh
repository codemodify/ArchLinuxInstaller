#!/bin/sh

# Prep the environment
curl -o Installer.sh https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/Installer.sh
chmod +x ./Installer.sh
./Installer.sh
PATH=$PATH:$PWD/nodedist/bin

# Run the installer
curl -o LinuxInstaller.Arch.ts \
        https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/LinuxInstaller.Arch.ts

npm run tsc
node LinuxInstaller.js