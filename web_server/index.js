import express from "express"
import workingHours from "./data/workingHours.js";
import menuItems from "./data/menuItems.js";

const app = express()
app.set("view engine", "ejs")
const port = 3000

app.get("/", (req, res) => {
    res.render("index", {name: "Welcome to What's Fare is Fair!"})
})

app.get("/menu", (req, res) => {
    res.render("menu", {menuItems})
})

app.get("/hours", (req, res) => {
    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];
    res.render("hours", {workingHours, days})
})

app.listen(port, () => {
    console.log(`Web Server is listening at localhost:${port}`)
})