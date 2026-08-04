import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, LoaderCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Keep the recovery token in the URL fragment. HashRouter also uses a
      // fragment for routes, so App.js recognizes this query flag instead.
      const redirectTo = `${window.location.origin}${window.location.pathname}?reset-password=true`;
      const { error } = await auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Se l’indirizzo è registrato, riceverai a breve un’email per reimpostare la password.' });
    } catch (error) {
      setMessage({ type: 'error', text: error?.message || 'Non è stato possibile inviare l’email di reimpostazione. Riprova.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"><KeyRound className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reimposta password</h1>
          <p className="text-gray-600">Inserisci l’email amministratore per ricevere il link di reimpostazione.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">
              Email amministratore
              <span className="relative mt-2 block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="pl-10 w-full" /></span>
            </label>
            {message.text && <div role="status" className={`flex gap-2 rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}<p>{message.text}</p>
            </div>}
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full text-lg">
              {isLoading ? <span className="flex items-center justify-center gap-2"><LoaderCircle className="h-5 w-5 animate-spin" /> Invio in corso...</span> : 'Invia link di reimpostazione'}
            </Button>
          </form>
          <button type="button" onClick={() => navigate('/admin/login')} className="mt-6 w-full text-sm text-gray-600 hover:text-blue-600">Torna al login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
