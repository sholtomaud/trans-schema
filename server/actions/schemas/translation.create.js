module.exports = {
    label: 'Create a Translation',
    type: 'array',
    items: [
        {
            description: 'schema for a Translation',
            type: 'object',
            required: ['definition', 'sourceSchemaId', 'targetSchemaId'],
            additionalProperties: false,
            properties: {
                definition: {
                    type: 'object'
                },
                sourceSchemaId: {
                    type: 'string'
                },
                sourceSchemaVersion: {
                    type: 'number'
                },
                targetSchemaId: {
                    type: 'string'
                },
                targetSchemaVersion: {
                    type: 'number'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
