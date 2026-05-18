module.exports = {
    label: 'Delete a Record',
    type: 'array',
    items: [
        {
            description: 'recordId',
            type: 'string'
        }
    ],
    minItems: 1,
    maxItems: 1
};
