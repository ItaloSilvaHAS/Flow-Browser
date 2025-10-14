// Configuração do Supabase
const SUPABASE_URL = 'https://bxjuustgvxxrzzbklszk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4anV1c3Rndnh4cnp6Ymtsc3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTc5MjksImV4cCI6MjA3MTEzMzkyOX0.VZu9unVOwHGrIal_dIfq4SKhB-x6_xz5-iik7wvy15Q';

let supabaseClient = null;
let currentUser = null;

function initSupabase() {
  try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase inicializado com sucesso');
      checkAuthState();
    } else {
      console.error('❌ Supabase client não carregado. Verifique se o script CDN está incluído no HTML.');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
  }
}

async function checkAuthState() {
  if (!supabaseClient) return;
  
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
      currentUser = session.user;
      console.log('✅ Usuário logado:', currentUser.email);
      updateUIForLoggedInUser();
    } else {
      console.log('ℹ️ Nenhum usuário logado');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error);
  }
}

async function signUpWithEmail(email, password) {
  if (!supabaseClient) {
    alert('Erro: Cliente Supabase não inicializado');
    return null;
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('❌ Erro no cadastro:', error);
      return { error: error.message };
    }

    console.log('✅ Cadastro realizado:', data);
    return { data };
  } catch (error) {
    console.error('❌ Erro inesperado no cadastro:', error);
    return { error: error.message };
  }
}

async function signInWithEmail(email, password) {
  if (!supabaseClient) {
    alert('Erro: Cliente Supabase não inicializado');
    return null;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('❌ Erro no login:', error);
      return { error: error.message };
    }

    currentUser = data.user;
    console.log('✅ Login realizado:', currentUser.email);
    updateUIForLoggedInUser();
    return { data };
  } catch (error) {
    console.error('❌ Erro inesperado no login:', error);
    return { error: error.message };
  }
}

async function signInWithGoogle() {
  if (!supabaseClient) {
    alert('Erro: Cliente Supabase não inicializado');
    return;
  }

  try {
    console.log('🔄 Tentando login com Google...');
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('❌ Erro no login com Google:', error);
      alert('Erro ao fazer login com Google: ' + error.message);
    } else {
      console.log('✅ Redirecionando para Google...');
    }
  } catch (error) {
    console.error('❌ Erro inesperado no login com Google:', error);
    alert('Erro ao fazer login com Google: ' + error.message);
  }
}

async function signOut() {
  if (!supabaseClient) return;

  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      console.error('❌ Erro ao sair:', error);
      alert('Erro ao sair: ' + error.message);
    } else {
      currentUser = null;
      console.log('✅ Logout realizado');
      updateUIForLoggedOutUser();
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao sair:', error);
  }
}

async function resetPassword(email) {
  if (!supabaseClient) return;

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      console.error('❌ Erro ao resetar senha:', error);
      return { error: error.message };
    }

    console.log('✅ Email de recuperação enviado');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro inesperado ao resetar senha:', error);
    return { error: error.message };
  }
}

function updateUIForLoggedInUser() {
  const btnProfile = document.getElementById('btn-profile');
  if (btnProfile && currentUser) {
    const userEmail = currentUser.email || 'Usuário';
    btnProfile.title = `Logado como: ${userEmail}`;
    
    const icon = btnProfile.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-user-check';
      icon.style.color = '#10b981';
    }
  }
}

function updateUIForLoggedOutUser() {
  const btnProfile = document.getElementById('btn-profile');
  if (btnProfile) {
    btnProfile.title = 'Perfil';
    const icon = btnProfile.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-user-circle';
      icon.style.color = '';
    }
  }
}

function getCurrentUser() {
  return currentUser;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM carregado, inicializando Supabase...');
    setTimeout(initSupabase, 100);
  });
} else {
  console.log('🔄 DOM já carregado, inicializando Supabase...');
  setTimeout(initSupabase, 100);
}
