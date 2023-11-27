const mongoose = require('mongoose');

const url = "mongodb+srv://Manav:obljqo9qK9UAyxSw@cluster0.8bayxms.mongodb.net/?retryWrites=true";

const conn = async (req, res) =>{
    try {
        
        await mongoose.connect(url).then(()=>{
            console.log("DB Connected");
        });
    } catch (error) {
        res.status(400).json({message : "Not connected"})
    }
    
}
conn();