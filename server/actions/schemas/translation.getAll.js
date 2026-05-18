module.exports = {
    label: 'Get all Translations',
    type: 'array',
    items: [
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
    maxItems: 2
};
