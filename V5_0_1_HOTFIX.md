# Poco a Poco v5.0.1 Hotfix

Fixes the JSX syntax error in the v5 Journey component that caused:

`src/App.jsx:27:0: ERROR: Unexpected "}"`

No progress data is reset.

Run `APPLY_V5_AND_PUBLISH.command` from this hotfix folder. The script will
copy the corrected files into the existing `poco-a-poco-github` repository,
install dependencies, run `npm run build`, and only push if the build succeeds.

The npm audit warnings shown during install were not the cause of the build
failure. Do not run `npm audit fix --force` as part of this hotfix.
