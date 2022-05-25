import Order from "../../model/Orders.js";
import Users from "../../model/Users.js";

export const getOrder = async (req, res) => {
    try {
        const requiredOrder = await Order.findOne({ "order_id": req.params.id });

        if(!requiredOrder){
            return res.status(404).json({ message: "Order does not exist" });
         }

        res.status(200).json(requiredOrder);

    } catch (error) {
        res.status(404).json({ message: error.message });
        
    }
}

export const updateOrder = async (req, res) => {
    try {

        const orderStatus = req.body.status;
        const id = req.body.id;

        const user = await Users.findById(id, { password: 0 });

        if(!user){
            return res.status(404).json({ message: "User does not exist "});
        }

        if(!user.role == "ADMIN"){
            res.status(401).json({ message: "Unauthorized user" })
        }
        

        if(!['CREATED', 'PROCESSING', 'FULFILLED', 'CANCELLED'].includes(orderStatus)){
            return res.status(400).json({ message: "Invalid status, has to be CREATED, PROCESSING, FULFILLED, CANCELLED" });
        }

        const updatedOrder = await Order.findOneAndUpdate({ "order_id": req.params.id } , {
            order: orderStatus,
        });

        if(!updatedOrder){
           return res.status(404).json({ message: "Order does not exist" });
        }

        res.status(200).json(updatedOrder);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}