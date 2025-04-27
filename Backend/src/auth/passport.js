import passport from "passport";
import { Strategy } from "passport-google-oauth20"
import config from "../config/config.js";
import userModel from "../models/user.model.js";



passport.use(new Strategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI,
    passReqToCallback: true,
    accessType: "offline",
    prompt: 'consent',
}, async (req, accessToken, refreshToken, profile, done) => {
    // Here you can save the user profile to your database
    console.log("Access Token: ", accessToken);
    console.log("Refresh Token: ", refreshToken);


    const user = await userModel.findOne({ email: profile.emails[ 0 ].value });

    if (user) {
        // User already exists, update the refresh token
        user.googleRefreshToken = refreshToken;
        await user.save();
        return done(null, user);
    }

    // If user does not exist, create a new user
    const newUser = new userModel({
        name: profile.displayName,
        email: profile.emails[ 0 ].value,
        googleRefreshToken: refreshToken
    });

    await newUser.save();


    // For now, we will just return the profile
    return done(null, profile);
}))


passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
})


export default passport;