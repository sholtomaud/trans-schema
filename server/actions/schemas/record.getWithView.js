module.exports = {
    label: 'Get a Record',
    type: 'array',
    items: [
        {
            description: 'recordId',
            type: 'string'
        },
        {
            description: 'viewId',
            type: 'string'
        }
    ],
    minItems: 2,
    maxItems: 2
};
