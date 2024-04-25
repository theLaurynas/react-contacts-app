import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function register(data) {
  const response = await fetch("http://localhost:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  const user = { ...result, email: data.email };

  if (!isCookieSet("user")) {
    setCookie("user", JSON.stringify(user));
    console.log("Logged in!");
  } else {
    console.error("You are already logged in!");
  }
}

export async function login(data) {
  const response = await fetch("http://localhost:8080/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const user = { ...result, email: data.email };

  if (!isCookieSet("user")) {
    setCookie("user", JSON.stringify(user));
    console.log("Logged in!");
  } else {
    console.error("You are already logged in!");
  }
}

export function logout() {
  deleteCookie("user");
}

export async function getContacts(query) {
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }

  const jwt = getJwt();
  if (jwt != "") {
    const response = await fetch("http://localhost:8080/api/v1/test", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    return data;
  } else {
    return [];
  }
  //return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  let id = Math.random().toString(36).substring(2, 9);
  let contact = {
    id,
    createdAt: Date.now(),
  };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id) {
  let contacts = [];

  const jwt = getJwt();
  if (jwt != "") {
    const response = await fetch("http://localhost:8080/api/v1/test", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    contacts = await response.json();
  }

  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id, updates) {
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

export function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

export function deleteCookie(cname) {
  let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = cname + "=nothing;" + expires + ";path=/;SameSite=Strict";
}

export function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function isCookieSet(cname) {
  return getCookie(cname) != "";
}

function getJwt() {
  const user = getCookie("user");
  if (user != "") {
    const token = JSON.parse(user).token;
    return token;
  }
  console.error("Not logged in!");
  return "";
}
