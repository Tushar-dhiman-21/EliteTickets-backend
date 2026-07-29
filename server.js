const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

const app = express();



// Database Connection
// mongoose.connect(process.env.MONGO_URL )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB Connection Error:', err));

// const PORT = process.env.PORT || 6900;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//database connection
let isConnected=false;

async function connectToMongoDB(){
  try{
    await mongoose.connect(process.env.MONGO_URL,{
      useNewUrlParser:true,
      useUnifiedTopology:true
    } );
    isConnected=true;
    console.log("MongoDB Connected")

  }catch(error){

    console.log("Error connecting to MongoDB",error)
  }
}





// Middleware

app.use((req,res,next)=>{
  if(!isConnected){
    connectToMongoDB();
  }
  next();
})


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;