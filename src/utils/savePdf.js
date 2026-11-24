import { Capacitor } from '@capacitor/core';

// Saves a jsPDF document.
//  - Browser: normal download.
//  - Android app: the WebView can't download blob files, so the PDF is written to the
//    phone's Documents folder and the share sheet opens (open in a PDF viewer, WhatsApp, Drive...).
export const savePdf = async (pdf, filename) => {
  if (!Capacitor.isNativePlatform()) {
    pdf.save(filename);
    return;
  }
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const { Share } = await import('@capacitor/share');
  const data = pdf.output('datauristring').split(',')[1];
  const path = `MedicsTech/${filename}`;

  let uri;
  try {
    ({ uri } = await Filesystem.writeFile({ path, data, directory: Directory.Documents, recursive: true }));
  } catch {
    // Some Android versions block the public folder; the app's own cache always works
    ({ uri } = await Filesystem.writeFile({ path: filename, data, directory: Directory.Cache }));
  }
  try {
    await Share.share({ title: filename, url: uri, dialogTitle: 'Open or share prescription' });
  } catch {
    // user closed the share sheet; the file is already saved
  }
};
