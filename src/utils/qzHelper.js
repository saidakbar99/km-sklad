import qz from "qz-tray";
// import iconv from "iconv-lite/encodings";
// import iconv from "iconv-lite/encodings";
import transliterate from "transliterate";
// import encodings from "iconv-lite/encodings";
// iconvLite.encodingExists("foo")

export const connectQZTray = async () => {
  if (!qz.websocket.isActive()) {
    try {
      await qz.websocket.connect();
      console.log('Connected to QZ Tray');
    } catch (error) {
      console.error('Failed to connect to QZ Tray:', error);
    }
  }
};

export async function getPrinters() {
  await connectQZTray();
  return qz.printers.find();
}

// function encodeToWin1251(text) {
//   return iconvLite.encode(text, "win1251").toString("binary");
// }

export async function printLabel(
  printerName, 
  serialNumber,
  demandNumber,
  furnitureFullname,
  color
) {
  await connectQZTray();
  
  const config = qz.configs.create(printerName);
  const zplCommand = `
^XA
^CI28  ; Enable UTF-8 encoding
^CWZ,E:TT0003M_.FNT  ; Load a TTF font
^FO40,400
^BQN,2,20
^FD{${serialNumber}}^FS

^FO50,300
^A0N,60,60
^FD${transliterate(furnitureFullname)}^FS

^FO300,430
^A0N,60,60
${demandNumber ? transliterate(`^FDZakaz# ${demandNumber}^FS`) : ''}

^FO300,560
^A0N,60,60
^FD${transliterate(`Серия# ${serialNumber}`)}^FS

^FO300,700
^A0N,50,50
${color ? transliterate(`^FDРанги: ${color}^FS`) : ''}
^XZ
  `;

  try {
    await qz.print(config, [zplCommand]);
    console.log("Print job sent successfully");
  } catch (error) {
    console.error("Print error:", error);
  }
}

// Development mode: Disable signature and certificate requests
export const setupQZSecurity = () => {
  // Disable signature and certificate handling in development
  if (process.env.NODE_ENV === 'development') {
    qz.security.setSignaturePromise(() => Promise.resolve(null));
    qz.security.setCertificatePromise(() => Promise.resolve(null));
  } else {
    // Production: Set actual signing logic (implement server-side signature)
    qz.security.setSignaturePromise((toSign) => {
      return fetch('/sign-message', {
        method: 'POST',
        body: JSON.stringify({ request: toSign }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.text())
        .catch((error) => {
          console.error('Signing failed:', error);
          return null;
        });
    });

    // Production: Set certificate handling (implement server-side certificate)
    qz.security.setCertificatePromise(() => {
      return fetch('/qz-certificate.txt')
        .then((res) => res.text())
        .catch((error) => {
          console.error('Certificate retrieval failed:', error);
          return null;
        });
    });
  }
};
