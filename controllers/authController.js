const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail  } = require('../utils/email.js');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check user
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            // Remove old unverified account
            await User.deleteOne({ _id: user._id });
            await OTP.deleteMany({
                email,
                action: "account_verification"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            isVerified: false
        });

        try {
            // Remove previous OTP
            await OTP.deleteMany({
                email,
                action: "account_verification"
            });

            // Generate OTP
            const otp = generateOTP();

            // Save OTP
            await OTP.create({
                email,
                otp,
                action: "account_verification"
            });

            // Send Email
            await sendOTPEmail(email, otp, "account_verification");

            return res.status(201).json({
                message: "OTP sent successfully.",
                email
            });

        } catch (emailError) {

            // Rollback if email sending fails
            await User.deleteOne({ _id: user._id });

            await OTP.deleteMany({
                email,
                action: "account_verification"
            });

            return res.status(500).json({
                message: "Failed to send OTP. Please try again."
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();
            await OTP.findOneAndDelete({ email: user.email, action: 'account_verification' });
            await OTP.create({ email: user.email, otp, action: 'account_verification' });
            await sendOTPEmail(user.email, otp, 'account_verification');
            return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validOTP = await OTP.findOne({ email, otp, action: 'account_verification' });

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        await OTP.deleteOne({ _id: validOTP._id }); // Delete OTP after usage

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.forgotPassword=async (req,res)=>{

    try {
            const {email}=req.body;

            if(!email){
                return res.status(400).json({
                    success:false,
                    message:"email is required"
                })
            }
            const user=await User.findOne({email})

            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found"
                })
            }

            //it will delete previous otp
            await OTP.deleteMany({
                email,
                action:"reset_password"
            })

// Generate otp
const otp=Math.floor(100000+Math.random()*900000).toString();

// save otp
await OTP.create({
    email,
    otp,
    action:"reset_password"
})

//sending email
            await sendOTPEmail(email, otp, "reset_password");

return res.status(200).json({
    success:true,
    message:"OTP sent successfully"
})
    } catch (error) {
     console.log(error)

         return res.status(500).json({
        success:false,
        message:"server error"
    })
    }
};



//reset password

exports.resetPassword=async (req,res) => {

    try {
        const {email,otp,newPassword}=req.body;
        
        if(!email||!otp||!newPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }


        //find OTP
        const otpRecord=await OTP.findOne({
            email,
            otp,
            action:"reset_password"
        });


        if(!otpRecord){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })

        }



        //hashing the password

        const hashedPassword=await bcrypt.hash(newPassword,10);


        //updating user password

        await User.findOneAndUpdate(
            {email},
            {password:hashedPassword}
        );


        //deleating OTP
        await OTP.deleteMany({
            email,
            action:"reset_password"
        })

        return res.status(200).json({
            success:true,
            message:"Password reset successfull"
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success:false,
            message:"server error"
        })
    }





};