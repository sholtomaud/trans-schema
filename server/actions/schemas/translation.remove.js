module.exports = {
    label: 'Delete a Translation',
    type: 'array',
    items: [
        {
            description: 'translationId',
            type: 'string'
        }
    ],
    minItems: 1,
    maxItems: 1
};
