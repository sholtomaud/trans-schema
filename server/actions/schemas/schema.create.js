module.exports = {
    label: 'Create a Schema',
    type: 'array',
    items: [
        {
            description: 'schema for a Schema',
            type: 'object',
            required: ['definition'],
            additionalProperties: false,
            properties: {
                definition: {
                    type: 'object'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
