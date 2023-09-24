const dotenv = require('dotenv')
dotenv.config()

const sdk = require('api')('@opensea/v2.0#4gioue1qll6w3x3p');

const CHAIN = process.env.CHAIN
const ADDRESS = process.env.ADDRESS
const IDENTIFIER_START = process.env.IDENTIFIER_START
const IDENTIFIER_END = process.env.IDENTIFIER_END
const API_KEY = process.env.API_KEY

sdk.auth(API_KEY);

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
            .then(({ data }) => console.log(data))
            .catch(err => {
                console.log(err?.data?.errors)
                // console.error(err)
            });
        await delayMs(100)
        console.log(`===refresh ${identifier} end===`)
    }
    console.log('===refresh end===')
}


async function main() {
    try {
        console.log("==refreshNftMetadata setInterval==");
        setInterval(async () => { await refreshNftMetadata(CHAIN, ADDRESS, IDENTIFIER_START, IDENTIFIER_END) }, 10_000_000);
        console.log("==refreshNftMetadata epoch==");
        await refreshNftMetadata(CHAIN, ADDRESS, IDENTIFIER_START, IDENTIFIER_END)
    } catch (error) {
        console.log('checkOffer catch error: ', error);
    }
}

main()
