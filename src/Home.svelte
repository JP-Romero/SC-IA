<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/translations';
  import { user, userProfile } from '$lib/stores/userStore';
  import { ArrowRight, Search } from 'lucide-svelte';

  let profileName = '';
  let avatarUrl = '/avatars/avatar-guest.png';

  user.subscribe($user => {
    if ($user && !$user.isGuest) {
      avatarUrl = $user.user_metadata?.avatar_url || '/avatars/default-avatar.png';
    } else {
      avatarUrl = '/avatars/avatar-guest.png';
    }
  });

  userProfile.subscribe($profile => {
    if ($profile) {
      profileName = $profile.name || '';
    }
  });

  // Para simular el nombre de invitado
  onMount(() => {
    if ($user.isGuest) {
      profileName = $t('guest');
    }
  });
</script>

<div class="p-4 md:p-6 space-y-6">
  <!-- Cabecera con Saludo y Foto de Perfil -->
  <header class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold font-display text-text-main">
        {$t('hello')},
      </h1>
      <p class="text-text-secondary -mt-1">{profileName || '...'}</p>
    </div>
    <a href="/perfil" class="relative" aria-label={$t('viewProfile')}>
      <!-- 
        ================================================================
        ==> ¡AQUÍ ESTÁ EL CAMBIO! <==
        Se agregaron las clases `border-health` y `animate-pulse-glow-health`
        para el color verde y la animación de resplandor.
        ================================================================
      -->
      <div class="w-14 h-14 rounded-full border-4 p-1
                  border-health animate-pulse-glow-health 
                  dark:border-health-dark transition-all duration-300">
        <img 
          src={avatarUrl} 
          alt="Avatar de usuario" 
          class="rounded-full w-full h-full object-cover bg-surface-soft"
        />
      </div>
    </a>
  </header>

  <!-- Barra de Búsqueda Principal -->
  <div class="relative">
    <input
      type="text"
      placeholder={$t('homeSearchPlaceholder')}
      class="w-full pl-10 pr-4 py-3 bg-surface-soft dark:bg-surface rounded-full border border-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all"
    />
    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
      <Search size={20} />
    </div>
  </div>

  <!-- Tarjetas de Acción Rápida -->
  <div class="space-y-4">
    <a href="/consulta" class="block bg-primary-light dark:bg-surface p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-primary-dark dark:text-primary text-lg">{$t('aiConsultation')}</h3>
          <p class="text-sm text-text-secondary">{$t('howYouFeel')}</p>
        </div>
        <ArrowRight class="text-primary-dark dark:text-primary" />
      </div>
    </a>

    <a href="/centros" class="block bg-health-light dark:bg-surface p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-health-dark dark:text-health text-lg">{$t('publicHealth')}</h3>
          <p class="text-sm text-text-secondary">{$t('officialServices')}</p>
        </div>
        <ArrowRight class="text-health-dark dark:text-health" />
      </div>
    </a>

    <a href="/buscar" class="block bg-surface-soft dark:bg-surface p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-text-main text-lg">{$t('myAppointments')}</h3>
          <p class="text-sm text-text-secondary">{$t('manageAppointments')}</p>
        </div>
        <ArrowRight class="text-text-secondary" />
      </div>
    </a>
  </div>
</div>