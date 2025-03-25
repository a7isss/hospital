import express from 'express';
import {
    createVisitorSession,
    getVisitorSession,
    updateVisitorSession,
    deleteVisitorSession,
} from '../controllers/visitorController.js';

const visitorRouter = express.Router();

// Create a new visitor session (assign a unique ID to the visitor)
visitorRouter.post('/create', createVisitorSession);

// Get a visitor session by visitorId
visitorRouter.get('/:visitorId', getVisitorSession);

// Update a visitor session data (e.g., cart or preferences)
visitorRouter.put('/:visitorId', updateVisitorSession);

// Delete a visitor session by visitorId (logically remove or invalidate)
visitorRouter.delete('/:visitorId', deleteVisitorSession);

export default visitorRouter;