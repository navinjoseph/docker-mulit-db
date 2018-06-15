// Should be refactored by both the client and server
export const sanatizeCurrency = currency => {
  const reassign = {
    IOT: 'MIOTA',
    PROPS: 'PRO'
  }

  if (reassign[currency]) {
    return reassign[currency]
  }
  return currency
}
