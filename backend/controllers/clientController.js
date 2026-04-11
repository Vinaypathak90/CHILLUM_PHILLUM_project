const Client = require('../models/Client');
// ============================================================================
// @route   GET /api/clients
// @desc    Get all client logos (Public)
// ============================================================================
const getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: clients.length, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// ============================================================================
// @route   POST /api/clients
// @desc    Add a new client logo (Admin Only)
// ============================================================================
const addClient = async (req, res) => {
    try {
        const { name, logoUrl } = req.body;
        const client = await Client.create({ name, logoUrl });
        res.status(201).json({ success: true, data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add client' });
    }
};

// @route   DELETE /api/clients/:id
// @desc    Delete a client logo (Admin Only)
const deleteClient = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete client' });
    }
};

module.exports = { getClients, addClient, deleteClient };
