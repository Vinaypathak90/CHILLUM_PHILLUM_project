const Message = require('../models/Message');
// ============================================================================
// @desc    Send a new message (Contact Form)
// @route   POST /api/messages
// @access  Public
// ============================================================================
const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // Basic validation (backend double-check)
    const newMessage = await Message.create({ name, email, phone, subject, message });  
    
    res.status(201).json({
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
        data: newMessage
    });
    } catch (error) {
        console.error('Error saving message:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message. Please try again later.'
        });
    }
};
// ============================================================================
// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin Only)
// ============================================================================
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json({  
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching messages. Please try again later.'
        });
    }
};
// ============================================================================
// 🔥 NAYA: Update Message Status (Unread -> Read)
// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private (Admin Only)
// ============================================================================
const updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedMessage = await Message.findByIdAndUpdate(
            req.params.id, 
            { status: status },
            { new: true } // Return updated document
        );

        if (!updatedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            data: updatedMessage
        });
    } catch (error) {
        console.error('Error updating message:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the message.'
        });
    }
};
// ============================================================================
// 🔥 NAYA: Delete a message
// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin Only)
// ============================================================================
const deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);

        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the message.'
        });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    updateMessageStatus, // Naya export kiya
    deleteMessage        // Naya export kiya
};