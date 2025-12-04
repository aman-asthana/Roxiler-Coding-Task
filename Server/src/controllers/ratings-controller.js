const client = require('../database/connection');

const addRating = async (req, res) => {
    try {
        const userId = req.user.id
        const storeId = req.params.storeId
        const { rating_value } = req.body

        if (!rating_value || rating_value < 1 || rating_value > 5) {
            return res.status(400).json({ message: "Rating must be between 1 to 5" })
        }

        const store = await client.query(
            "SELECT * FROM stores WHERE id = $1",
            [storeId]
        );
        if (store.rows.length === 0) {
            return res.status(404).json({ message: "Store not found" })
        }



        const exist = await client.query(
            "SELECT * FROM ratings WHERE store_id = $1 AND user_id = $2",
            [storeId, userId]
        )
        if (exist.rows.length > 0) {
            return res.status(400).json({ message: "You already rated this store" })
        }


        await client.query(
            "INSERT INTO ratings (store_id, user_id, rating_value) VALUES ($1, $2, $3)",
            [storeId, userId, rating_value]
        );

        res.json({ message: "Rating submitted successfully" })

    } catch (error) {
        res.status(500).json({ message: "Rating submit error", error: error.message })
    }
}

const updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.storeId;
        const { rating_value } = req.body;

        if (!rating_value || rating_value < 1 || rating_value > 5) {
            return res.status(400).json({ message: "Rating must be 1–5" })
        }

        const exist = await client.query(
            "SELECT * FROM ratings WHERE store_id = $1 AND user_id = $2",
            [storeId, userId]
        );

        if (exist.rows.length === 0) {
            return res.status(400).json({ message: "No previous rating found" })
        }

        await client.query(
            "UPDATE ratings SET rating_value = $1, updated_at = NOW() WHERE store_id = $2 AND user_id = $3",
            [rating_value, storeId, userId]
        )

        res.json({ message: "Rating updated successfully" })

    } catch (error) {
        res.status(500).json({ message: "Rating update error", error: error.message })
    }
}

module.exports = { addRating, updateRating };

