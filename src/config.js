/*
  ============================================================
   EVERYTHING YOU NEED TO EDIT IS IN THIS ONE FILE
  ============================================================
  Put your files inside the "public" folder, then write their
  path here WITHOUT a leading slash, for example:  'photos/1.jpg'
*/

export const CONFIG = {
  name: 'Subha Mam',

  // The page is locked. Mam opens it by typing her date of birth.
  lockEnabled: true,
  // false = the lock asks for the date of birth EVERY time the page is opened.
  // true  = once unlocked, that browser stays unlocked.
  rememberUnlock: false,
  dob: { day: 1, month: 11, year: 1990 }, // 1 November 1990
  // Shown after two wrong tries. Leave '' for no hint.
  dobHint: 'Hint: it is the day you were born, Mam. Day, month and year.',

  // OPTIONAL. If you also want the page to stay shut until a date,
  // write it here, e.g. '2026-11-01T00:00:00+05:30'. Leave '' to open as soon as the DOB is right.
  notBefore: '',

  // Used only for the "Today is your birthday" line on the page.
  birthdayDate: '2026-11-01T00:00:00+05:30',

  // Mam's photo for the big arch frame and the mouse-drag stickers.
  // Example: 'mam.jpg'  (file goes in public/mam.jpg). Empty = smiley placeholder.
  mamPhoto: 'mam.jpg',

  // Small round face photo used for the mouse-drag stickers. Empty = uses mamPhoto.
  mamSticker: 'mam-face.jpg',

  // Up to 4 photos for the wall of memories. Files go in public/photos/
  // Example: { src: 'photos/1.jpg', caption: 'Our class trip' }
  photos: [
    { src: 'photos/1.jpg', caption: '' },
    { src: 'photos/2.jpg', caption: '' },
    { src: 'photos/3.jpg', caption: '' },
    { src: 'photos/4.jpg', caption: '' },
  ],

  // Video file in the public folder. Example: 'video.mp4'. Empty = placeholder frame.
  video: 'video/video_with_song.mp4',

  // Background song in the public folder. Example: 'song.mp3'. Empty = no music button.
  song: 'song.mp3',

  // Real wishes from students. They show on the wish wall for everyone.
  wishes: [
    // { name: 'Rohith', text: 'Thank you for everything, Mam!' },
  ],
};
