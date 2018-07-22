#!/bin/sh

read -p "HELLO" yn













# Gnome Shell Extensions
yaourt gnome-shell-extension-arch-update
yaourt gnome-shell-extension-audio-output-switcher-git
yaourt gnome-shell-extension-dash-to-dock
yaourt gnome-shell-extension-pixel-saver
yaourt gnome-shell-extension-screenshot-git
yaourt gnome-shell-extension-topicons-plus

# Fonts
yaourt ttf-google-fonts-git
yaourt ttf-envy-code-r
yaourt ttf-vista-fonts
yaourt ttf-hack
yaourt ttf-dejavu
yaourt ttf-liberation
yaourt ttf-mononoki
yaourt ttf-monaco
yaourt ttf-ubuntu-font-family

# Default Apps
# The pivot is in `/usr/share/applications/mimeinfo.cache`
echo "inode/directory=org.gnome.Nautilus.desktop" >> ~/.local/share/applications/mimeapps.list


# Additional Config
/org/gnome/mutter/, and check 'center-new-windows'










# YAY
sudo pacman -S git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Apps
yay --save --nodiffmenu --noeditmenu --nocleanmenu --answerclean All
yay -S google-chrome
yay -S tilix
yay -S zoom
yay -S powertop
yay -S visual-studio-code-bin
yay -S virtualbox virtualbox-host-modules-arch virtualbox-ext-oracle

# Use fastest mirrors
yay reflector
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
sudo reflector --verbose --country 'United States' -l 10 --sort rate --save /etc/pacman.d/mirrorlist


# Desktop Env
gsettings set org.gnome.desktop.peripherals.keyboard delay 300
gsettings set org.gnome.mutter center-new-windows true
echo 'DefaultLimitNOFILE=65536' | sudo tee --append /etc/systemd/system.conf DefaultLimitNOFILE=65536
yay -S flat-remix-gtk-git
yay -S papirus-icon-theme-git
gsettings set org.gnome.desktop.interface gtk-theme 'Flat-Remix-GTK'
gsettings set org.gnome.desktop.interface icon-theme 'Papirus'
gsettings set org.gnome.desktop.interface show-battery-percentage true

sudo pacman -S bluez  bluez-utils
sudo systemctl enable bluetooth
sudo systemctl start bluetooth


# Config Tilix
nano ~/.bashrc # and add what is below
if [ $TILIX_ID ] || [ $VTE_VERSION ]; then
        source /etc/profile.d/vte.sh
fi


# Dev Box
yaourt p4v

git config --global diff.tool p4merge
git config --global merge.tool p4merge
git config --global --add difftool.prompt false


# Printers
sudo pacman -S avahi cups cups-pdf system-config-printer
sudo systemctl enable avahi-daemon.service
sudo systemctl start avahi-daemon.service
sudo systemctl enable org.cups.cupsd.service
sudo systemctl start org.cups.cupsd.service

# Printer Drivers
# yay -S epson-inkjet-printer-escpr


# Terminal Config
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

PS1="\[\033[1;49;92m\]\w\[\033[33m\]\$(parse_git_branch)\[\033[00m\] | \[\033[37m\]$(date "+%A %d %l:%M%P")\[\033[00m\] | \[\033[94m\]\u@\h \[\033[00m\]\n--> "

