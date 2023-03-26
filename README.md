# Ankerwache

Anchor watch app. Set an anchor somewhere, define a radius, and let it wake you up if your boat drifts away at night.
This app is similar to [AnkerAlarm](https://ankeralarm.app/en/) but I will not add many features and instead focus on reliability.
Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

I did some simulations regarding false alarm rates, the likely time for an alarm to be raised, and likely distance a boat has drifted after an alarm was raised.
See [specificity_sensitivity.py](./specificity_sensitivity.py).

## Privacy Policy

No data is collected or send anywhere. Period

## Description

This is a tool to help you sleep better while at anchor. Set your anchor position, define a radius, and start the anchor watch. If your phone is persistently outside the defined radius it will start to ring loudly.

In contrast to other anchor apps this one comes without any other feature and without ads. It also doesn't need internet connection. The only focus here is having a reliable anchor watch.

**No false alarms** Your phone's GPS is not always as accurate as you think. When you set the alarm radius you will see the GPS error.
Use the length of your chain/rode plus twice the error to avoid false alarms.
To further reduce the chances of false alarms I implemented a counter which will count up on out-of-bounds readings.
Only with multiple consecutive out-of-bounds readings the alarm will start.

**Reliability** The active anchor watch shows a notification on your screen. However, many android devices suspend apps after several minutes of inactivity. This website explains these problems for different manufacturers: dontkillmyapp.com. Notably, you need to make sure that the _Battery Saver_ does not suspend this app after some minutes of inactivity. Apart from that, the app will show a notification as long as its anchor watch is active.

**Privacy** This app does not download anything and does not send anything. It only requests the geolocation every 5s and compares it. Nothing is saved.

**Donate** All my apps are free, I never use ads, or sell data to third parties. If you want to support me somehow, you can donate with this link on [buymeacoffee.com](https://www.buymeacoffee.com/mRcSchwering). Thanks in advance.

---

[![buymeacoffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg)](https://www.buymeacoffee.com/mRcSchwering)

---

|                                               home                                                |                                          set anchor                                           |                                             set radius                                              |
| :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![](https://raw.githubusercontent.com/mRcSchwering/ankerwache/main/img/screenshot_light_main.jpg) | ![](https://raw.githubusercontent.com/mRcSchwering/ankerwache/main/img/screenshot_anchor.jpg) | ![](https://raw.githubusercontent.com/mRcSchwering/ankerwache/main/img/screenshot_light_radius.jpg) |

## Develop

See [React Native docs](https://reactnative.dev/docs/components-and-apis) and [Expo docs](https://docs.expo.dev/)
for APIs and components.

```
npm install
npm start
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

At some point I needed a key store to sign this project.
I auto-generated it and fetched it (`expo fetch:android:keystore`) afterwards as backup.

### Standalone apk with Expo-CLI

I have configured the [eas.json](./eas.json) to _.apk_.
I can build it iwth [EAS](https://docs.expo.dev/build/setup/).

```
eas login

eas build --platform android --profile preview
```

Download _.apk_ from output URL.
See below for testing on device.

### Playstore aab with Expo-CLI

Creates an _.aab_ for upload to Google Playstore.
Make sure to increment `"version":` and `"versionCode":` in [app.json](./app.json) before building.
The playstore only understands _versionCode_ to identify an update.

```
eas login

eas build --platform android --profile production
```

## Test on Device

> I needed [this answer](https://android.stackexchange.com/a/229242) to enable "install via USB" without needing to create a Mi account

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
