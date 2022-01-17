const fs = require('fs');

// Membuat folder untuk menyimpan data json
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// Membuat file contacts.json jika belum ada 
const dataPath =  './data/contacts.json';
if(!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

/* Get All data in contact.json */
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
};

/* Find a contact with the specified name*/
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
};

// Menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// Menambahkan data contatt baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact); 
    saveContacts(contacts);
};

// Cek nama yang duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
}


// Fitur delete contact 
const deleteContact = (nama) => {
    const contacts = loadContact();
    const fileterdContacts = contacts.filter((contact) => contact.nama !== nama);
    saveContacts(fileterdContacts);
};

// Mengubah contacts
const updateContacts = (contactBaru) => {
    const contacts = loadContact();
    // Hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };