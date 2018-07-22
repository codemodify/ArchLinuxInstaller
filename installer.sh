#!/bin/sh

wifi-menu
timedatectl set-ntp true
cfdisk /dev/nvme0n1 # kill all the Windows crap, allocate like this: 512MB EFI, 2xRAM swap, what is left will be / as ext4

mkfs.fat /dev/nvme0n1p1
mkswap /dev/nvme0n1p2
mkfs.ext4 /dev/nvme0n1p3

swapon /dev/nvme0n1p2

mount /dev/nvme0n1p3 /mnt
mkdir /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot

cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup
pacman -S reflector --noconfirm
reflector --verbose --latest 5 --sort rate --save /etc/pacman.d/mirrorlist

pacstrap /mnt base base-devel
genfstab -U /mnt >> /mnt/etc/fstab

curl -o /mnt/root/system-setup.sh https://raw.githubusercontent.com/nic0lae/ProtheusInstaller/master/system-setup.sh
arch-chroot /mnt sh /root/system-setup.sh