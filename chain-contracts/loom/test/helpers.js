module.exports = {
  // see migrations
  buildInGameAsteriskPermanenceBytes32: (kind, param, price) => {
    const d = (kind | (param << 8) | (price << 16)).toString(16)
    return "0x" + zeroPadding(d, 64)
  },
  buildUserGoldPermanenceBytes32: (balance, confirmedAt) => {
    return "0x" + balance.or(confirmedAt.shln(200)).toString(16, 64)
  }
}

const zeroPadding = (n, len) => {
  if (`${n}`.length > len) {
    throw new Error(`wrong range (zeroPadding): ${n}`)
  }
  return ("0".repeat(len - 1) + n).slice(-len)
}
