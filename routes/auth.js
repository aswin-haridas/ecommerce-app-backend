import CryptoJS from 'crypto-js';
import User from '../models/User'

app.post('/register', async (req, res) => {
    try {
        const ciphertext = CryptoJS.AES.encrypt(req.body.password.toString(), process.env.SECRET_KEY).toString();
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: ciphertext,
        });
        await newUser.save();
        res.status(200).json('success');
    } catch (err) {
        res.status(500).json('error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
            if (originalPassword === req.body.password.toString()) {
                res.json({ Status: 'success' });
            } else {
                res.json({ Status: 'Invalid password' });
            }
        } else {
            res.json({ Status: 'Email not existing' });
        }
    } catch (err) {
        res.json({ Error: 'Error' });
    }
});

