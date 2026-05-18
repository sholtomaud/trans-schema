module.exports = {
    label: 'Update a Record',
    type: 'array',
    items: [
        {
            description: 'recordId',
            type: 'string'
        },
        {
            description: 'schema for a Record',
            type: 'object',
            required: ['data', 'schemaId'],
            additionalProperties: false,
            properties: {
                data: {
                    type: 'object'
                },
                schemaId: {
                    type: 'string'
                }
            }
        }
    ],
    minItems: 2,
    maxItems: 2
};
