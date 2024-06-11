import api from '@/utils/api'
import axios from 'axios'

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Set Axios to include CSRF token from meta tag
const { data } = await api.get('/auth/csrf-token')

window.Pusher = Pusher
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  wssHost: import.meta.env.VITE_REVERB_HOST,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  // authEndpoint: `${import.meta.env.VITE_LARAVEL_URL}/broadcasting/auth`,
  auth: {
    headers: {
      'X-CSRF-TOKEN': data.csrf_token
    }
  },
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios
          .post(
            `${import.meta.env.VITE_LARAVEL_URL}/broadcasting/auth`,
            {
              socket_id: socketId,
              channel_name: channel.name
            },
            {
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              },
              withCredentials: true,
              withXSRFToken: true
            }
          )
          .then(({ data }) => {
            console.log(data)
            callback(false, data)
          })
          .catch((error) => {
            console.log(error)
            callback(true, error)
          })
      }
    }
  }
})
