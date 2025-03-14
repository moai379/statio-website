const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const {createHmac, randomBytes} = require("crypto");
const {createTokenForUser} = require("../services/authentication");

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    salt: { type: String, select: false },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});


userSchema.static("matchPasswordGenerateToken", async function (email, password) {
    const user = await this.findOne({ email: email }).select("+salt");
    if (!user) throw new Error("User not found");

    const { salt, password: hashedPassword } = user;

    // Log the retrieved user data
    console.log("User found!");

    if (!salt) {
        console.error("Salt is undefined for user");
        throw new Error("Salt is undefined for this user");
    }

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");


    if (hashedPassword !== userProvidedHash) {
        console.error("Password mismatch: expected", hashedPassword, "but got", userProvidedHash);
        throw new Error("Invalid password");
    }

    const token = createTokenForUser(user); // Generate a token
    console.log("Authentication successful, token created");
    return token;
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;