#!/bin/bash 

local BootDevice=$1 # Required
local SwapDevice=$2 # Optional, can be "none"
local RootDevice=$3 # Required

function AreRequirementsSatisfied() {
    local satisfied=true

    if [! -b $BootDevice] ; then
        satisfied=false
        echo "$BootDevice does not exist to be used as 'boot', run cfdisk and create it."
    fi
    if [$SwapDevice !-eq "none"] && [! -b $SwapDevice] ; then
        satisfied=false
        echo "$SwapDevice does not exist to be used as 'swap', run cfdisk and create it."
    fi
    if [! -b $RootDevice] ; then
        satisfied=false
        echo "$RootDevice does not exist to be used as 'root', run cfdisk and create it."
    fi

    return $satisfied
}

function Install() {
    local canContinue=$(AreRequirementsSatisfied())
    echo $canContinue
    if [$canContinue !-eq "true"] ; then 
        return
    fi
}

Install()

#locale-gen
