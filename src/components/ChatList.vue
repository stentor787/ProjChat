<template>
  <div class="chat-list">
    <h2 :style="{ fontSize: '29px', textAlign: 'center' }">Чаты</h2>
    <ul>
      <li
        v-for="user in sortedUsers"
        :key="user.id"
        @click="selectChat(user)"
        class="chat-list-item"
      >
        <img
          :src="user.avatar"
          alt="avatar"
          class="avatar"
          @click.stop="viewProfile(user)"
        />
        <div class="meta">
          <span>{{ user.name }}</span>
        </div>
        <div v-if="newMessages && newMessages[user.id]" class="unread-count">
          {{ newMessages[user.id] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatList",
  props: {
    users: {
      type: Array,
      required: true,
    },
    activeUserId: {
      type: String,
      required: true,
    },
    newMessages: {
      type: Object,
      required: true,
    },
  },
  emits: ["chat-selected", "view-profile"],
  computed: {
    sortedUsers() {
      return this.users
        .filter((user) => user.id !== this.activeUserId)
        .sort((a, b) => {
          const newMessagesA = this.newMessages[a.id] || 0;
          const newMessagesB = this.newMessages[b.id] || 0;
          return newMessagesB - newMessagesA;
        });
    },
  },
  methods: {
    selectChat(user) {
      this.$emit("chat-selected", user);
    },
    viewProfile(user) {
      this.$emit("view-profile", user);
    },
  },
});
</script>
