
ln -sf /usr/share/zoneinfo/US/Pacific /etc/localtime
hwclock --systohc

sudo nano /etc/locale.gen # uncomment the `en_US.UTF-8 UTF-8`
locale-gen

nano /etc/locale.conf
		LANG=en_US.UTF-8
nano /etc/hostname
		arch-devbox
nano /etc/hosts
		127.0.0.1	arch-devbox
		::1		arch-devbox
		127.0.1.1	arch-devbox.localdomain	arch-devbox

mkinitcpio -p linux

passwd

bootctl --path=/boot install
echo "default arch" > /boot/loader/loader.conf
echo "timeout 4" > /boot/loader/loader.conf
cp /usr/share/systemd/bootctl/arch.conf /boot/loader/entries/arch.conf
nano /boot/loader/entries/arch.conf  # replace the value for "" with output from `blkid` for the `/dev/nvme0n1p3`, remove the `fstype` and append `rw`

pacman -S gnome gnome-extra networkmanager networkmanager-openvpn xterm
systemctl enable gdm
systemctl enable NetworkManager

useradd -m -s /bin/bash alex
passwd alex
nano /etc/sudoers 
	alex ALL=(ALL) ALL #  Below this line `root ALL=(ALL) ALL`

exit
reboot


### yay
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
