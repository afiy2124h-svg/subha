# Subha Mam Birthday (React + Vite)

## Run it in VS Code
1. Install Node.js (LTS) from https://nodejs.org if you do not have it.
2. In VS Code: File > Open Folder > choose this folder.
3. Open the terminal (Ctrl + `) and run:
   npm install
   npm run dev
4. Open the address it prints (usually http://localhost:5173).

## See the lock screen and test the unlock
Open  http://localhost:5173/?preview
You will see the lock screen with an "unlock now" button, so you can watch the unlock animation.
Without ?preview the page stays locked until 1 Nov 2026, 12:00 AM (India time), then opens by itself.

To switch the lock off while editing, set  lockEnabled: false  in src/config.js.

## Add your photos, video and song (only edit src/config.js)
1. Copy files into the "public" folder (photos go in public/photos/).
2. In src/config.js write the path without a leading slash:
   mamPhoto: 'mam.jpg',
   photos: [ { src: 'photos/1.jpg', caption: '' }, ... up to 4 ],
   video: 'video.mp4',
   song: 'song.mp3',
   wishes: [ { name: 'Rohith', text: 'Thank you, Mam!' } ],
3. Save. The page reloads by itself.

## Share it with Mam
Run  npm run build  to create the "dist" folder, then upload that folder to a free host
(Netlify Drop, Vercel or GitHub Pages) and send her the link.
