<template>
  <div class="pm-overlay" @click="$emit('close')">
    <div class="pm-card" @click.stop>
      <button class="pm-close" @click="$emit('close')" aria-label="Close">✕</button>
      <div class="pm-body">
        <div class="pm-left">
          <img :src="user.avatar" alt="avatar" class="pm-avatar" />
          <div class="pm-badges">
            <span class="badge">Online</span>
          </div>
        </div>
        <div class="pm-info">
          <h3>{{ user.name }}</h3>
          <p class="muted">ID: {{ user.id }}</p>
          <p class="muted">Пример email: <strong>user{{ user.id }}@example.com</strong></p>
          <p class="about">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus ad aperiam rem accusamus ex laudantium perspiciatis exercitationem ea consequatur magnam earum adipisci quae facilis aliquam cum molestias quis, quos ipsum.</p>
        </div>
      </div>
      <div class="pm-actions">
        <button class="ghost" @click="$emit('close')">Закрыть</button>
        <button @click="$emit('close')">Начать чат</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileModal',
  props: {
    user: { type: Object, required: true },
  },
}
</script>


