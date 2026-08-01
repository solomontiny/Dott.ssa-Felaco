// API Adapter: intercepts frontend requests to /api/* and routes them to Supabase
// This allows incremental migration: existing components keep calling '/api/...' but
// the adapter implements the old endpoints backed by Supabase tables/storage.

import axios from 'axios';
import supabase, { supabase as supaClient, db, storage, auth } from './supabaseClient';

// Helper to parse url and extract path + query
function parseUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return { pathname: u.pathname, searchParams: u.searchParams };
  } catch (e) {
    // Fallback: treat as relative path
    const idx = url.indexOf('?');
    const pathname = idx === -1 ? url : url.substring(0, idx);
    const search = idx === -1 ? '' : url.substring(idx);
    const sp = new URLSearchParams(search);
    return { pathname, searchParams: sp };
  }
}

function isApiCall(url) {
  if (!url) return false;
  return url.includes('/api/');
}

// Minimal helpers
async function requireAuth() {
  // Return current user or throw
  const { data } = await auth.getUser();
  const user = data?.user ?? null;
  if (!user) {
    const err = { status: 403, message: 'Unauthorized' };
    throw err;
  }
  return user;
}

// Response shim to match axios response shape
function makeResponse(data, status = 200) {
  return { data, status, statusText: status === 200 ? 'OK' : 'ERROR' };
}

// Adapter handlers
const handlers = {
  async post_admin_login({ data }) {
    const { email, password } = data;
    const res = await auth.signInWithEmail(email, password);
    if (res.error) {
      return Promise.reject({ response: { status: 401, data: { detail: res.error.message || 'Authentication failed' } } });
    }
    // res.data.session contains access_token etc in supabase v2
    const session = res.data?.session ?? null;
    const user = res.data?.user ?? null;
    return makeResponse({ access_token: session?.access_token ?? null, token_type: 'bearer', user });
  },

  async get_admin_verify() {
    try {
      const { data } = await auth.getUser();
      const user = data?.user ?? null;
      if (!user) return Promise.reject({ response: { status: 403, data: { detail: 'Access denied' } } });
      return makeResponse({ valid: true, email: user.email, user });
    } catch (e) {
      return Promise.reject({ response: { status: 403, data: { detail: 'Access denied' } } });
    }
  },

  // Public articles listing
  async get_articles({ searchParams }) {
    const published_only = searchParams.get('published_only') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const language = searchParams.get('language') || 'en';

    let query = supaClient.from('articles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (published_only) query = query.eq('published', true);
    if (language) query = query.eq('language', language);

    const { data, error, count } = await query;
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true, articles: data || [], total: typeof count === 'number' ? count : (data ? data.length : 0) });
  },

  // Admin article list
  async get_admin_articles({ searchParams }) {
    await requireAuth();
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const { data, error, count } = await supaClient.from('articles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true, articles: data || [], total: typeof count === 'number' ? count : (data ? data.length : 0) });
  },

  async post_admin_articles({ data }) {
    await requireAuth();
    // Ensure created_at / author fields are provided
    const payload = { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const { data: inserted, error } = await supaClient.from('articles').insert(payload).select().single();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse(inserted, 200);
  },

  async put_admin_articles_id({ id, data }) {
    await requireAuth();
    const payload = { ...data, updated_at: new Date().toISOString() };
    const { data: updated, error } = await supaClient.from('articles').update(payload).eq('id', id).select().single();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ article: updated }, 200);
  },

  async delete_admin_articles_id({ id }) {
    await requireAuth();
    const { data: deleted, error } = await supaClient.from('articles').delete().eq('id', id).select();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true }, 200);
  },

  async post_admin_upload_image({ data }) {
    // Expect formData with 'file'
    await requireAuth();
    const file = data?.get ? data.get('file') : null;
    if (!file) return Promise.reject({ response: { status: 400, data: { detail: 'No file provided' } } });

    // Create unique path
    const filename = file.name || `upload-${Date.now()}`;
    const unique = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${filename}`;
    const bucket = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'public';
    try {
      const { data: uploadRes, error: uploadErr } = await supaClient.storage.from(bucket).upload(unique, file, { cacheControl: '3600', upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = await supaClient.storage.from(bucket).getPublicUrl(unique);
      const publicUrl = urlData?.publicUrl || null;
      return makeResponse({ success: true, image_url: publicUrl }, 200);
    } catch (e) {
      return Promise.reject({ response: { status: 500, data: { detail: e.message || String(e) } } });
    }
  },

  // Appointments, consultations, newsletter, contact — map to tables
  async post_appointment({ data }) {
    const payload = { ...data, created_at: new Date().toISOString() };
    const { data: created, error } = await supaClient.from('appointments').insert(payload).select().single();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true, appointment: created });
  },

  async post_consultation({ data }) {
    const payload = { ...data, created_at: new Date().toISOString() };
    const { data: created, error } = await supaClient.from('consultations').insert(payload).select().single();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true, consultation: created });
  },

  async post_newsletter_subscribe({ data }) {
    const payload = { ...data, created_at: new Date().toISOString() };
    const { data: created, error } = await supaClient.from('newsletter_subscribers').insert(payload).select().single();
    if (error) {
      // If duplicate email, supabase may return constraint error; return success if already exists
      return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    }
    return makeResponse({ success: true, subscriber: created });
  },

  async post_contact({ data }) {
    const payload = { ...data, created_at: new Date().toISOString() };
    const { data: created, error } = await supaClient.from('contacts').insert(payload).select().single();
    if (error) return Promise.reject({ response: { status: 500, data: { detail: error.message } } });
    return makeResponse({ success: true, contact: created });
  }
};

// Central router: path and method
async function routeApiRequest(method, pathname, searchParams, data) {
  // Normalize path to remove any leading base prefixes up to /api
  const idx = pathname.indexOf('/api/');
  const apiPath = idx >= 0 ? pathname.substring(idx + 5) : pathname; // path after '/api/'
  // Examples: 'admin/login', 'articles', 'admin/articles/123', 'uploads/filename'

  const segments = apiPath.split('/').filter(Boolean);

  try {
    // Admin login
    if (method === 'post' && apiPath === 'admin/login') return await handlers.post_admin_login({ data });

    if (method === 'get' && apiPath === 'admin/verify') return await handlers.get_admin_verify();

    // Public articles
    if (method === 'get' && segments[0] === 'articles' && segments.length === 1) return await handlers.get_articles({ searchParams });

    // Admin articles list
    if (method === 'get' && apiPath === 'admin/articles') return await handlers.get_admin_articles({ searchParams });
    if (method === 'post' && apiPath === 'admin/articles') return await handlers.post_admin_articles({ data });

    // Admin article with id
    if (segments[0] === 'admin' && segments[1] === 'articles' && segments.length === 3) {
      const id = segments[2];
      if (method === 'put') return await handlers.put_admin_articles_id({ id, data });
      if (method === 'delete') return await handlers.delete_admin_articles_id({ id });
      if (method === 'get') {
        // get specific article
        const { data: article, error } = await supaClient.from('articles').select('*').eq('id', id).single();
        if (error) return Promise.reject({ response: { status: 404, data: { detail: error.message } } });
        return makeResponse({ success: true, article });
      }
    }

    // Admin upload
    if (method === 'post' && apiPath === 'admin/upload-image') return await handlers.post_admin_upload_image({ data });

    // Appointments
    if ((method === 'post' || method === 'POST') && apiPath === 'appointment') return await handlers.post_appointment({ data });
    if ((method === 'post' || method === 'POST') && apiPath === 'consultation') return await handlers.post_consultation({ data });

    // Newsletter
    if (method === 'post' && apiPath.includes('newsletter')) return await handlers.post_newsletter_subscribe({ data });

    // Contact
    if (method === 'post' && apiPath === 'contact') return await handlers.post_contact({ data });

    // Fallback: not handled here — let the request proceed normally
    return null;
  } catch (e) {
    // Expected error objects shaped as { response: { status, data } } or custom { status, message }
    if (e && e.response) throw e;
    if (e && e.status) throw { response: { status: e.status, data: { detail: e.message || 'Error' } } };
    throw { response: { status: 500, data: { detail: e.message || String(e) } } };
  }
}

// Install interceptor: call this once (index.js will import this file)
export function installApiAdapter() {
  // Request interceptor
  axios.interceptors.request.use(async (config) => {
    const url = config.url || '';
    if (!isApiCall(url)) return config; // not an API call

    const { pathname, searchParams } = parseUrl(url);
    // Route handled by adapter
    const method = (config.method || 'get').toLowerCase();
    try {
      const result = await routeApiRequest(method, pathname, searchParams, config.data);
      if (result === null) {
        // Not handled - let the request proceed to network
        return config;
      }
      // If we got a result, short-circuit by creating a fake response and throwing a special symbol
      // We cannot directly return a response from request interceptor; instead, attach the adapter response
      // to config and mark it so response interceptor can return it.
      config.__adapterResponse = result;
      // Cancel the actual request by setting a custom adapter that resolves with this response
      config.adapter = function fakeAdapter() {
        return Promise.resolve({
          data: result.data,
          status: result.status,
          statusText: result.statusText,
          headers: {},
          config,
        });
      };
      return config;
    } catch (err) {
      // Map to axios error response by throwing
      throw err;
    }
  }, (error) => Promise.reject(error));

  // Response interceptor: pass through
  axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));
}

// Auto-install when loaded
installApiAdapter();

export default { installApiAdapter };
