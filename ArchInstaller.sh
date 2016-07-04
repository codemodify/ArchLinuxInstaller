#!/bin/sh

# Prep the environment for NodeJS
mkdir /temp-ArchInstaller
cd /temp-ArchInstaller
curl -o node.gz https://nodejs.org/dist/v6.2.2/node-v6.2.2-linux-x64.tar.gz
tar -xf node.gz
mv node-*-linux-* nodedist
PATH=$PATH:/temp-ArchInstaller/nodedist/bin

# NodeJS is ready, Installer's dependencies
curl -o package.json https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/package.json
npm install


# Run the installer
curl -o LinuxInstaller.Arch.ts \
        https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/LinuxInstaller.Arch.ts

npm run tsc
node LinuxInstaller.Arch.js