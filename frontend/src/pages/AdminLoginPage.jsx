import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error.message || 'Autenticazione fallita');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      const msg = err?.message || err?.error?.message || 'Login failed. Please check your credentials and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Accedi all'area amministrativa per gestire il sito.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6" data-testid="admin-login-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email amministratore</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  data-testid="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sojirin.solomon@yahoo.com"
                  required
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  data-testid="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci la tua password"
                  required
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {error && (
              <div
                data-testid="admin-login-error"
                className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              data-testid="admin-login-submit"
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full font-medium text-lg"
            >
              {isLoading || loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              data-testid="back-to-website-link"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Torna al sito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
