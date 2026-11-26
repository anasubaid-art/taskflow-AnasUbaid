import "../styles/login.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../features/auth/authSlice";

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector(
        (state) => state.auth
    );
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            return;
        }
        try {
            await dispatch(
                loginUser({ email, password })
            ).unwrap();

            navigate("/projects");
        } catch (err) {
            console.log("Login failed:", err);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">TF</div>
                <h1>Welcome to TaskFlow</h1>
                <p>Sign in to manage your projects and tasks.</p>
                <form onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                    {error && (
                        <p className="login-error">{error}</p>
                    )}
                    {user && (
                        <p className="login-error">You are already logged in.</p>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;