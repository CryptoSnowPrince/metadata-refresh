const dotenv = require('dotenv')
dotenv.config()

const sdk = require('api')('@opensea/v2.0#4gioue1qll6w3x3p');

const CHAIN = process.env.CHAIN
const ADDRESS = process.env.ADDRESS
const IDENTIFIER_START = process.env.IDENTIFIER_START
const IDENTIFIER_END = process.env.IDENTIFIER_END
const API_KEY = process.env.API_KEY
const DELAY_PER_REQ = process.env.DELAY_PER_REQ
const EPOCH_TIME = process.env.EPOCH_TIME

sdk.auth(API_KEY);

let success = 0
let fail = 0

function delayMs(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
        console.log(`${ms}ms delay...`)
    });
}

async function refreshNftMetadata(chain, address, identifier_start, identifier_end) {
    console.log('===refresh start===')
    for (let identifier = identifier_start; identifier <= identifier_end; identifier++) {
        console.log(`===refresh ${identifier} start===`)
        await sdk.refreshNftMetadata({ chain, address, identifier })
            .then(({ data }) => {
                success++
                console.log(data)
                console.log('success: ', success)
            })
            .catch(err => {
                fail++
                console.log(err?.data)
                // console.error(err)
                console.log('fail: ', fail)
            });
        await delayMs(DELAY_PER_REQ)
        console.log(`===refresh ${identifier} end===`)
    }
    console.log(`===refresh success=${success}===`)
    console.log(`===refresh fail=${fail}===`)
    console.log('===refresh end===')
}


async function main() {
    try {
        console.log("==refreshNftMetadata setInterval==");
        setInterval(async () => { await refreshNftMetadata(CHAIN, ADDRESS, IDENTIFIER_START, IDENTIFIER_END) }, EPOCH_TIME);
        console.log("==refreshNftMetadata epoch==");
        await refreshNftMetadata(CHAIN, ADDRESS, IDENTIFIER_START, IDENTIFIER_END)
    } catch (error) {
        console.log('checkOffer catch error: ', error);
    }
}

main()
