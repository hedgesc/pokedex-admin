export const wait = async (seconds) => {
  console.log(`waiting ${seconds} seconds`)
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}
