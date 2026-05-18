module.exports = {
    label: 'Update a view',
    type: 'array',
    items: [
        {
            description: 'viewId',
            type: 'string'
        },
        {
            description: 'view for a view',
            type: 'object',
            properties: {}
        }
    ],
    minItems: 2,
    maxItems: 2
};
