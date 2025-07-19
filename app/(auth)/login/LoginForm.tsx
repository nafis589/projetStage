"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useLoading from "@/hooks/useLoading";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z.string().min(1, { message: "Le mot de passe ne peut pas être vide." }),
});

type FormData = z.infer<typeof formSchema>;


const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        console.log("pourquoi le toast ne s'affiche pas?");
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        if (userData.role === "client") {
          router.push(`/dashboard/client/${userData.id}`);
        } else {
          router.push(`/dashboard/professional/${userData.id}`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setLoading(false);
    }
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
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-3xl shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link
                href="/"
                aria-label="go home"
                className="mx-auto text-2xl font-bold block w-fit"
              >
                <h1>
                  <LogIn size={48} />
                </h1>
              </Link>
              <h1 className="mb-1 mt-4 text-xl font-semibold">
                Sign In to Geservice
              </h1>
              <p className="text-sm">Welcome back! Sign in to continue</p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Username
                </Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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
                  id="password"
                  className="input sz-md variant-mixed"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit" variant="default">
                se connecter
              </Button>
            </div>
          </div>

          <div className="p-3">
            <p className="text-accent-foreground text-center text-sm">
              Don&apos;t have an account ?
              <Button asChild variant="link" className="px-2">
                <Link href="#">Create account</Link>
              </Button>
            </p>
          </div>
        </form>
      </section>
    </>
  );
};
export default LoginForm;
