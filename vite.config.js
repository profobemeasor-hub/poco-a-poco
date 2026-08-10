import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
 base:'/poco-a-poco/',
 plugins:[VitePWA({registerType:'autoUpdate',includeAssets:['apple-touch-icon.png'],manifest:{name:'Poco a Poco — Live Guatemala',short_name:'Poco a Poco',description:'Everyday Spanish practice for living confidently in Guatemala',theme_color:'#0E2B2A',background_color:'#0E2B2A',display:'standalone',start_url:'/poco-a-poco/',scope:'/poco-a-poco/',icons:[{src:'pwa-192x192.png',sizes:'192x192',type:'image/png'},{src:'pwa-512x512.png',sizes:'512x512',type:'image/png'}]}})]
});
