# This is a TypeScript Nativescript app

It has a drawer based menu working for page navigation.  

## Run

```
ns run
```

## Build - debug

```
ns build android
```

## Build - release

```
ns build android --release \
  --key-store-path <path-to-your-keystore> \
  --key-store-password <your-key-store-password> \
  --key-store-alias <your-alias-name> \
  --key-store-alias-password <your-alias-password>
```

[Creating a key store for signing APKs](https://developer.android.com/studio/publish/app-signing#generate-key)
(These intructions require you to have a regular APK project open in Android Studio)



