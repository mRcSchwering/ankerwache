# Ankerwache

Anchor watch app. Set an anchor somewhere, define a radius, and let it wake you up if your boat drifts away at night.
This app is similar to [AnkerAlarm](https://ankeralarm.app/en/) but I will not add many features and instead focus on reliability.
Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## Develop

See [React Native docs](https://reactnative.dev/docs/components-and-apis) and [Expo docs](https://docs.expo.dev/)
for APIs and components.

```
yarn start
```

## Build

Needs an [Expo](https://expo.dev/) account and the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).
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

### Standalone App with Expo-CLI

Creates an _.apk_ for testing on an Android device.
See [Expo CLI build docs](https://docs.expo.dev/classic/building-standalone-apps/).

```
expo login

# -t [app-bundle|apk]
expo build:android -t apk

wget https://<URL-from-build-logs>.apk
```

I auto-generated the key store and fetched it (`expo fetch:android:keystore`) afterwards as backup.

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
1. (PC) `adb -t <transport-id> install myapp.apk`

After testing,
on the mobile go to _Wireless debugging_ and forget device,
then remove special permissions **Wireless debugging** and **Install via USB** again.
On the PC run `adb disconnect && adb kill-server`.

## Google Play Store

This is a tool to help you sleep better while at anchor. Set your anchor position, define a radius, and start the anchor watch. If your phone is persistently outside the defined radius it will start to ring loudly.

In contrast to other anchor apps this one comes without any other feature and without ads. It also doesn't need internet connection. The only focus here is having a reliable anchor watch.

No false alarms - Your phone's GPS is not always as accurate as you think. You will see your current accuracy and can take it into consideration when setting the radius. Additionally, the app doesn't ring on the first "bad" reading. The phone's GPS position can jump back and forth quite a lot. There is a counter. Only if there are multiple "bad" readings in a row the phone will ring.

Reliability - This is partly out of my hand. Many android devices suspend apps after several minutes of inactivity. This website explains these problems for different manufacturers: dontkillmyapp.com. Notably, you need to make sure that the "battery saver" does not suspend my app after some minutes of inactivity. Apart from that, my app will show a notification icon as long as the anchor watch is active.

Data - This app does not download anything and does not send anything. It only requests GPS position every 5s and compares it. Nothing is saved.
