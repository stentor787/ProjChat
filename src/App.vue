<template>
  <div id="app">
    <div v-if="!activeUser">
      <UserSelector
        :users="userStore.users"
        @user-selected="onUserSelected"
        @view-profile="onViewProfile"
      />
    </div>
    <div v-else>
      <div class="container-chat">
        <ChatList
          :users="userStore.users"
          :newMessages="newMessages[activeUser.id]"
          :activeUserId="activeUser.id"
          @chat-selected="onChatSelected"
          @view-profile="onViewProfile"
        />
        <ChatWindow
          v-if="chattingWith"
          :activeUser="activeUser"
          :chattingWith="chattingWith"
          :messages="filteredMessages"
          @send-message="sendMessage"
        />
      </div>
    </div>
    <ProfileModal
      v-if="userStore && userStore.selectedProfile"
      :user="userStore.selectedProfile"
      @close="closeProfile"
    />
  </div>
</template>

<script lang="ts">
import UserSelector from "./components/UserSelector.vue";
import ChatList from "./components/ChatList.vue";
import ChatWindow from "./components/ChatWindow.vue";
import ProfileModal from "./components/ProfileModal.vue";
import { useUserStore } from "./stores/user";

export default {
  name: "App",
  components: {
    UserSelector,
    ChatList,
    ChatWindow,
    ProfileModal,
  },
  data() {
    return {
      userStore: null,
      activeUser: null,
      chattingWith: null,
      messages: [],
      newMessages: {},
    };
  },
  created() {
    this.userStore = useUserStore();
    this.loadMessages();
    window.addEventListener("storage", this.syncMessagesAcrossTabs);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.syncMessagesAcrossTabs);
  },
  computed: {
    filteredMessages() {
      if (this.activeUser && this.chattingWith) {
        return this.messages.filter(
          (msg) =>
            (msg.senderId === this.activeUser.id &&
              msg.receiverId === this.chattingWith.id) ||
            (msg.senderId === this.chattingWith.id &&
              msg.receiverId === this.activeUser.id),
        );
      }
      return [];
    },
  },
  methods: {
    saveMessages() {
      localStorage.setItem("messages", JSON.stringify(this.messages));
      localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
    },

    loadMessages() {
      const storedMessages = localStorage.getItem("messages");
      const storedNewMessages = localStorage.getItem("newMessages");

      if (storedMessages) {
        this.messages = JSON.parse(storedMessages);
      }

      if (storedNewMessages) {
        this.newMessages = JSON.parse(storedNewMessages);
      } else {
        this.userStore.users.forEach((user) => {
          if (!this.newMessages[user.id]) {
            this.newMessages[user.id] = {};
          }
        });
      }

      this.userStore.users.forEach((user) => {
        if (!this.newMessages[user.id]) {
          this.newMessages[user.id] = {};
        }
      });
    },

    syncMessagesAcrossTabs(event) {
      if (event.key === "messages") {
        const updatedMessages = localStorage.getItem("messages");
        if (updatedMessages) {
          this.messages = JSON.parse(updatedMessages);
          this.forceUpdateChat();
        }
      }
      if (event.key === "newMessages") {
        const updatedNewMessages = localStorage.getItem("newMessages");
        if (updatedNewMessages) {
          this.newMessages = JSON.parse(updatedNewMessages);
        }
      }
    },

    onUserSelected(user) {
      this.activeUser = user;
    },

    onViewProfile(user) {
      if (this.userStore) this.userStore.openProfile(user);
    },

    closeProfile() {
      if (this.userStore) this.userStore.closeProfile();
    },

    onChatSelected(user) {
      this.chattingWith = user;
      this.resetNewMessages(user.id);
    },

    sendMessage(content) {
      if (this.activeUser && this.chattingWith) {
        const newMessage = {
          id: Date.now().toString(),
          senderId: this.activeUser.id,
          receiverId: this.chattingWith.id,
          content,
          timestamp: Date.now(),
        };
        this.messages.push(newMessage);
        this.saveMessages();
        this.incrementNewMessages(this.chattingWith.id, this.activeUser.id);
        this.forceUpdateChat();
      }
    },
    forceUpdateChat() {
      this.messages = [...this.messages];
    },

    incrementNewMessages(receiverId, senderId) {
      if (!this.newMessages[receiverId]) {
        this.newMessages[receiverId] = {};
      }
      if (!this.newMessages[receiverId][senderId]) {
        this.newMessages[receiverId][senderId] = 0;
      }
      this.newMessages[receiverId][senderId]++;
      this.saveMessages();
    },

    resetNewMessages(receiverId) {
      if (
        this.newMessages[this.activeUser.id] &&
        this.newMessages[this.activeUser.id][receiverId]
      ) {
        this.newMessages[this.activeUser.id][receiverId] = 0;
        this.saveMessages();
      }
    },
  },
};
</script>
