module.exports = {
    label: 'Create a view',
    type: 'array',
    items: [
        {
            description: 'view for a view',
            type: 'object',
            required: ['definition'],
            additionalProperties: false,
            properties: {
                definition: {
                    type: 'object'
                },
                schemaId: {
                    type: 'string'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
