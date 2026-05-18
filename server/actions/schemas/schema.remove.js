module.exports = {
    label: 'Delete a Schema',
    type: 'array',
    items: [
        {
            description: 'schemaId',
            type: 'string'
        }
    ],
    minItems: 1,
    maxItems: 1
};
