# Contributing

Thanks for contributing! :smile:

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

> Note: Contributions should be made via pull requests to the dev branch of the repository.

## Table of Contents

- [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
- [Guidelines](#guidelines)
  - [Styleguides](#styleguides)
    - [Commit Messages](#commit-messages)
    - [Issues](#issues)
    - [Code Styleguide](#code-styleguide)
    - [Pull Requests](#pull-requests)
  - [What should I know before I get started](#what-should-i-know-before-i-get-started)
  - [How Can I Contribute](#how-can-i-contribute)

# Guidelines

The following are the guidelines we request you to follow in order to contribute to this project.

## Styleguides

### Commit Messages

This project follows the [Conventional Commits][conventional] and [`@commitlint/conventional-commit`][commitlint-conventional] convention. All git commits get linted using [`@commitlint/cli`][commitlintcli]. Along with that, commit titles should be in the imperative present tense form.

- ```txt
  fix(parser): fix a bug with command the command parser (#2)
  ```

- ```txt
  refactor(api): update "config prefix" command usage

  BREAKING CHANGE: New prefix should be enclosed in double or single quotes

  See #4
  See #10
  ```

Examples of invalid commit messages:

- ```txt
  remove some stuff
  ```

- ```txt
  fix a bug

  some stuff wasnt working so i fixed it
  ```

### Issues

Issues should use the GitHub issue templates if available, and otherwise use this format:

```bash
update: Description # if an update is required for a feature
bug: Description # if there is a bug in a particular feature
suggestion: Description # if you want to suggest a better way to implement a feature
```

### Code Styleguide

The code should satisfy the following:

- Have meaningful variable names, in `camelCase` format.
- Have no issues when running `yarn run lint`.
- Have meaningful file names, directory names and directory structure.
- Have a scope for easy fixing, refactoring and scaling.

### Pull Requests

Pull requests should have:

- A concise commit message.
- A description of what was changed/added.

## What should I know before I get started

You can contribute to any of the features you want, here's what you need to know:

The project uses MongoDB for the database. Knowledge with MongoDB is not required, but it
can be helpful if you are working on something that uses the database.

Most docs are written using JSDoc for functions, although some may also be written in
the GitHub wiki.

## How Can I Contribute

You can contribute by:

- Reporting Bugs
- Suggesting Enhancements
- Code Contribution
- Pull Requests

Make sure to document the contributions well in the pull request.

> It is not compulsory to follow the guidelines mentioned above, but it is strongly recommended
> as your contribution may not be accepted otherwise.

[commit-message-guidelines]: https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices#write-good-commit-messages
[commitlint-conventional]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[commitlintcli]: https://commitlint.js.org/
