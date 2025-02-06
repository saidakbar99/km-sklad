import qz from "qz-tray";

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

export async function printLabel(printerName) {
  await connectQZTray();
  
  const config = qz.configs.create(printerName);
  const zplCommand = `
^XA
^CI28
^FO100,400
^BQN,2,10
^FDMM,A:/qrcode.svg^FS

^FO300,400
^A0N,40,40
^FDSeriya# 000014^FS

^FO400,460
^A0N,40,40
^FDZakaz# 012DV^FS

^FO400,520
^A0N,30,30
^FDSP Bosfor Shkaf^FS

^FO470,570
^A0N,20,20
^FDRangi: Tilla xal^FS

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
