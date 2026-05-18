module.exports = {
    label: 'Login',
    type: 'array',
    items: [
        {
            description: 'schema for a login',
            type: 'object',
            required: ['userName', 'password'],
            additionalProperties: false,
            properties: {
                userName: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
