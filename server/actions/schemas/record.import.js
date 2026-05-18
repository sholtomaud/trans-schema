module.exports = {
    label: 'Import a Record',
    type: 'array',
    items: [
        {
            description: 'schema for a Record',
            type: 'object',
            required: ['data', 'schemaId', 'schemaVersion', 'targetSchemaId'],
            additionalProperties: false,
            properties: {
                data: {
                    type: 'object'
                },
                schemaId: {
                    type: 'string'
                },
                schemaVersion: {
                    type: 'number'
                },
                targetSchemaId:{
                    type: 'string'
                }
            }
        }
    ],
    minItems: 1,
    maxItems: 1
};
