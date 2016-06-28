#!/bin/bash 

set BootDevice=$1 # Required
set SwapDevice=$2 # Optional, can be "none"
set RootDevice=$3 # Required

function AreRequirementsSatisfied() {
    local satisfied=1

    if ! [ -b $BootDevice ] ; then
        satisfied=0
        echo "$BootDevice does not exist to be used as 'boot', run cfdisk and create it."
    fi

    if ! [ $SwapDevice -eq "none" ] && ! [ -b $SwapDevice ] ; then
        satisfied=0
        echo "$SwapDevice does not exist to be used as 'swap', run cfdisk and create it."
    fi

    if ! [ -b $RootDevice ] ; then
        satisfied=0
        echo "$RootDevice does not exist to be used as 'root', run cfdisk and create it."
    fi

    return $satisfied
}

function Install() {
    local canContinue=$(AreRequirementsSatisfied)
    echo $canContinue
    if ! [ $canContinue -eq 1 ] ; then 
        return
    fi
}

Install

#locale-gen
