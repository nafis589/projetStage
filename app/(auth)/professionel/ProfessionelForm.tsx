"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import useLoading from "@/hooks/useLoading";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus } from "lucide-react";
const formSchema = z.object({
  firstname: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastname: z.string().min(2, { message: "Le nom de famille doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

type FormData = z.infer<typeof formSchema>;

const ProfessionelForm = () => {
  const { toast } = useToast();
  const { setLoading } = useLoading();
  const router = useRouter();
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
      const response = await fetch("/api/auth/professionel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
          description: "Une erreur est survenue lors de l'inscription.",
        });
        return;
      }

      const responseData = await response.json();
      console.log("Inscription réussie :", responseData);
      
      toast({
        variant: "success",
        title: "Inscription réussie !",
        description: "Votre compte professionnel a été créé avec succès.",
      });

      // Redirection vers la page de connexion
      router.push('/login');
      
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


  return (
    <>
      <header className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold"><Link href="/">Geservice</Link></div>
        </div>
      </header>
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          onSubmit={handleSubmit(onSubmit)}
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
                    id="firstname"
                    {...register("firstname")}
                  />
                  {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Lastname
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    {...register("lastname")}
                  />
                  {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
                </div>
              </div>

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
                annuler
              </Button>
              <Button type="submit" variant="outline">
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
export default ProfessionelForm;
