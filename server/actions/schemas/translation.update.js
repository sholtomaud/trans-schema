module.exports = {
    label: 'Update a Translation',
    type: 'array',
    items: [
        {
            description: 'translationId',
            type: 'string'
        },
        {
            description: 'schema for a Translation',
            type: 'object',
            properties: {}
        }
    ],
    minItems: 2,
    maxItems: 2
};
