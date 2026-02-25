import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { id: '1', name: 'Ислам', avatar: new URL('../assets/avatar.svg', import.meta.url).href },
      { id: '2', name: 'Ника', avatar: new URL('../assets/avatar.svg', import.meta.url).href },
      { id: '3', name: 'Алекс', avatar: new URL('../assets/avatar.svg', import.meta.url).href },
      { id: '4', name: 'Адлет', avatar: new URL('../assets/avatar.svg', import.meta.url).href },
    ],
    selectedProfile: null,
  }),
  actions: {
    openProfile(user) {
      this.selectedProfile = user
    },
    closeProfile() {
      this.selectedProfile = null
    },
    setUsers(list) {
      this.users = list
    }
  },
})
