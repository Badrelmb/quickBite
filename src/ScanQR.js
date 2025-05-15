// ScanQR.js
import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

export default function ScanQR() {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        // Try to find a back-facing camera
const backCamera = devices.find(device =>
  device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment')
);

const cameraId = backCamera ? backCamera.id : devices[0].id;


        scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250
          },
          (decodedText) => {
            // Stop scanner and redirect
            scanner.stop().then(() => {
              navigate(decodedText); // QR should contain full path like /client-order?restaurant_id=...&table=...
            });
          },
          (errorMsg) => {
            // console.warn("QR error", errorMsg);
          }
        );
      }
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [navigate]);

  return (
    <div style={{ padding: '40px' }}>
      <h2>📷 Scan Restaurant QR Code</h2>
      <div id="qr-reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} />
    </div>
  );
}
