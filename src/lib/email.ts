import { Resend } from "resend";
import { formatPrice } from "./utils";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

interface EmailItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  customerNotes?: string;
  items: EmailItem[];
  total: number;
}

export async function sendOrderEmail(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Segoe UI,system-ui,sans-serif;background:#f5f5f5;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:#0B2545;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:20px">Nuevo Pedido</h1>
      <p style="color:#94a3b8;margin:4px 0 0;font-size:14px">TropicalesJW</p>
    </div>
    <div style="padding:24px">
      <p style="font-size:14px;color:#666">Se ha recibido un nuevo pedido.</p>
      <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0 0 4px"><strong>Pedido #${data.orderId.slice(-8).toUpperCase()}</strong></p>
        <p style="margin:0;color:#666;font-size:13px">${data.customerName}</p>
        <p style="margin:0;color:#666;font-size:13px">${data.customerEmail}</p>
        ${data.customerPhone ? `<p style="margin:0;color:#666;font-size:13px">Tel: ${data.customerPhone}</p>` : ""}
        ${data.shippingAddress ? `<p style="margin:0;color:#666;font-size:13px">${data.shippingAddress}</p>` : ""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f8f8f8">
            <th style="padding:8px 12px;text-align:left">Producto</th>
            <th style="padding:8px 12px;text-align:center">Cant</th>
            <th style="padding:8px 12px;text-align:right">Precio</th>
            <th style="padding:8px 12px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="border-top:2px solid #0B2545;padding:12px 0;margin-top:8px;text-align:right">
        <strong style="font-size:18px">Total: ${formatPrice(data.total)}</strong>
      </div>
      <p style="font-size:13px;color:#666;margin-top:16px">
        <strong>Método de pago:</strong> Pago contra entrega
      </p>
      ${data.customerNotes ? `<div style="background:#fff8e1;border-radius:8px;padding:12px;margin-top:12px"><p style="margin:0;font-size:13px;color:#856404"><strong>Notas:</strong> ${data.customerNotes}</p></div>` : ""}
    </div>
    <div style="background:#f8f8f8;padding:16px;text-align:center;font-size:12px;color:#999">
      TropicalesJW — Productos Tropicales Frescos
    </div>
  </div>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: "Pedidos <onboarding@resend.dev>",
      to: "theoffice7075@gmail.com",
      subject: `Nuevo pedido #${data.orderId.slice(-8).toUpperCase()} — ${formatPrice(data.total)}`,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}