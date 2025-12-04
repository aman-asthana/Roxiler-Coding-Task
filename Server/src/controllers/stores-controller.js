const client = require("../database/connection")




    const getStores = async (req, res) =>{
        try {
            res.json({message: "Store list comming"})
        } catch (error) {
            res.status(500).json({ message: "Error fetching stores", error: error.message })
        }
    }
    const addStore = async (req, res) => {
        try {
            const{name, email, address, owner_id} = req.body;

            if (!name || !email || !address) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const exist = await client.query(
                'SELECT * FROM stores WHERE email = $1',
                [email]
            )
            
            if (exist.rows.length > 0) {
                return res.status(400).json({ message: "Store already exists with this email" });
            }

            if (owner_id) {
                const owner = await client.query(
                    "SELECT * FROM users WHERE id = $1 AND role = 'OWNER'",
                    [owner_id]
                );

                if (owner.rows.length === 0) {
                    return res.status(400).json({ message: "Invalid owner ID" });
                }
            }
        
            await client.query(
                "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)",
                [name, email, address, owner_id || null]
            );

            res.json({ message: "Store added successfully" });

        } catch (error) {
            res.status(500).json({ message: "Error adding store", error: error.message });
        }
    }

    module.exports = {getStores, addStore}
