#!/bin/sh

# Prep the environment for NodeJS
curl -o node.gz https://nodejs.org/dist/v6.2.2/node-v6.2.2-linux-x64.tar.gz
tar -xf node.gz
mv node-*-linux-* nodedist
PATH=$PATH:$PWD/nodedist/bin

# NodeJS is ready, Installer's dependencies
curl -o LinuxInstaller.ts \
        https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/LinuxInstaller.ts

curl -o LinuxInstaller.Helpers.ts \
        https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/LinuxInstaller.Helpers.ts

curl -o package.json \
        https://raw.githubusercontent.com/nic0lae/LinuxInstaller/master/Installer/package.json

npm install