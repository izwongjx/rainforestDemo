import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        rooms: resolve(__dirname, 'rooms.html'),
        location: resolve(__dirname, 'location.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about.html'),
        room1: resolve(__dirname, 'room-1.html'),
        room2: resolve(__dirname, 'room-2.html'),
        room3: resolve(__dirname, 'room-3.html'),
        room4: resolve(__dirname, 'room-4.html'),
        room5: resolve(__dirname, 'room-5.html'),
        room6: resolve(__dirname, 'room-6.html'),
        room7: resolve(__dirname, 'room-7.html'),
        room8: resolve(__dirname, 'room-8.html'),
      }
    }
  }
});
