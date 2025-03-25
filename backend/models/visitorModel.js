import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
    visitorId: {
        type: String,
        required: true,
        unique: true,
    },
    sessionData: {
        type: Object,
        default: {}, // Store any custom session data here (e.g., cart, preferences)
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const VisitorModel = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
export default VisitorModel;