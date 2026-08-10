# Poco a Poco v10.0.1 Hotfix

Fixes the blank **People / Personas** page.

Cause:
`PERSONAS` and `PERSONA_SCENES` were exported by `src/data/living.js` but were
not imported into `src/App.jsx`. The route therefore threw a browser runtime
ReferenceError only when the People tab was opened.

No learner progress is reset.
