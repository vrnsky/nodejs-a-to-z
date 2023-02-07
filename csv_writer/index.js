import { appendFileSync } from "fs"
import { createInterface } from "readline"
import prompt from "prompt"

prompt.start()
prompt.message = "";


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
    const responses = await prompt.get([
        {
            name: "name",
            description: "Contact Name"
        },
        {
            name: "number",
            description: "Contact Number"
        },
        {
            name: "email",
            description: "Contact Email"
        }
    ])
    Object.assign(person, responses)
    person.saveToCSV()
    const { again } = await prompt.get([
        {
            name: "again",
            description: "Continue? [y to continue]"
        }
    ])
    if (again === "y") await startApp()
}

startApp()
