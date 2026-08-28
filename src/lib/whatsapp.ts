export const contactWhatsappNumber = "5567991939487";

export function buildWhatsappUrl(message: string, number = contactWhatsappNumber) {
  return `https://api.whatsapp.com/send?phone=${number.replace(/\D/g, "")}&text=${encodeURIComponent(message)}`;
}
