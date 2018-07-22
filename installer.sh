#!/bin/sh

# Colors Setup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Internet Setup
if ping -c 1 google.com &> /dev/null
if [[ $? -eq 0 ]]; then
	echo "${GREEN}INTERNET - OK"
else
	echo "${RED}INTERNET NEEDED"
	wifi-menu
fi

# System Disk
read -p "${YELLOW}Disk to install to. (Ex: /dev/nvme0n1): " disk
echo "label: gpt" | sfdisk "${disk}"

echo 'start=2048, type=83' | sudo sfdisk "${disk}"



# cfdisk "${disk}"

# mkfs.fat "${disk}p1"
# mkswap ${disk}.p2
# mkfs.ext4 ${disk}.p3

# swapon ${disk}.p2

# mount ${disk}.p3 /mnt
# mkdir /mnt/boot
# mount ${disk}.p1 /mnt/boot

# timedatectl set-ntp true

# cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup
# pacman -S reflector --noconfirm
# reflector --verbose --latest 5 --sort rate --save /etc/pacman.d/mirrorlist

# pacstrap /mnt base base-devel
# genfstab -U /mnt >> /mnt/etc/fstab

# curl -o /mnt/root/system-setup.sh https://raw.githubusercontent.com/nic0lae/ProtheusInstaller/master/system-setup.sh
# arch-chroot /mnt sh /root/system-setup.sh