import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";

export default function AuthCard() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await useUserStore.getState().login({ email, password });
    if (success) {
      // redirect to dashboard on success
      window.location.href = "/dashboard";
    } else {
      setError(useUserStore.getState().error || "Login failed");
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");
    try {
      // Keep using api for forgot password as store does not provide it.
      await (await import("@/lib/api")).default.post("/auth/forgot", { email: forgotEmail });
      setForgotMessage(
        "If an account exists for this email, a reset link has been sent. Please check your inbox."
      );
    } catch (err) {
      setForgotError(err.response?.data?.message || "Request failed");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md border border-border/30 transition hover:shadow-2xl">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-2xl md:text-3xl font-semibold text-center">
          Welcome
        </CardTitle>
        <p className="text-center text-muted-foreground text-sm mt-1">
          Login to your account
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
          {/* Login */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <Alert variant="destructive" className="rounded-md">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Email or Username
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
      </CardContent>
    </Card>
  );
}
