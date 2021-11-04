# Ankerwache

## Build

Both need an [Expo](https://expo.dev/) account and the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).

### Expo-CLI

```
expo login

# -t [app-bundle|apk]
expo build:android -t apk --no-publish

wget https://<URL-from-build-logs>.apk
```

### Turtle

```
# use Java 8
update-java-alternatives --list
sudo update-java-alternatives --set /path/to/java/version8

# setup
turtle setup:android

# -t [app-bundle|apk]
# -m [release|debug]
turtle build:android -t apk -m debug -u <user> -p <password>
```

## Test on Device

For running a standalone build **myapp.apk** on Redmi Note 8 Pro.
See [android docs](https://developer.android.com/studio/run/device#device-developer-options) and [adb docs](https://developer.android.com/studio/command-line/adb).
Ubuntu prerequesites include _android-sdk-platform-tools-common_ and the `plugdev` group.

1. (mobile) Go to _Settings_ > _Developer Options_
1. (mobile) enable _Wireless debugging_
1. (mobile) under _Wireless debugging_ select _Pair device with QR Code_: note IP adress, port, code
1. (PC) `adb pair <ip-address>:<port>` then enter code when prompted
1. (mobile) under _Wireless debugging_ note IP adress and port
1. (PC) `adb connect <ip-adress>:<port>`
1. (PC) `adb devices -l` and note _transport_id_
1. (mobile) enable _Install via USB_
1. (PC) `adb -t <transport-id> install myapp.apk

After testing,
on the mobile go to _Wireless debugging_ and forget device,
then remove special permissions **Wireless debugging** and **Install via USB** again.
On the PC run `adb kill-server`.
