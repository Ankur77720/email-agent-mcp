import { Router } from "express";
import passport from "../auth/passport.js";


const router = Router();




router.get('/google', passport.authenticate('google', {
    scope: [ 'profile', 'email', "https://mail.google.com/", "https://www.googleapis.com/auth/calendar" ],
    accessType: 'offline',
    prompt: 'consent',
    session: false,
}));


router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
}), (req, res) => {
    res.send('Login successful! You can close this window.');
});

export default router;