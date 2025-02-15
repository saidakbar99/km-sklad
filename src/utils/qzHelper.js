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

export async function printLabel(
  printerName, 
  serialNumber,
  demandNumber,
  furnitureFullname,
  color
) {
  await connectQZTray();
  
  const config = qz.configs.create(printerName, { encoding: 'UTF-8' });
  const zplCommand = `
^XA
^CI28
^FO20,200
^BQN,2,20
^FD   ${serialNumber}^FS

^FO30,100
^AUN,60,60
^FD${furnitureFullname}^FS

^FO300,230
^AUN,60,60
${demandNumber ? `^FDЗаказ# ${demandNumber}^FS` : ''}

^FO300,360
^AUN,60,60
^FD${`Серия# ${serialNumber}`}^FS

^FO300,500
^AUN,50,50
${color ? `^FDРанги: ${color}^FS` : ''}
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
