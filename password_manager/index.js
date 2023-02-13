import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import {MongoClient} from "mongodb";

let hasPassword = false;
const client = new MongoClient("mongodb://localhost:27017")
const dbName = "passwordManager";

const prompt = promptModule();

const main = async () => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const authCollection = db.collection("auth");
    const passwordCollection = db.collection("passwords");
    const hashedPassword = await authCollection.findOne({ type: "auth" } );
    hasPassword = !!hashedPassword;
    return [passwordCollection, authCollection];
}


const mockDB = {
    passwords: {}
}

const saveNewPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10);
    mockDB.hash = hash;
    console.log("Password has been saved!");
}

const compareHashedPassword = async (password) => {
    const { hash } = mockDB;
    return await bcrypt.compare(password, hash);
}

const promptNewPassword = () => {
    const response = prompt("Enter a main password: ");
    saveNewPassword(response);
    showMenu();
}

const promptOldPassword = async () => {
    const response = prompt("Enter your password: ");
    const result = await compareHashedPassword(response);
    if (result) {
        console.log("Password verified.");
        showMenu();
    } else {
        console.log("Password incorrect.");
        promptOldPassword();
    }
}

const showMenu = async () => {
    console.log(`
    1. View passwords
    2. Manage new passwords
    3. Verify password
    4. Exit`);

    const response = prompt(">");

    if (response === "1") await viewPasswords();
    else if (response === "2") await promptManageNewPassword();
    else if (response === "3") await promptOldPassword();
    else if (response === "4") await process.exit();
    else {
        console.log(`That's an invalid response`);
        showMenu();
    }
}

const viewPasswords = async () => {
    const passwords = await passwordsCollection.find({}).toArray();
    Object.entries(passwords).forEach(([key, {source, password}], index) => {
        console.log(`${index + 1}. ${source} => ${password}`);
    });
    showMenu();
}

const promptManageNewPassword = async () => {
    const source = prompt("Enter name for password: ");
    const password = prompt("Enter password to save: ");

   await passwordsCollection.findOneAndUpdate(
       { source }, { $set: { password } },
     {
             returnNewDocument: true,
             upsert: true
             }
   )
    console.log(`Password for ${source} has been saved!`);
    showMenu();
}

const [passwordsCollection, authCollection] = await main()
if (!hasPassword) promptNewPassword();
else promptOldPassword();
