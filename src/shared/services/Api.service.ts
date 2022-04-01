import axios from "axios";

const apiUsers = axios.create({
  baseURL: "http://localhost:8080",
});

const apiTickets = axios.create({
  baseURL: "http://localhost:8081",
});

const apiAuth = axios.create({
  baseURL: "http://localhost:3000",
});

const apiReports = axios.create({
  baseURL: "http://localhost:8082",
});

export { apiUsers, apiTickets, apiAuth, apiReports };