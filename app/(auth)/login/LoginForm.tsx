"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, {useState} from "react";
import Link from "next/link";
import {signIn} from 'next-auth/react'

const LoginForm = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void>=>{
    e.preventDefault();
    signIn('credentials', {
      email: user.email,
      password: user.password,
    })
  }
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
          onSubmit={handleSubmit}
          action=""
          className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link
                href="/"
                aria-label="go home"
                className="mx-auto text-2xl font-bold block w-fit"
              >
                <h1>Geservice</h1>
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
                <Input type="email" required name="email" id="email" value={user.email} onChange={handleChange}/>
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
                  className="input sz-md variant-mixed"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit" variant="outline">
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
