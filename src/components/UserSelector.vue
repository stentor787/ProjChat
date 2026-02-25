<template>
  <div class="user-selection">
    <h2>Выберите пользователя</h2>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
        @click="$emit('user-selected', user)"
        class="user-selection-item"
      >
        <img
          :src="user.avatar"
          alt="avatar"
          class="avatar"
          @click.stop="$emit('view-profile', user)"
        />
        <span>{{ user.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserSelection",
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
});
</script>

