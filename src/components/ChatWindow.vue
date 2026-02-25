<template>
  <div class="windowChat">
    <h2>{{ chattingWith.name }}</h2>
    <div class="messages" ref="messagesContainer">
      <div
        v-for="msg in filteredMessages"
        :key="msg.id"
        :class="[
          'message',
          msg.senderId === activeUser.id ? 'my-message' : 'their-message',
        ]"
      >
        <div class="message-content">
          {{ msg.content }}
        </div>
        <small class="message-timestamp">{{
          formatTimestamp(msg.timestamp)
        }}</small>
      </div>
      <div ref="messagesEnd"></div>
    </div>
    <div class="chat-input-container">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Написать сообщение..."
        @keypress.enter="sendMessage"
      />
      <button @click="sendMessage">➤</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, nextTick, computed } from "vue";

export default defineComponent({
  name: "ChatWindow",
  props: {
    activeUser: {
      type: Object,
      required: true,
    },
    chattingWith: {
      type: Object,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const newMessage = ref("");
    const messagesContainer = ref(null);
    const messagesEnd = ref(null);

    // Прокрутка к последнему сообщению
    const scrollToBottom = () => {
      nextTick(() => {
        messagesEnd.value?.scrollIntoView({ behavior: "smooth" });
      });
    };

    watch(
      () => props.messages,
      () => {
        scrollToBottom();
      },
      { immediate: true },
    );

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        emit("send-message", newMessage.value);
        newMessage.value = "";
      }
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Фильтрация сообщений между выбранным  пользователем и собеседником
    const filteredMessages = computed(() => {
      return props.messages.filter(
        (msg) =>
          (msg.senderId === props.activeUser.id &&
            msg.receiverId === props.chattingWith.id) ||
          (msg.senderId === props.chattingWith.id &&
            msg.receiverId === props.activeUser.id),
      );
    });

    return {
      newMessage,
      messagesContainer,
      messagesEnd,
      filteredMessages,
      sendMessage,
      formatTimestamp,
    };
  },
});
</script>
