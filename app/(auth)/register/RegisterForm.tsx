"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import useLoading from "@/hooks/useLoading";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

const RegisterForm = () => {
  const { toast } = useToast();
  const { setLoading } = useLoading();
  const router = useRouter();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    password: "",
    email: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
          description: "Une erreur est survenue lors de l'inscription.",
        });
        return;
      }

      const data = await response.json();
      console.log("Inscription réussie :", data);

      toast({
        variant: "success",
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });

      // Redirection vers la page de connexion
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <>
      <header className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link href="/">Geservice</Link>
          </div>
        </div>
      </header>
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link
                href="/"
                aria-label="go home"
                className="mx-auto block text-2xl font-bold w-fit"
              >
                <UserPlus size={48} />
              </Link>
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                Create an Account
              </h1>
              <p className="text-sm">
                Welcome! Create an account to get started
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    Firstname
                  </Label>
                  <Input
                    type="text"
                    required
                    name="firstname"
                    id="firstname"
                    value={user.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Lastname
                  </Label>
                  <Input
                    type="text"
                    required
                    name="lastname"
                    id="lastname"
                    value={user.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Username
                </Label>
                <Input
                  type="email"
                  required
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pwd" className="text-title text-sm">
                    Password
                  </Label>
                  <Button asChild variant="link" size="sm">
                    <Link
                      href="#"
                      className="link intent-info variant-ghost text-sm"
                    >
                      Forgot your Password ?
                    </Link>
                  </Button>
                </div>
                <Input
                  type="password"
                  required
                  name="password"
                  id="password"
                  value={user.password}
                  className="input sz-md variant-mixed"
                  onChange={handleChange}
                />
              </div>

              <div className="w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                annuler
              </Button>
              <Button type="submit" variant="default">
                s&apos;inscrire
              </Button>
            </div>
          </div>

          <div className="p-3">
            <p className="text-accent-foreground text-center text-sm">
              Have an account ?
              <Button asChild variant="link" className="px-2">
                <Link href="#">Sign In</Link>
              </Button>
            </p>
          </div>
        </form>
      </section>
      <Toaster />
    </>
  );
};
export default RegisterForm;
