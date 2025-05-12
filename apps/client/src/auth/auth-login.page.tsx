import toast from 'react-hot-toast';
import { Form, Link, redirect, useNavigation } from 'react-router';

import { Button } from '~/components';
import { http, type IHttpResponse, saveToken } from '~/shared';
import type { Route } from './+types/auth-login.page';

export function meta() {
  return [
    { title: 'Sign In - Selek' },
    {
      name: 'description',
      content: 'Sign in to your Selek account and connect with your team.',
    },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const response = await http<{ access_token: string }>('/auth/login', {
      body,
    });

    saveToken(response.access_token);

    toast.success('Welcome to Selek!');
    return redirect('/workspaces');
  } catch (error) {
    toast.error((error as IHttpResponse).message);
  }
}

export default function LoginPage() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="mt-2 text-gray-500">Sign in to continue to Selek</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
                defaultValue="fachri@mail.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
                  defaultValue="qweqwe"
                />
                <div className="text-right mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-800 hover:text-orange-900"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <Button fullWidth type="submit">
                {navigation.state === 'submitting'
                  ? 'Signing in...'
                  : 'Sign in'}
              </Button>
            </div>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{' '}
            <Link
              to="/register"
              className="text-orange-800 hover:text-orange-900 font-medium"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
