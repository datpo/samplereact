import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'http://10.30.1.40:8080/auth',
  realm: 'cybertaxv2',
  clientId: 'taxfrontend',
});

export default keycloak;
