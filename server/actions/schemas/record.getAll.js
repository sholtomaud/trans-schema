module.exports = {
    label: 'Get all Records',
    type: 'array',
    items: [
        {
            description: 'query',
            type: 'object'
        },
        {
            description: 'skip',
            type: 'string'
        },
        {
            description: 'limit',
            type: 'string'
        }
    ],
    minItems: 0,
    maxItems: 3
};
