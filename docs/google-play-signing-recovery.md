# Google Play signing recovery

## Current Android release identity

- Google Play app package: `com.dazzzle.mobile`
- EAS project: `@dazzzle/dazzzle-react-native`
- EAS project ID: `c3498daf-a4a4-4eff-9672-bcc669e3eb2d`
- EAS production credentials source: `remote`
- EAS production Android artifact: AAB (`app-bundle`)

## Active EAS upload certificate

The default EAS Android keystore for `com.dazzzle.mobile` has this upload certificate:

- SHA-1: `AB:18:A6:F1:7B:0D:B6:26:3E:3F:42:FE:26:CB:41:A2:3D:28:4B:C6`
- SHA-256: `67:0A:00:11:84:D7:BC:BC:E7:BD:95:0A:0D:92:FC:73:8A:40:AA:CB:B0:8F:49:7B:6D:DE:78:AB:93:BC:00:AF`

Use the SHA-256 value above when comparing against Play Console's **Setup > App integrity > Upload key certificate** section.

## Play Console handling

If the Play Console app entry is for any package other than `com.dazzzle.mobile`, do not use that entry for this release. Create or select the Play app entry whose package name is exactly `com.dazzzle.mobile`.

If Play Console expects a different upload certificate for `com.dazzzle.mobile`, request an upload-key reset in Play Console and use this EAS keystore as the key going forward.

If Play Console has not accepted a first release for `com.dazzzle.mobile` yet, upload a fresh production AAB built after the current EAS credential setup.

## Build command

```sh
eas build -p android --profile production --clear-cache
```

After the build completes, upload the AAB to an internal testing track first and confirm Play accepts the signing certificate.
