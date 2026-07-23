import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { formatApiError } from "../lib/api";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Welcome back");
      nav("/admin");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex items-end p-12 bg-[#2C303A] text-[#FDFBF7] relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20" />
        <div className="relative">
          <p className="uppercase tracking-[0.3em] text-xs text-[#C5A059] mb-6">Resonate.Dubai LLC</p>
          <h1 className="font-serif-display text-5xl leading-[1.05] mb-4">
            Admin <span className="italic text-[#C5A059]">Console</span>
          </h1>
          <p className="max-w-sm text-sm text-white/70">
            Manage counselling submissions, publish success stories, and upload dynamic updates.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6" data-testid="admin-login-form">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059]">Sign in</p>
            <h2 className="font-serif-display text-4xl mt-2">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-2">Use your administrator credentials.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="admin-email-input"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="admin-password-input"
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none h-11"
            data-testid="admin-login-submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <a href="/" className="block text-xs text-center text-muted-foreground hover:text-foreground">
            ← Back to website
          </a>
        </form>
      </div>
    </div>
  );
}
