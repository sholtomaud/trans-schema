module.exports = {
    label: 'Delete a view',
    type: 'array',
    items: [
        {
            description: 'viewId',
            type: 'string'
        }
    ],
    minItems: 1,
    maxItems: 1
};
