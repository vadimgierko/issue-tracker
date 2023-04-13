export default function getDate(timestamp: number) {
  if (!timestamp) return null

const date = new Date(timestamp)

return date.toLocaleString("sv")
}