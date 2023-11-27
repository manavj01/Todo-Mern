const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const list = require("../models/list");


// Create todo
router.post("/addTask", async (req, res) => {
    try {
        const { title, body, email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const list = new List({ title, body, user: existingUser });
            await list
                .save()
                .then(
                    () => res.status(200).json({ list })
                );
            existingUser.list.push(list);
            existingUser.save();
        }
    } catch (error) {
        console.log(error);
    }
});

// Update Todo

router.put("/updateTask/:id", async (req, res) => {
    try {
        const { title, body, email } = req.body;
        const existingUser = await User.findOne({ email });

        // If the user does not exist, respond with a not found message
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the task directly using List.findByIdAndUpdate
        const updatedTask = await List.findByIdAndUpdate(req.params.id, { title, body }, { new: true });

        // If the task was not found, respond with a not found message
        if (!updatedTask) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // If the task was found and updated, respond with a success message
        res.status(200).json({ message: "Todo Updated" });
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// delete Todo

router.delete("/deleteTask/:id", async (req, res) => {
    try {
        const { email } = req.body;

        const existingTodo = await List.findById(req.params.id);

        if (!existingTodo) {
            // If the todo does not exist, return a response indicating that it was not found
            return res.status(404).json({ message: "Todo not found" });
        }

        const existingUser = await User.findOneAndUpdate(
            { email },
            { $pull: { list: req.params.id } }
        );

        if (existingUser) {
            // Delete the task document
            await List.findByIdAndDelete(req.params.id);

            // Send a response indicating success
            res.status(200).json({ message: "Todo Deleted" });
        } else {
            // If the user doesn't exist or the task ID is not in the 'list' array
            res.status(404).json({ message: "User or Todo not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

// get Todo

router.get("/getTasks/:id", async (req, res) => {
    const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
    if (list.length !== 0) {
        res.status(200).json({ list });
    } else {
        res.status(200).json({ "message": "No Todo Available" });
    }

})

module.exports = router;