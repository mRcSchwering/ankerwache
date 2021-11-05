# Ankerwache

## Develop

```
yarn start
```

## Build

Both need an [Expo](https://expo.dev/) account and the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).
I also need the [Android SDK Tools](https://guides.codepath.com/android/installing-android-sdk-tools) for `adb`.
I did it the manual way. Didn't work exactly as described:

- extracted it to `~/android-sdk/cmdline-tools/latest/`
- had to move `bin/` and `lib/` under `latest/` (from the sdk root they need to be under `cmdline-tools/latest/`)
- then after running the 3 described commands there are various directories under `~/android-sdk/`
- had to update my `~/.bashrc` like below to make `adb --verion` work

```
export ANDROID_SDK_ROOT=/home/marc/android-sdk/
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
```

### Expo-CLI

See [Expo CLI build docs](https://docs.expo.dev/classic/building-standalone-apps/).

```
expo login

# -t [app-bundle|apk]
expo build:android -t apk

wget https://<URL-from-build-logs>.apk
```

I auto-generated the key store and fetched it (`expo fetch:android:keystore`) later.

### Turtle

See [Turtle CLI build docs](https://docs.expo.dev/classic/turtle-cli/#turtle-cli).

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
