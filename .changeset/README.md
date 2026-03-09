# Changesets

When a PR changes code under `apps/**` or `packages/**`, add a changeset file before merge.

Commands:

```bash
pnpm changeset:add
pnpm version-packages
```

This repository currently uses Changesets to:

- require release notes in PRs
- prepare version update PRs on `main`

It does not publish packages automatically yet.
