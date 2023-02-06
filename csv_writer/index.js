import { writeFileSync } from "fs"

const content = "Test content"

try {
    writeFileSync("./test.txt", content)
} catch (err) {
    console.error(err)
}