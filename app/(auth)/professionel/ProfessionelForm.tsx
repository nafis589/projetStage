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
import { UserPlus, ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";
import FileUploadWithAPI from "@/components/ui/FileUploadWithAPI";
import { signIn, getSession } from "next-auth/react";

interface UploadedFileInfo {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  documentType: string;
  path: string;
}

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .regex(nameRegex, {
      message: "Le prénom ne peut contenir que des lettres, des tirets ou des apostrophes.",
    }),
  lastname: z
    .string()
    .min(2, { message: "Le nom de famille doit contenir au moins 2 caractères." })
    .regex(nameRegex, {
      message: "Le nom de famille ne peut contenir que des lettres, des tirets ou des apostrophes.",
    }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

type FormData = z.infer<typeof formSchema>;

const ProfessionelForm = () => {
  const { toast } = useToast();
  const { setLoading } = useLoading();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'upload'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Étape 1: Soumission du formulaire
  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    setFormData(data);
    try {
      // Créer le compte utilisateur
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

      // Connexion automatique après création du compte
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Votre compte a été créé, mais la connexion automatique a échoué. Veuillez vous connecter manuellement.",
        });
        router.push('/login');
        return;
      }

      // Récupérer manuellement la session pour s'assurer qu'elle est bien établie
      const session = await getSession();

      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur de session",
          description: "Impossible de vérifier votre session. Veuillez vous connecter manuellement.",
        });
        router.push('/login');
        return;
      }

      toast({
        variant: "success",
        title: "Informations enregistrées !",
        description: "Veuillez maintenant télécharger vos documents.",
      });

      // Passer à l'étape suivante (upload)
      setCurrentStep('upload');
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

  // Étape 2: Gestion des fichiers uploadés
  const handleFilesUploaded = (files: UploadedFileInfo[]) => {
    setUploadedFiles(files);
    toast({
      variant: "success",
      title: "Documents uploadés !",
      description: `${files.length} document(s) uploadé(s) avec succès.`,
    });
  };

  // Étape 3: Connexion finale
  const handleFinalLogin = async () => {
    if (!formData) return;
    
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Impossible de vous connecter automatiquement.",
        });
        router.push('/login');
        return;
      }

      toast({
        variant: "success",
        title: "Connexion réussie !",
        description: "Compte en attente de validation.",
      });

      router.push('/');
      
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
      });
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const goBackToForm = () => {
    setCurrentStep('form');
  };

  // Rendu du formulaire d'inscription (Étape 1)
  const renderFormStep = () => (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)]"
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
              Créer un compte professionnel
            </h1>
            <p className="text-sm">
              Étape 1/2 : Informations personnelles
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="block text-sm">
                  Prénom
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
                  Nom de famille
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
                Email
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
                <Label htmlFor="password" className="text-title text-sm">
                  Mot de passe
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Mot de passe oublié ?
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
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Annuler
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              Suivant
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Vous avez déjà un compte ?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Se connecter</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );

  // Rendu de l'étape d'upload (Étape 2)
  const renderUploadStep = () => (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="m-auto h-fit w-full max-w-2xl overflow-hidden rounded-[calc(var(--radius)+.125rem)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8">
          <div className="text-center mb-8">
            <Upload size={48} className="mx-auto mb-4 text-blue-500" />
            <h1 className="text-title mb-1 text-xl font-semibold">
              Télécharger vos documents
            </h1>
            <p className="text-sm text-gray-600">
              Étape 2/2 : Ajoutez vos documents professionnels (CV, certifications, etc.)
            </p>
          </div>

          <div className="mb-8">
            <FileUploadWithAPI
              onFilesUploaded={handleFilesUploaded}
              acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
              maxFileSizeMB={5}
              maxFiles={5}
              allowMultiple={true}
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={goBackToForm}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            
            <Button 
              onClick={handleFinalLogin}
              className="flex items-center gap-2"
            >
              Se connecter
              <ArrowRight size={16} />
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                {uploadedFiles.length} document(s) téléchargé(s) avec succès
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <header className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">
            <Link href="/">Geservice</Link>
          </div>
          
          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentStep === 'form' ? 'bg-white' : 'bg-green-500'}`}></div>
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <div className={`w-3 h-3 rounded-full ${currentStep === 'upload' ? 'bg-white' : 'bg-gray-400'}`}></div>
          </div>
        </div>
      </header>

      {currentStep === 'form' && renderFormStep()}
      {currentStep === 'upload' && renderUploadStep()}
      
      <Toaster />
    </>
  );
};

export default ProfessionelForm;