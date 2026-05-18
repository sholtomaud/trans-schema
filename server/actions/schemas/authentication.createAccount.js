module.exports = {
    label: 'Account',
    type: 'array',
    items: [
        {
            description: 'schema for an account',
            type: 'object',
            required: ['userName', 'password', 'companyId', 'userAccessLevel','email'],
            additionalProperties: false,
            properties: {
                userName: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                },
                companyId: {
                    type: 'string'
                },
                userAccessLevel: {
                    type: 'number',
                    minimum: 0,
                    maximum: 3
                },
                email: {
                    type: 'string',
                    format: 'email'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
