import { writeFileSync } from "fs"
import { createInterface } from "readline"

const content = "Test content"
const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})

const readLineAsync = message => {
    return new Promise(resolve => {
        readline.question(message, answer => {
            resolve(answer)
        })
    })
}

try {

    writeFileSync("./test.txt", content)

} catch (err) {
    console.error(err)
}