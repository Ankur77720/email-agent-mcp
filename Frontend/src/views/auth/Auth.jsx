import React from 'react'
import './Auth.css'

const Auth = () => {

    const handleGoogleSignIn = () => {
        // Logic for Google Sign-In
        window.location.href = 'http://localhost:3000/api/auth/google';
    }

    return (
        <main className='auth-main' >
            <section className="auth-section">
                <button className="continue-with-google"
                    onClick={handleGoogleSignIn}
                >
                    Continue with Google
                </button>
            </section>
        </main>
    )
}

export default Auth