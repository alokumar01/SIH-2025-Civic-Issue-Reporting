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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const success = await useUserStore.getState().register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      if (success) {
        // Optionally login user automatically or redirect
        window.location.href = "/";
      } else {
        setError(useUserStore.getState().error || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md border border-border/30 transition hover:shadow-2xl">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-2xl md:text-3xl font-semibold text-center">
          Welcome
        </CardTitle>
        <p className="text-center text-muted-foreground text-sm mt-1">
          Sign in or create a new account
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        {/* Social logins removed - streamlined flow */}
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
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
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 accent-primary" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot((s) => !s);
                    setForgotMessage("");
                    setForgotError("");
                  }}
                  className="text-primary hover:underline"
                >
                  {showForgot ? "Close" : "Forgot password?"}
                </button>
              </div>
              {showForgot && (
                <div className="mt-4 p-4 rounded-md bg-muted/5 border border-border/30">
                  {forgotMessage ? (
                    <Alert variant="default">
                      <AlertDescription className="text-sm">
                        {forgotMessage}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleForgot} className="space-y-3">
                      {forgotError && (
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            {forgotError}
                          </AlertDescription>
                        </Alert>
                      )}
                      <div>
                        <label className="block text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={forgotLoading}>
                          {forgotLoading ? "Sending..." : "Send reset link"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowForgot(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          {/* Signup */}
          <TabsContent value="signup">
            <form className="space-y-5" onSubmit={handleSignup}>
              {error && (
                <Alert variant="destructive" className="rounded-md">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
