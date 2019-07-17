// TODO replace once https://github.com/blueflag/blueflag-devops/pull/33 is merged and released
module.exports = {
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 72],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'fix',
                'add',
                'break',
                'amend',
                'refactor',
                'test',
                'docs',
                'build',
                'wip'
            ]
        ]
    }
};
