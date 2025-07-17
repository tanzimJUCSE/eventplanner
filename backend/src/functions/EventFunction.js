const { app } = require('@azure/functions');

// In-memory store for events. In a production scenario you might persist these in a database.
let events = [];

app.http('EventFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        if (request.method === 'POST') {
            try {
                const body = await request.json();
                const { name, date, location } = body || {};

                if (!name || !date || !location) {
                    return {
                        status: 400,
                        body: 'Required fields: name, date, location.'
                    };
                }

                const newEvent = {
                    id: Date.now(),
                    name,
                    date,
                    location
                };

                events.push(newEvent);

                return {
                    status: 201,
                    jsonBody: newEvent
                };
            } catch (err) {
                context.error('Error parsing request body', err);
                return {
                    status: 400,
                    body: 'Invalid JSON payload.'
                };
            }
        }

        // Default to GET – return list of events
        return {
            status: 200,
            jsonBody: events
        };
    }
});
// all good