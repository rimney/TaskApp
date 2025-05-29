'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { singInWithEmailAndPassword } from '../auth/action/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await singInWithEmailAndPassword({ email, password });
      // const { data, error } = await singInWithEmailAndPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Wrong credentials');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center flex-col"
      style={{
        background: 'linear-gradient(135deg, #171818 0%, #4B4B4B 50%, #CAFE14 100%)',
      }}
    >
      <div className="w-auto h-[90px] flex items-center justify-center">
        <img
          src="https://framerusercontent.com/images/vsdu0muTZsCIA7B6kX4sGvniM.svg?scale-down-to=1024"
          className="w-[370px]"
          alt=""
        />
      </div>
      <Card className="w-full max-w-md bg-[#171818] border-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#CAFE14]">Login</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#CAFE14]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[white] bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-[white] focus:border-[white]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#CAFE14]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[white] bg-[#171818] text-gray-100 placeholder-gray-400 focus:ring-[white] focus:border-[white]"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CAFE14] border border-black cursor-pointer text-[#171818] shadow-[4px_5px_0px_0px_#ffffff] hover:bg-[white] hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}