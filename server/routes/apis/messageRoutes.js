const express = require('express');
const router = express.Router();
const Users = require('../../models/User');
const Chats = require('../../models/Chat');
const Messages = require('../../models/Message');

router.post('/message', async (req, res) => {
    try {
        console.log(req.body);
        const { chatId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields')
        if (chatId === 'new' && receiverId) {
            const newChat = new Chats({ members: [senderId, receiverId] });
            await newChat.save();
            const newMessage = new Messages({ chatId: newChat._id, senderId, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully');
        } else if (!chatId && !receiverId) {
            return res.status(400).send('Please fill all required fields')
        }
        const newMessage = new Messages({ chatId, senderId, message });
        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        console.log(error, 'Error')
    }
})

// router.get('/message/:chatId', async (req, res) => {
//     try {
//         const checkMessages = async (chatId) => {
//             console.log(chatId, 'chatId')
//             const messages = await Messages.find({ chatId });
//             const messageUserData = Promise.all(messages.map(async (message) => {
//                 const user = await Users.findById(message.senderId);
//                 return { user: { id: user._id, email: user.email, username: user.username }, message: message.message }
//             }));
//             res.status(200).json(await messageUserData);
//         }
//         const chatId = req.params.chatId;
//         if (chatId === 'new') {
//             const checkChat = await Chats.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
//             if (checkChat.length > 0) {
//                 checkMessages(checkChat[0]._id);
//             } else {
//                 return res.status(200).json([])
//             }
//         } else {
//             checkMessages(chatId);
//         }
//     } catch (error) {
//         console.log('Error', error)
//     }
// })

router.get('/message/:chatId', async (req, res) => {
    try {
        console.log(req.params);
        const messages = await Messages.find({ chatId: req.params.chatId })
        res.status(200).json(messages);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;