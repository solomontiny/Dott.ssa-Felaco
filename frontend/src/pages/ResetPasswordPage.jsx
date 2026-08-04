import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;
    const checkRecoverySession = async () => {
      const { data } = await auth.getSession();
      if (active) setIsRecoverySession(Boolean(data?.session));
    };
    void checkRecoverySession();
    const { data: listener } = auth.onAuthStateChange((event, session) => {
      if (active && (event === 'PASSWORD_RECOVERY' || session)) setIsRecoverySession(Boolean(session));
    });
    return () => { active = false; listener?.subscription?.unsubscribe?.(); };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 6) return setMessage({ type: 'error', text: 'La password deve contenere almeno 6 caratteri.' });
    if (password !== confirmation) return setMessage({ type: 'error', text: 'Le password non coincidono.' });
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await auth.updatePassword(password);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password aggiornata. Reindirizzamento al login…' });
      window.setTimeout(() => {
        // Remove the recovery query/token before returning to the hash route.
        window.location.assign(`${window.location.origin}${window.location.pathname}#/admin/login`);
      }, 1400);
    } catch (error) {
      setMessage({ type: 'error', text: error?.message || 'Non è stato possibile aggiornare la password. Richiedi un nuovo link.' });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full"><div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"><KeyRound className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-bold text-gray-900 mb-2">Nuova password</h1><p className="text-gray-600">Scegli una nuova password sicura.</p></div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!isRecoverySession && <div className="mb-6 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle className="h-5 w-5 shrink-0" /><p>Apri il link ricevuto via email per reimpostare la password.</p></div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {['Nuova password', 'Conferma password'].map((label, index) => <label key={label} className="block text-sm font-medium text-gray-700">{label}<span className="relative mt-2 block"><Input type={showPassword ? 'text' : 'password'} value={index ? confirmation : password} onChange={(event) => index ? setConfirmation(event.target.value) : setPassword(event.target.value)} required minLength="6" autoComplete={index ? 'new-password' : 'new-password'} className="pr-11 w-full" />{index === 0 && <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Nascondi password' : 'Mostra password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>}</span></label>)}
            {message.text && <div role="status" className={`flex gap-2 rounded-lg border p-4 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}<p>{message.text}</p></div>}
            <Button type="submit" disabled={isLoading || !isRecoverySession} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full text-lg">{isLoading ? <span className="flex items-center justify-center gap-2"><LoaderCircle className="h-5 w-5 animate-spin" /> Aggiornamento...</span> : 'Aggiorna password'}</Button>
          </form>
          <button type="button" onClick={() => navigate('/admin/forgot-password')} className="mt-6 w-full text-sm text-gray-600 hover:text-blue-600">Richiedi un nuovo link</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
