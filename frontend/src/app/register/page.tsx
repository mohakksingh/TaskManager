'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { Mail, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ email, password });
      toast.success('Account created successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl transition-all hover:shadow-2xl">
        <div className="bg-black p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-400">Join us to start managing tasks</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 rounded-md bg-gray-100 p-4 text-sm text-red-600 border border-gray-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2.5 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2.5 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-black py-2.5 px-4 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? (
                <Loader size="sm" color="border-white" />
              ) : (
                <>
                  Sign Up
                  <UserPlus className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black transition-colors hover:text-gray-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
