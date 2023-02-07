import { writeFileSync } from "fs"
import { appendFileSync } from "fs"
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

class Person {
    constructor(name = "", number = "", email = "") {
        this.name = name
        this.number = number
        this.email = email
    }

    saveToCSV() {
        const content = `${this.name},${this.number},${this.email}`
        try {
            appendFileSync("./contacts.csv", content)
        } catch (err) {
            console.error(err)
        }
    }
}

const startApp = async () => {
    const person = new Person()
    person.name = await readLineAsync("Contact Name: ")
    person.number = await readLineAsync("Contact Number: ")
    person.email = await readLineAsync("Contact Email: ")
    person.saveToCSV()
    const response = await readLineAsync("Continue? [y to continue]: ")
    if (response === "y") await startApp()
    else readline.close()
}

startApp()
