#!/bin/sh

# Prep the environment for NodeJS
mkdir /temp-ArchInstaller
cd /temp-ArchInstaller
curl -o node.gz https://nodejs.org/dist/v6.2.2/node-v6.2.2.tar.gz
tar -xzvf node.gz
mv node-* nodedist
PATH=$PATH;/temp-ArchInstaller/nodedist/bin

# NodeJS is ready, prep the Installer's dependencies
curl -o package.json https://raw.githubusercontent.com/nic0lae/ArchLinuxInstaller/master/package.json
npm install

# Run the installer
curl -o ArchInstaller.ts https://raw.githubusercontent.com/nic0lae/ArchLinuxInstaller/master/ArchLinuxInstaller.ts
npm run tsc ./ArchInstaller.ts
#node ./ArchInstaller.js