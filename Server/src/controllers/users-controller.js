const client = require('../database/connection');
const bcrypt = require('bcrypt');

const updatePassword = async (req, res)=>{
    try {
        const userId = req.user.id
        const { oldPassword, newPassword } = req.body

        const userData = await client.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        )

        if (userData.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' })
        }


        const user = userData.rows[0]

        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            return res.status(400).json({ message: 'Incorrect old password' })
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await client.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashed, userId]
        );

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Update Password error', error: error.message });
    }
}

module.exports = {updatePassword}
