import React, { useState } from "react";
import API from "../../api/api";
export default function SignupPage({ onAuth, onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be 6+ characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      onAuth(res.data.user);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-up">
        <div className="auth-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> 
          LEARNOS
        </div>
        <div className="auth-subtitle">
          Join thousands of learners & instructors.
        </div>

        {errors.general && (
          <div className="form-error" style={{ marginBottom: 16, textAlign: "center", padding: "10px", background: "rgba(255, 60, 60, 0.1)", borderRadius: "8px" }}>
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input ${errors.email ? "error" : ""}`}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className={`form-input ${errors.password ? "error" : ""}`}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">I am a...</label>
          <div className="role-selector">
            {[
              { val: "student", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, label: "Student" },
              { val: "instructor", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>, label: "Instructor" },
            ].map((r) => (
              <div
                key={r.val}
                className={`role-option ${form.role === r.val ? "selected" : ""}`}
                onClick={() => setForm({ ...form, role: r.val })}
              >
                <div className="role-option-icon">{r.icon}</div>
                <div className="role-option-label">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          style={{ marginTop: 8, justifyContent: "center" }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        <div className="divider">or</div>

        <div
          style={{ textAlign: "center", fontSize: 14, color: "var(--text2)" }}
        >
          Already have an account?{" "}
          <span className="auth-link" onClick={onSwitch}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}
