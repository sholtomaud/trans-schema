module.exports = {
    label: 'Update a Schema',
    type: 'array',
    items: [
        {
            description: 'schemaId',
            type: 'string'
        },
        {
            description: 'schema for a Schema',
            type: 'object',
            properties: {}
        }
    ],
    minItems: 2,
    maxItems: 2
};
