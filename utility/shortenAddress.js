export const shortenAddress = (longAddress) => {
    let firstPart = longAddress.substring(0,5)
    let lastPart = longAddress.substring(longAddress.length - 5, longAddress.length)
    let result = `${firstPart}...${lastPart}`
    console.log('in shorten address', result)
    return `Connected wallet: ${result}` 
}

export default shortenAddress